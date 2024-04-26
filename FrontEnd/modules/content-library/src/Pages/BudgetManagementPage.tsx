import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getAccountsDataView } from "@insite/client-framework/Store/Data/Accounts/AccountsSelector";
import loadAccounts from "@insite/client-framework/Store/Data/Accounts/Handlers/LoadAccounts";
import { getCurrentBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import { getBudgetCalendarsDataView } from "@insite/client-framework/Store/Data/BudgetCalendars/BudgetCalendarsSelectors";
import loadBudgetCalendarCollection from "@insite/client-framework/Store/Data/BudgetCalendars/Handlers/LoadBudgetCalendarCollection";
import loadShipTos from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadCurrentShipTos";
import { getCurrentShipTosDataView } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import loadBillTo from "@insite/client-framework/Store/Pages/BudgetManagement/Handlers/LoadBillTo";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapDispatchToProps = {
    loadAccounts,
    loadShipTos,
    loadBillTo,
    loadBudgetCalendarCollection,
};

const mapStateToProps = (state: ApplicationState) => {
    const billToState = getCurrentBillToState(state);
    return {
        shouldLoadBudgetCalendars: !getBudgetCalendarsDataView(state).value,
        shouldLoadShipTos: !getCurrentShipTosDataView(state).value,
        shouldLoadAccounts: !getAccountsDataView(state).value,
        shouldLoadBillTo: !billToState.value || !billToState.value.costCodes,
    };
};

type Props = ResolveThunks<typeof mapDispatchToProps> & PageProps & ReturnType<typeof mapStateToProps>;

class BudgetManagementPage extends React.Component<Props> {
    componentDidMount(): void {
        if (this.props.shouldLoadAccounts) {
            this.props.loadAccounts();
        }
        if (this.props.shouldLoadShipTos) {
            this.props.loadShipTos();
        }
        if (this.props.shouldLoadBillTo) {
            this.props.loadBillTo();
        }
        if (this.props.shouldLoadBudgetCalendars) {
            this.props.loadBudgetCalendarCollection();
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
    component: connect(mapStateToProps, mapDispatchToProps)(BudgetManagementPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const BudgetManagementPageContext = "BudgetManagementPage";
