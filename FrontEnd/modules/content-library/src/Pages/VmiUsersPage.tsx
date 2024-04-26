import { getCookie } from "@insite/client-framework/Common/Cookies";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getAccountsDataView } from "@insite/client-framework/Store/Data/Accounts/AccountsSelector";
import loadAccounts from "@insite/client-framework/Store/Data/Accounts/Handlers/LoadAccounts";
import updateSearchFields from "@insite/client-framework/Store/Pages/VmiUsers/Handlers/UpdateSearchFields";
import PageModule from "@insite/client-framework/Types/PageModule";
import PageProps from "@insite/client-framework/Types/PageProps";
import Page from "@insite/mobius/Page";
import * as React from "react";
import { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    accountsDataView: getAccountsDataView(state, state.pages.vmiUsers.getVmiUsersParameter),
    getVmiUsersParameter: state.pages.vmiUsers.getVmiUsersParameter,
});

const mapDispatchToProps = {
    loadAccounts,
    updateSearchFields,
};

type Props = PageProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

const VmiUsersPage = ({ id, accountsDataView, getVmiUsersParameter, loadAccounts, updateSearchFields }: Props) => {
    useEffect(() => {
        const pageSizeCookie = getCookie("VmiUsers-PageSize");
        const pageSize = pageSizeCookie ? parseInt(pageSizeCookie, 10) : undefined;
        if (pageSize && pageSize !== getVmiUsersParameter.pageSize) {
            updateSearchFields({ pageSize });
            return;
        }

        if (!accountsDataView.value && !accountsDataView.isLoading) {
            loadAccounts(getVmiUsersParameter);
        }
    });

    return (
        <Page>
            <Zone contentId={id} zoneName="Content" />
        </Page>
    );
};

const pageModule: PageModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(VmiUsersPage),
    definition: {
        hasEditableUrlSegment: true,
        hasEditableTitle: true,
        pageType: "System",
    },
};

export default pageModule;

export const VmiUsersPageContext = "VmiUsersPage";
