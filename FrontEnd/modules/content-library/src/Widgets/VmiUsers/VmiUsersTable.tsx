import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getAccountsDataView } from "@insite/client-framework/Store/Data/Accounts/AccountsSelector";
import updateSearchFields from "@insite/client-framework/Store/Pages/VmiUsers/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { VmiUsersPageContext } from "@insite/content-library/Pages/VmiUsersPage";
import AddVmiUserModal from "@insite/content-library/Widgets/VmiUsers/AddVmiUserModal";
import DataTable, { DataTablePresentationProps, SortOrderOptions } from "@insite/mobius/DataTable";
import DataTableBody, { DataTableBodyProps } from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell, { DataTableCellProps } from "@insite/mobius/DataTable/DataTableCell";
import DataTableHead, { DataTableHeadProps } from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderPresentationProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow, { DataTableRowProps } from "@insite/mobius/DataTable/DataTableRow";
import Link from "@insite/mobius/Link";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    accountsDataView: getAccountsDataView(state, state.pages.vmiUsers.getVmiUsersParameter),
    parameter: state.pages.vmiUsers.getVmiUsersParameter,
    displayEmail: !getSettingsCollection(state).accountSettings.useEmailAsUserName,
});

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = WidgetProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasToasterContext;

export interface VmiUsersTableStyles {
    container?: InjectableCss;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    noResultsContainer?: InjectableCss;
    noResultsText?: TypographyPresentationProps;
    dataTable?: DataTablePresentationProps;
    dataTableHead?: DataTableHeadProps;
    usernameHeader?: DataTableHeaderPresentationProps;
    firstNameHeader?: DataTableHeaderPresentationProps;
    lastNameHeader?: DataTableHeaderPresentationProps;
    emailHeader?: DataTableHeaderPresentationProps;
    roleHeader?: DataTableHeaderPresentationProps;
    actionsHeader?: DataTableHeaderPresentationProps;
    dataTableBody?: DataTableBodyProps;
    dataTableRow?: DataTableRowProps;
    usernameCells?: DataTableCellProps;
    firstNameCells?: DataTableCellProps;
    lastNameCells?: DataTableCellProps;
    emailCells?: DataTableCellProps;
    roleCells?: DataTableCellProps;
    actionsCells?: DataTableCellProps;
}

export const vmiUsersTableStyles: VmiUsersTableStyles = {
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

const styles = vmiUsersTableStyles;

const VmiUsersTable = ({ accountsDataView, parameter, displayEmail, updateSearchFields }: Props) => {
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [userId, setUserId] = useState<string | undefined>();

    useEffect(() => {
        if (
            accountsDataView &&
            !accountsDataView.isLoading &&
            accountsDataView?.value?.length === 0 &&
            parameter.page &&
            parameter.page > 1
        ) {
            updateSearchFields({ page: parameter.page - 1 });
        }
    }, [accountsDataView]);

    const headerClick = (sortField: string) => {
        const sort = parameter.sort === sortField ? `${sortField} DESC` : sortField;
        updateSearchFields({ sort, page: 1 });
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

    const editClickHandler = (id: string) => {
        setIsAddUserModalOpen(true);
        setUserId(id);
    };

    const onSuccessAddUserModal = () => {
        setIsAddUserModalOpen(false);
    };

    const onCloseAddUserModal = () => {
        setIsAddUserModalOpen(false);
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
                <Typography as="p" {...styles.noResultsText}>
                    {translate("No users found")}
                </Typography>
            </StyledWrapper>
        );
    }

    return (
        <>
            <StyledWrapper {...styles.container}>
                <DataTable {...styles.dataTable}>
                    <DataTableHead {...styles.dataTableHead}>
                        <DataTableHeader
                            {...styles.usernameHeader}
                            sorted={sorted("UserName")}
                            onSortClick={() => headerClick("UserName")}
                        >
                            {translate("Username")}
                        </DataTableHeader>
                        <DataTableHeader
                            {...styles.firstNameHeader}
                            sorted={sorted("FirstName")}
                            onSortClick={() => headerClick("FirstName")}
                        >
                            {translate("First Name")}
                        </DataTableHeader>
                        <DataTableHeader
                            {...styles.lastNameHeader}
                            sorted={sorted("LastName")}
                            onSortClick={() => headerClick("LastName")}
                        >
                            {translate("Last Name")}
                        </DataTableHeader>
                        {displayEmail && (
                            <DataTableHeader
                                {...styles.emailHeader}
                                sorted={sorted("Email")}
                                onSortClick={() => headerClick("Email")}
                            >
                                {translate("Email")}
                            </DataTableHeader>
                        )}
                        <DataTableHeader
                            {...styles.roleHeader}
                            sorted={sorted("Role")}
                            onSortClick={() => headerClick("Role")}
                        >
                            {translate("Role")}
                        </DataTableHeader>
                        <DataTableHeader {...styles.actionsHeader}>{translate("Actions")}</DataTableHeader>
                    </DataTableHead>
                    <DataTableBody {...styles.dataTableBody}>
                        {accountsDataView.value.map(account => (
                            <DataTableRow {...styles.dataTableRow} key={account.id} data-test-key={account.userName}>
                                <DataTableCell {...styles.usernameCells} as="th" scope="row" data-test-key={account.id}>
                                    <Link onClick={() => editClickHandler(account.id)}>{account.userName}</Link>
                                </DataTableCell>
                                <DataTableCell {...styles.firstNameCells} data-test-key={account.id}>
                                    {account.firstName}
                                </DataTableCell>
                                <DataTableCell {...styles.lastNameCells} data-test-key={account.id}>
                                    {account.lastName}
                                </DataTableCell>
                                {displayEmail && (
                                    <DataTableCell {...styles.emailCells} data-test-key={account.id}>
                                        {account.email}
                                    </DataTableCell>
                                )}
                                <DataTableCell {...styles.roleCells} data-test-key={account.id}>
                                    {account.vmiRole}
                                </DataTableCell>
                                <DataTableCell {...styles.actionsCells} data-test-key={account.id}>
                                    <Link onClick={() => editClickHandler(account.id)}>{translate("Edit")}</Link>
                                </DataTableCell>
                            </DataTableRow>
                        ))}
                    </DataTableBody>
                </DataTable>
            </StyledWrapper>
            <AddVmiUserModal
                isOpen={isAddUserModalOpen}
                editUserId={userId}
                onSuccess={onSuccessAddUserModal}
                onClose={onCloseAddUserModal}
            />
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withToaster(VmiUsersTable)),
    definition: {
        group: "VMI Users",
        displayName: "Search Results Table",
        allowedContexts: [VmiUsersPageContext],
    },
};

export default widgetModule;
