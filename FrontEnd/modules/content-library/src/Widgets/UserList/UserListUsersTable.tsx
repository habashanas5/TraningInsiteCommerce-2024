import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getAccountsDataView } from "@insite/client-framework/Store/Data/Accounts/AccountsSelector";
import updateSearchFields from "@insite/client-framework/Store/Pages/UserList/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import UserSetupPageTypeLink from "@insite/content-library/Components/UserSetupPageTypeLink";
import { UserListPageContext } from "@insite/content-library/Pages/UserListPage";
import DataTable, { DataTablePresentationProps, SortOrderOptions } from "@insite/mobius/DataTable";
import DataTableBody, { DataTableBodyProps } from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell, { DataTableCellProps } from "@insite/mobius/DataTable/DataTableCell";
import DataTableHead, { DataTableHeadProps } from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderPresentationProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow, { DataTableRowProps } from "@insite/mobius/DataTable/DataTableRow";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    accountsDataView: getAccountsDataView(state, state.pages.userList.getAccountsParameter),
    parameter: state.pages.userList.getAccountsParameter,
    defaultPageSize: getSettingsCollection(state).websiteSettings.defaultPageSize,
    displayEmail: !getSettingsCollection(state).accountSettings.useEmailAsUserName,
});

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface UserListUsersTableStyles {
    container?: InjectableCss;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    noResultsContainer?: InjectableCss;
    noResultsText?: TypographyPresentationProps;
    dataTable?: DataTablePresentationProps;
    dataTableHead?: DataTableHeadProps;
    usernameHeader?: DataTableHeaderPresentationProps;
    nameHeader?: DataTableHeaderPresentationProps;
    emailHeader?: DataTableHeaderPresentationProps;
    statusHeader?: DataTableHeaderPresentationProps;
    roleHeader?: DataTableHeaderPresentationProps;
    lastSignInHeader?: DataTableHeaderPresentationProps;
    dataTableBody?: DataTableBodyProps;
    dataTableRow?: DataTableRowProps;
    usernameCells?: DataTableCellProps;
    nameCells?: DataTableCellProps;
    emailCells?: DataTableCellProps;
    statusCells?: DataTableCellProps;
    roleCells?: DataTableCellProps;
    lastSignInCells?: DataTableCellProps;
    pagination?: PaginationPresentationProps;
}

export const userListUsersTableStyles: UserListUsersTableStyles = {
    container: {
        css: css`
            overflow-x: auto;
        `,
    },
    centeringWrapper: {
        css: css`
            height: 300px;
            display: flex;
            align-items: center;
        `,
    },
    spinner: {
        css: css`
            margin: auto;
        `,
    },
    noResultsContainer: {
        css: css`
            text-align: center;
            padding: 20px;
        `,
    },
    noResultsText: {
        variant: "h4",
    },
    usernameCells: {
        css: css`
            font-weight: 400;
        `,
    },
};

const styles = userListUsersTableStyles;

const UserListUsersTable = ({
    accountsDataView,
    parameter,
    defaultPageSize,
    displayEmail,
    updateSearchFields,
}: Props) => {
    const handleChangePage = (page: number) => {
        updateSearchFields({ page });
    };
    const handleChangeResultsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = Number(event.target.value);
        updateSearchFields({
            page: 1,
            pageSize: newPageSize,
        });
    };
    const headerClick = (sortField: string) => {
        const sort = parameter.sort === sortField ? `${sortField} DESC` : sortField;
        updateSearchFields({ sort });
    };

    const sorted = (sortField: string) => {
        let sorted: SortOrderOptions | undefined;
        if (parameter.sort === sortField) {
            sorted = SortOrderOptions.ascending;
        } else if (parameter.sort === `${sortField} DESC`) {
            sorted = SortOrderOptions.descending;
        }
        return sorted;
    };

    if (accountsDataView.isLoading) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner {...styles.spinner} />
            </StyledWrapper>
        );
    }

    if (!accountsDataView.value) {
        return null;
    }

    if (accountsDataView.value.length === 0) {
        return (
            <StyledWrapper {...styles.noResultsContainer}>
                <Typography as="p" {...styles.noResultsText} data-test-selector="userListUsersTable_noUsersFound">
                    {translate("No users found")}
                </Typography>
            </StyledWrapper>
        );
    }

    return (
        <>
            <StyledWrapper {...styles.container} data-test-selector="userListUsersTable">
                <DataTable {...styles.dataTable}>
                    <DataTableHead {...styles.dataTableHead}>
                        <DataTableHeader
                            {...styles.usernameHeader}
                            sorted={sorted("UserName")}
                            onSortClick={() => headerClick("UserName")}
                            data-test-selector="userListUsersTable_usernameHeader"
                        >
                            {translate("Username")}
                        </DataTableHeader>
                        <DataTableHeader
                            {...styles.nameHeader}
                            sorted={sorted("LastName")}
                            onSortClick={() => headerClick("LastName")}
                            data-test-selector="userListUsersTable_nameHeader"
                        >
                            {translate("Name")}
                        </DataTableHeader>
                        {displayEmail && (
                            <DataTableHeader
                                {...styles.emailHeader}
                                data-test-selector="userListUsersTable_emailHeader"
                            >
                                {translate("Email")}
                            </DataTableHeader>
                        )}
                        <DataTableHeader
                            {...styles.statusHeader}
                            data-test-selector="tst_userListUsersTable_statusHeader"
                        >
                            {translate("Status")}
                        </DataTableHeader>
                        <DataTableHeader
                            {...styles.roleHeader}
                            sorted={sorted("Role")}
                            onSortClick={() => headerClick("Role")}
                            data-test-selector="userListUsersTable_roleHeader"
                        >
                            {translate("Role")}
                        </DataTableHeader>
                        <DataTableHeader
                            {...styles.lastSignInHeader}
                            data-test-selector="tst_userListUsersTable_lastSignInHeader"
                        >
                            {translate("Last Sign In")}
                        </DataTableHeader>
                    </DataTableHead>
                    <DataTableBody {...styles.dataTableBody}>
                        {accountsDataView.value.map(account => (
                            <DataTableRow
                                {...styles.dataTableRow}
                                key={account.id}
                                data-test-selector="userListUsersTable_row"
                                data-test-key={account.userName}
                            >
                                <DataTableCell
                                    {...styles.usernameCells}
                                    as="th"
                                    scope="row"
                                    data-test-selector="userListUsersTable_cell_username"
                                    data-test-key={account.id}
                                >
                                    <UserSetupPageTypeLink title={account.userName} userId={account.id} />
                                </DataTableCell>
                                <DataTableCell
                                    {...styles.nameCells}
                                    data-test-selector="userListUsersTable_cell_name"
                                    data-test-key={account.id}
                                >
                                    {`${account.firstName} ${account.lastName}`}
                                </DataTableCell>
                                {displayEmail && (
                                    <DataTableCell
                                        {...styles.emailCells}
                                        data-test-selector="userListUsersTable_cell_email"
                                        data-test-key={account.id}
                                    >
                                        {account.email}
                                    </DataTableCell>
                                )}
                                <DataTableCell
                                    {...styles.statusCells}
                                    data-test-selector="userListUsersTable_cell_status"
                                    data-test-key={account.id}
                                >
                                    {account.isApproved &&
                                        account.activationStatus === "EmailNotSent" &&
                                        translate("Email not sent")}
                                    {account.isApproved &&
                                        account.activationStatus === "EmailSent" &&
                                        translate("Email sent")}
                                    {account.isApproved &&
                                        account.activationStatus === "Activated" &&
                                        translate("Active")}
                                    {!account.isApproved && translate("Deactivated")}
                                </DataTableCell>
                                <DataTableCell
                                    {...styles.roleCells}
                                    data-test-selector="userListUsersTable_cell_role"
                                    data-test-key={account.id}
                                >
                                    {account.role}
                                </DataTableCell>
                                <DataTableCell
                                    {...styles.lastSignInCells}
                                    data-test-selector="userListUsersTable_cell_lastSignIn"
                                    data-test-key={account.id}
                                >
                                    {account.lastLoginOn && <LocalizedDateTime dateTime={account.lastLoginOn} />}
                                </DataTableCell>
                            </DataTableRow>
                        ))}
                    </DataTableBody>
                </DataTable>
            </StyledWrapper>
            {accountsDataView.pagination && accountsDataView.pagination.totalItemCount > 1 && (
                <Pagination
                    {...styles.pagination}
                    resultsCount={accountsDataView.pagination.totalItemCount}
                    currentPage={accountsDataView.pagination.page}
                    resultsPerPage={accountsDataView.pagination.pageSize}
                    resultsPerPageOptions={accountsDataView.pagination.pageSizeOptions}
                    onChangePage={handleChangePage}
                    onChangeResultsPerPage={handleChangeResultsPerPage}
                    data-test-selector="userListUsersTable_pagination"
                />
            )}
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(UserListUsersTable),
    definition: {
        allowedContexts: [UserListPageContext],
        group: "User List",
    },
};

export default widgetModule;
