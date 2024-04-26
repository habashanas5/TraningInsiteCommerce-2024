import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getAccountsDataView } from "@insite/client-framework/Store/Data/Accounts/AccountsSelector";
import updateSearchFields from "@insite/client-framework/Store/Pages/VmiUsers/Handlers/UpdateSearchFields";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { VmiUsersPageContext } from "@insite/content-library/Pages/VmiUsersPage";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    accountsDataView: getAccountsDataView(state, state.pages.vmiUsers.getVmiUsersParameter),
});

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface VmiUsersPaginationStyles {
    pagination?: PaginationPresentationProps;
}

export const vmiUsersPaginationStyles: VmiUsersPaginationStyles = {};

const styles = vmiUsersPaginationStyles;

const VmiUsersPagination = ({ accountsDataView, updateSearchFields }: Props) => {
    if (!accountsDataView.value || !accountsDataView.pagination || accountsDataView.pagination.totalItemCount < 2) {
        return null;
    }

    const { totalItemCount, page, pageSize, pageSizeOptions } = accountsDataView.pagination;

    if (totalItemCount === 0) {
        return null;
    }

    const changePage = (newPageIndex: number) => {
        updateSearchFields({
            page: newPageIndex,
        });
    };

    const changeResultsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(event.currentTarget.value, 10);
        updateSearchFields({
            page: 1,
            pageSize: newPageSize,
        });
    };

    return (
        <Pagination
            {...styles.pagination}
            resultsCount={totalItemCount}
            currentPage={page}
            resultsPerPage={pageSize}
            resultsPerPageOptions={pageSizeOptions}
            onChangePage={changePage}
            onChangeResultsPerPage={changeResultsPerPage}
            pageSizeCookie="VmiUsers-PageSize"
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(VmiUsersPagination),
    definition: {
        displayName: "Pagination",
        group: "VMI Users",
        allowedContexts: [VmiUsersPageContext],
    },
};

export default widgetModule;
