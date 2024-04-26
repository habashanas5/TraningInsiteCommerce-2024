import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import Zone from "@insite/client-framework/Components/Zone";
import { GetAccountsApiParameter } from "@insite/client-framework/Services/AccountService";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import {
    getAccountsDataView,
    getCurrentAccountState,
} from "@insite/client-framework/Store/Data/Accounts/AccountsSelector";
import loadAccount from "@insite/client-framework/Store/Data/Accounts/Handlers/LoadAccount";
import loadAccounts from "@insite/client-framework/Store/Data/Accounts/Handlers/LoadAccounts";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import updateSearchFields from "@insite/client-framework/Store/Pages/UserList/Handlers/UpdateSearchFields";
import PageModule from "@insite/client-framework/Types/PageModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Page from "@insite/mobius/Page";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import isEmpty from "lodash/isEmpty";
import qs from "qs";
import React, { Component } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    accountsDataView: getAccountsDataView(state, state.pages.userList.getAccountsParameter),
    getAccountsParameter: state.pages.userList.getAccountsParameter,
    location: getLocation(state),
    currentAccountState: getCurrentAccountState(state),
});

const mapDispatchToProps = {
    loadAccounts,
    loadAccount,
    updateSearchFields,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasHistory;

class UserListPage extends Component<Props> {
    componentDidMount() {
        const parsed = parseQueryString<GetAccountsApiParameter | undefined>(this.props.location.search);
        const apiParameter = { ...this.props.getAccountsParameter, ...parsed };
        if (!isEmpty(apiParameter)) {
            this.props.updateSearchFields({
                ...apiParameter,
                type: "Replace",
            });
        }
    }

    componentDidUpdate(prevProps: Props) {
        if (
            this.props.getAccountsParameter !== prevProps.getAccountsParameter ||
            (!this.props.accountsDataView.value && !this.props.accountsDataView.isLoading)
        ) {
            this.props.loadAccounts(this.props.getAccountsParameter);
        }
        if (!this.props.currentAccountState.value && !this.props.currentAccountState.isLoading) {
            this.props.loadAccount({ accountId: API_URL_CURRENT_FRAGMENT });
        }
        if (this.props.getAccountsParameter !== prevProps.getAccountsParameter) {
            const queryString = qs.stringify(this.props.getAccountsParameter);
            this.props.history.replace(`${this.props.location.pathname}${queryString !== "" ? `?${queryString}` : ""}`);
        }
    }

    render() {
        return (
            <Page data-test-selector="userAdministrationPage">
                <Zone zoneName="Content" contentId={this.props.id} />
            </Page>
        );
    }
}

const page: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(UserListPage)),
    definition: {
        hasEditableTitle: true,
        hasEditableUrlSegment: true,
        pageType: "System",
    },
};

export const UserListPageContext = "UserListPage";
export default page;
