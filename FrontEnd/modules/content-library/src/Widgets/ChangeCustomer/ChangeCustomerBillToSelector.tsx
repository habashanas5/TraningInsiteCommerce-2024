import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { GetBillTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getBillTosDataView } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import loadBillTos from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadBillTos";
import translate from "@insite/client-framework/Translate";
import { BillToModel } from "@insite/client-framework/Types/ApiModels";
import DynamicDropdown, { DynamicDropdownPresentationProps, OptionObject } from "@insite/mobius/DynamicDropdown";
import React, { FC, useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";

interface OwnProps {
    noShipToAndCantCreate: boolean;
    setParameter: (parameter: GetBillTosApiParameter) => void;
    parameter: GetBillTosApiParameter;
    billTo?: BillToModel;
    onSelect: (billTo: BillToModel) => void;
    extendedStyles?: ChangeCustomerBillToSelectorStyles;
    isLoading?: boolean;
}

const mapStateToProps = (state: ApplicationState, props: OwnProps) => ({
    billTosDataView: getBillTosDataView(state, props.parameter),
    customerSettings: getSettingsCollection(state).customerSettings,
});

const mapDispatchToProps = {
    loadBillTos,
};

type Props = OwnProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

export interface ChangeCustomerBillToSelectorStyles {
    billToSelectorDynamicDropdown?: DynamicDropdownPresentationProps;
}

export const changeCustomerBillToSelectorStyles: ChangeCustomerBillToSelectorStyles = {};

const ChangeCustomerBillToSelector: FC<Props> = ({
    noShipToAndCantCreate,
    parameter,
    setParameter,
    billTo,
    onSelect,
    extendedStyles,
    isLoading,
    billTosDataView,
}) => {
    const [styles] = useState(() => mergeToNew(changeCustomerBillToSelectorStyles, extendedStyles));
    const [options, setOptions] = useState<OptionObject[]>([]);

    useEffect(() => {
        if (billTosDataView.value) {
            const options: OptionObject[] = billTosDataView.value.map(billTo => ({
                optionText: billTo.label,
                optionValue: billTo.id,
            }));
            setOptions(options);
        }
    }, [billTosDataView]);

    const searchTextChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setParameter({
            ...parameter,
            filter: event.currentTarget.value,
        });
    };

    const selectCustomerHandler = (billToId?: string) => {
        if (billTosDataView.value && billToId) {
            const billTo = billTosDataView.value.filter(billTo => billTo.id === billToId)[0];
            if (billTo) {
                onSelect(billTo as BillToModel);
            }
        }
    };

    return (
        <DynamicDropdown
            label={translate("Select Bill To")}
            {...styles.billToSelectorDynamicDropdown}
            onSelectionChange={selectCustomerHandler}
            onInputChange={searchTextChanged}
            selected={billTo?.id}
            options={options}
            placeholder={translate("Search or Select Bill To")}
            isLoading={isLoading}
            error={noShipToAndCantCreate && siteMessage("SignIn_NoShipToAndCantCreate")}
            data-test-selector="changeCustomerBillToSelector"
        />
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeCustomerBillToSelector);
