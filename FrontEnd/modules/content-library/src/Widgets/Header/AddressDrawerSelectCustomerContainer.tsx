import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { GetBillTosApiParameter, GetShipTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import selectBillTo from "@insite/client-framework/Store/Components/AddressDrawer/Handlers/SelectBillTo";
import selectShipTo from "@insite/client-framework/Store/Components/AddressDrawer/Handlers/SelectShipTo";
import setAsDefault from "@insite/client-framework/Store/Components/AddressDrawer/Handlers/SetAsDefault";
import { getSession, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getBillTosDataView } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import loadBillTos from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadBillTos";
import loadShipTos from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadShipTos";
import { getShipTosDataView } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import { BillToModel, ShipToModel } from "@insite/client-framework/Types/ApiModels";
import ChangeCustomerBillToSelector, {
    ChangeCustomerBillToSelectorStyles,
} from "@insite/content-library/Widgets/ChangeCustomer/ChangeCustomerBillToSelector";
import ChangeCustomerShipToSelector, {
    ChangeCustomerShipToSelectorStyles,
} from "@insite/content-library/Widgets/ChangeCustomer/ChangeCustomerShipToSelector";
import Checkbox, { CheckboxPresentationProps } from "@insite/mobius/Checkbox";
import CheckboxGroup, { CheckboxGroupComponentProps } from "@insite/mobius/CheckboxGroup";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import React from "react";
import { connect, ResolveThunks } from "react-redux";

interface OwnProps {
    billTosParameter: GetBillTosApiParameter;
    setBillTosParameter: (parameter: GetBillTosApiParameter) => void;
    shipTosParameter: GetShipTosApiParameter;
    setShipTosParameter: (parameter: GetShipTosApiParameter) => void;
    extendedStyles?: AddressDrawerSelectCustomerContainerStyles;
}

const mapStateToProps = (state: ApplicationState, props: OwnProps) => {
    const { fulfillmentMethod, selectedBillTo, selectedShipTo, isDefault } = state.components.addressDrawer;
    const {
        accountSettings: { enableWarehousePickup, requireSelectCustomerOnSignIn },
        customerSettings,
    } = getSettingsCollection(state);
    return {
        selectedBillTo,
        selectedShipTo,
        shipTosDataView: getShipTosDataView(state, props.shipTosParameter),
        billTosDataView: getBillTosDataView(state, props.billTosParameter),
        fulfillmentMethod,
        enableWarehousePickup,
        customerSettings,
        isDefault,
        showIsDefaultCheckbox: !requireSelectCustomerOnSignIn,
        displayChangeCustomerLink: state.context?.session?.displayChangeCustomerLink,
    };
};

const mapDispatchToProps = {
    loadBillTos,
    loadShipTos,
    selectBillTo,
    selectShipTo,
    setAsDefault,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface AddressDrawerSelectCustomerContainerStyles {
    container?: GridContainerProps;
    billToGridItem?: GridItemProps;
    billToSelector?: ChangeCustomerBillToSelectorStyles;
    shipToGridItem?: GridItemProps;
    shipToSelector?: ChangeCustomerShipToSelectorStyles;
    isDefaultGridItem?: GridItemProps;
    isDefaultCheckboxGroup?: CheckboxGroupComponentProps;
    isDefaultCheckbox?: CheckboxPresentationProps;
}

export const addressDrawerSelectCustomerContainerStyles: AddressDrawerSelectCustomerContainerStyles = {
    billToGridItem: { width: 12 },
    shipToGridItem: { width: 12 },
    isDefaultGridItem: { width: 12 },
};

const AddressesSelectCustomerContainer = ({
    billTosParameter,
    setBillTosParameter,
    shipTosParameter,
    setShipTosParameter,
    selectedBillTo,
    selectedShipTo,
    billTosDataView,
    shipTosDataView,
    fulfillmentMethod,
    enableWarehousePickup,
    customerSettings,
    isDefault,
    loadBillTos,
    loadShipTos,
    selectBillTo,
    selectShipTo,
    setAsDefault,
    extendedStyles,
    showIsDefaultCheckbox,
    displayChangeCustomerLink,
}: Props) => {
    const [styles] = React.useState(() => mergeToNew(addressDrawerSelectCustomerContainerStyles, extendedStyles));
    const [shipToSearchText, setShipToSearchText] = React.useState("");

    const [noShipToAndCantCreate, setNoShipToAndCantCreate] = React.useState<boolean>(
        customerSettings.allowCreateNewShipToAddress && !shipToSearchText && shipTosDataView.value?.length === 0,
    );

    React.useEffect(() => {
        setNoShipToAndCantCreate(
            customerSettings.allowCreateNewShipToAddress && !shipToSearchText && shipTosDataView.value?.length === 0,
        );
    }, [customerSettings, shipToSearchText, shipTosDataView]);

    React.useEffect(() => {
        if (!billTosDataView.value && !billTosDataView.isLoading) {
            loadBillTos(billTosParameter);
        }
    }, [billTosParameter, billTosDataView]);

    React.useEffect(() => {
        if (selectedBillTo && !shipTosDataView.value && !shipTosDataView.isLoading) {
            loadShipTos(shipTosParameter);
        }
    }, [shipTosParameter, shipTosDataView]);

    const billToSelectedHandler = (billTo: BillToModel) => {
        selectBillTo({ billTo });
        selectShipTo({ shipTo: undefined });
        setShipTosParameter({
            ...shipTosParameter,
            billToId: billTo.id,
        });
    };

    const shipToSelectedHandler = (shipTo: ShipToModel) => {
        selectShipTo({ shipTo });
    };

    const handleChangeDefaultAddresses = (_: React.SyntheticEvent<Element, Event>, value: boolean) => {
        setAsDefault({ isDefault: value });
    };

    if (!displayChangeCustomerLink) {
        return null;
    }

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.billToGridItem}>
                <ChangeCustomerBillToSelector
                    billTo={selectedBillTo}
                    onSelect={billToSelectedHandler}
                    parameter={billTosParameter}
                    setParameter={setBillTosParameter}
                    noShipToAndCantCreate={noShipToAndCantCreate}
                    extendedStyles={styles.billToSelector}
                    isLoading={billTosDataView.isLoading}
                />
            </GridItem>
            {selectedBillTo && (
                <>
                    <GridItem {...styles.shipToGridItem}>
                        <ChangeCustomerShipToSelector
                            shipTo={selectedShipTo}
                            onSelect={shipToSelectedHandler}
                            parameter={shipTosParameter}
                            setParameter={setShipTosParameter}
                            searchText={shipToSearchText}
                            setSearchText={setShipToSearchText}
                            enableWarehousePickup={enableWarehousePickup}
                            fulfillmentMethod={fulfillmentMethod}
                            billToId={selectedBillTo.id}
                            extendedStyles={styles.shipToSelector}
                            isLoading={shipTosDataView.isLoading}
                        />
                    </GridItem>
                    {showIsDefaultCheckbox && (
                        <GridItem {...styles.isDefaultGridItem}>
                            <CheckboxGroup {...styles.isDefaultCheckboxGroup}>
                                <Checkbox
                                    {...styles.isDefaultCheckbox}
                                    checked={isDefault}
                                    onChange={handleChangeDefaultAddresses}
                                    data-test-selector="addressDrawer_setAsDefault"
                                >
                                    {siteMessage("ChangeCustomer_Set_As_Default")}
                                </Checkbox>
                            </CheckboxGroup>
                        </GridItem>
                    )}
                </>
            )}
        </GridContainer>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(AddressesSelectCustomerContainer);
