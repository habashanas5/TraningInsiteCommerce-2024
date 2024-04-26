/* eslint-disable spire/export-styles */
import { GetBillTosApiParameter, GetShipTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSession } from "@insite/client-framework/Store/Context/ContextSelectors";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import AddressesSelectCustomerContainer from "@insite/content-library/Widgets/Header/AddressDrawerSelectCustomerContainer";
import React from "react";
import { connect } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const { isAuthenticated, isGuest } = getSession(state);
    return {
        showAddressesSelector: isAuthenticated && !isGuest,
        billToId: state.components.addressDrawer.selectedBillTo?.id,
    };
};

type Props = ReturnType<typeof mapStateToProps>;

const AddressDrawerSelectCustomer = ({ showAddressesSelector, billToId }: Props) => {
    const [billTosParameter, setBillTosParameter] = React.useState<GetBillTosApiParameter>({
        page: 1,
        pageSize: 20,
        expand: ["shipTos"],
    });
    const [shipTosParameter, setShipTosParameter] = React.useState<GetShipTosApiParameter>({
        billToId,
        page: 1,
        pageSize: 20,
        expand: ["validation", "excludeShowAll", "excludeOneTime", "excludeCreateNew"],
    });

    const temp = (parameter: GetShipTosApiParameter) => {
        setShipTosParameter(parameter);
    };

    if (!showAddressesSelector) {
        return null;
    }

    return (
        <AddressesSelectCustomerContainer
            billTosParameter={billTosParameter}
            setBillTosParameter={setBillTosParameter}
            shipTosParameter={shipTosParameter}
            setShipTosParameter={temp}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(AddressDrawerSelectCustomer),
    definition: {
        displayName: "Customer Selector",
        fieldDefinitions: [],
        group: "Header",
    },
};

export default widgetModule;
