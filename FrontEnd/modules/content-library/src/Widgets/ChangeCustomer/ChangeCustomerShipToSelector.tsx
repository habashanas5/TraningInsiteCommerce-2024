import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { GetShipTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import { FulfillmentMethod } from "@insite/client-framework/Services/SessionService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getShipTosDataView } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import translate from "@insite/client-framework/Translate";
import { ShipToModel } from "@insite/client-framework/Types/ApiModels";
import DynamicDropdown, { DynamicDropdownPresentationProps, OptionObject } from "@insite/mobius/DynamicDropdown";
import React, { FC, useEffect, useState } from "react";
import { connect } from "react-redux";

interface OwnProps {
    extendedStyles?: ChangeCustomerShipToSelectorStyles;
    setParameter: (parameter: GetShipTosApiParameter) => void;
    parameter: GetShipTosApiParameter;
    searchText: string;
    setSearchText: (searchText: string) => void;
    enableWarehousePickup: boolean;
    fulfillmentMethod: string;
    shipTo?: ShipToModel;
    billToId?: string;
    allowSelectBillTo?: boolean;
    onSelect: (shipTo: ShipToModel) => void;
    onCreateNewAddressClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    isLoading?: boolean;
}

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

const mapStateToProps = (state: ApplicationState, props: OwnProps) => ({
    shipTosDataView: getShipTosDataView(state, props.parameter),
});

export interface ChangeCustomerShipToSelectorStyles {
    shipToSelectorDynamicDropdown?: DynamicDropdownPresentationProps;
}

export const changeCustomerShipToSelectorStyles: ChangeCustomerShipToSelectorStyles = {};

const ChangeCustomerShipToSelector: FC<Props> = ({
    extendedStyles,
    shipTo,
    billToId,
    shipTosDataView,
    onSelect,
    parameter,
    setParameter,
    searchText,
    setSearchText,
    enableWarehousePickup,
    fulfillmentMethod,
    isLoading,
}) => {
    const [styles] = useState(() => mergeToNew(changeCustomerShipToSelectorStyles, extendedStyles));
    const [options, setOptions] = useState<OptionObject[]>([]);
    let dropdownLabel = translate("Select Ship To");
    let dropdownPlaceholder = translate("Search or Select Ship To");

    if (enableWarehousePickup && fulfillmentMethod === FulfillmentMethod.PickUp) {
        dropdownLabel = translate("Recipient Address");
        dropdownPlaceholder = translate("Search or Select Recipient Address");
    }

    useEffect(() => setLoadShipTosParameter(), [billToId]);

    useEffect(() => {
        if (shipTosDataView.value) {
            const options: OptionObject[] = shipTosDataView.value.map(billTo => ({
                optionText: billTo.label,
                optionValue: billTo.id,
            }));
            setOptions(options);
            if (!shipTo && shipTosDataView.value.length === 1) {
                onSelect(shipTosDataView.value[0]);
            }
        }
    }, [shipTosDataView]);

    const selectCustomerHandler = (shipToId?: string) => {
        if (shipTosDataView.value && shipToId) {
            const shipTo = shipTosDataView.value.filter(shipTo => shipTo.id === shipToId)[0];
            if (shipTo) {
                onSelect(shipTo as ShipToModel);
            }
        }
    };

    const searchTextChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchText(event.currentTarget.value);
        setLoadShipTosParameter();
    };

    const setLoadShipTosParameter = () => {
        const apiParameter: GetShipTosApiParameter = {
            ...parameter,
            billToId,
            filter: searchText || undefined,
        };
        setParameter(apiParameter);
    };

    return (
        <DynamicDropdown
            {...styles.shipToSelectorDynamicDropdown}
            label={dropdownLabel}
            onSelectionChange={selectCustomerHandler}
            onInputChange={searchTextChanged}
            selected={shipTo?.id}
            placeholder={dropdownPlaceholder}
            isLoading={isLoading}
            options={options}
            data-test-selector="changeCustomerShipToSelector"
        />
    );
};

export default connect(mapStateToProps)(ChangeCustomerShipToSelector);
