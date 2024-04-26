import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getAddressFieldsDataView } from "@insite/client-framework/Store/Data/AddressFields/AddressFieldsSelector";
import loadAddressFields from "@insite/client-framework/Store/Data/AddressFields/Handlers/LoadAddressFields";
import { getCurrentBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import loadCurrentBillTo from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadCurrentBillTo";
import { getCountriesDataView } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";
import loadCurrentCountries, {
    loadCurrentCountriesParameter,
} from "@insite/client-framework/Store/Data/Countries/Handlers/LoadCurrentCountries";
import loadCurrentShipTo from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadCurrentShipTo";
import { getCurrentShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => {
    const addressFieldsDataView = getAddressFieldsDataView(state);
    const countriesDataView = getCountriesDataView(state, loadCurrentCountriesParameter);
    return {
        currentBillToState: getCurrentBillToState(state),
        currentShipToState: getCurrentShipToState(state),
        shouldLoadAddressFields: !addressFieldsDataView.value && !addressFieldsDataView.isLoading,
        shouldLoadCountries: !countriesDataView.value && !countriesDataView.isLoading,
    };
};

const mapDispatchToProps = {
    loadCurrentBillTo,
    loadCurrentShipTo,
    loadAddressFields,
    loadCurrentCountries,
};

type Props = PageProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

class AddressesPage extends React.Component<Props> {
    UNSAFE_componentWillMount() {
        const {
            currentBillToState,
            currentShipToState,
            shouldLoadAddressFields,
            shouldLoadCountries,
            loadCurrentBillTo,
            loadCurrentShipTo,
            loadAddressFields,
            loadCurrentCountries,
        } = this.props;

        if (!currentBillToState.value && !currentBillToState.isLoading) {
            loadCurrentBillTo();
        }
        if (!currentShipToState.value && !currentShipToState.isLoading) {
            loadCurrentShipTo();
        }
        if (shouldLoadAddressFields) {
            loadAddressFields();
        }
        if (shouldLoadCountries) {
            loadCurrentCountries();
        }
    }
    render() {
        return (
            <Page>
                <Zone contentId={this.props.id} zoneName="Content" />
            </Page>
        );
    }
}

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(AddressesPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const AddressesPageContext = "AddressesPage";
