import StyledWrapper, { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import Zone from "@insite/client-framework/Components/Zone";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getAccountsDataView } from "@insite/client-framework/Store/Data/Accounts/AccountsSelector";
import updateSearchFields from "@insite/client-framework/Store/Pages/UserList/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { UserListPageContext } from "@insite/content-library/Pages/UserListPage";
import CreateUserModal from "@insite/content-library/Widgets/UserList/CreateUserModal";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden from "@insite/mobius/Hidden";
import OverflowMenu from "@insite/mobius/OverflowMenu";
import TextField, { TextFieldPresentationProps, TextFieldProps } from "@insite/mobius/TextField";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React, { Component } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const enum fields {
    assignApproverHelpMessage = "assignApproverHelpMessage",
    roleInformation = "roleInformation",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.assignApproverHelpMessage]: string;
        [fields.roleInformation]: string;
    };
}

const mapStateToProps = (state: ApplicationState) => ({
    accountsDataView: getAccountsDataView(state, state.pages.userList.getAccountsParameter),
    parameter: state.pages.userList.getAccountsParameter,
});

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface UserListHeaderStyles {
    wrapper?: InjectableCss;
    titleContainer?: GridContainerProps;
    titleGridItem?: GridItemProps;
    buttonsGridItem?: GridItemProps;
    createUserButton?: ButtonPresentationProps;
    searchContainer?: GridContainerProps;
    searchGridItem?: GridItemProps;
    searchForm?: InjectableCss;
    searchTextField?: TextFieldPresentationProps;
    searchSubmitButton?: ButtonPresentationProps;
    userCountContainer?: GridContainerProps;
    userCountGridItem?: GridItemProps;
    userCountText?: TypographyPresentationProps;
}

export const userListHeaderStyles: UserListHeaderStyles = {
    wrapper: {
        css: css`
            margin-bottom: 1rem;
        `,
    },
    titleGridItem: {
        width: [10, 10, 8, 9, 9],
    },
    buttonsGridItem: {
        css: css`
            justify-content: flex-end;
        `,
        width: [2, 2, 4, 3, 3],
    },
    createUserButton: {
        css: css`
            justify-content: flex-end;
        `,
    },
    searchGridItem: {
        width: 6,
    },
    searchForm: {
        css: css`
            display: flex;
            justify-content: space-between;
            width: 100%;
        `,
    },
    searchTextField: {
        cssOverrides: {
            formField: css`
                flex: 1 1 auto;
                margin-right: 1rem;
            `,
        },
        iconProps: { src: "Search" },
    },
    searchSubmitButton: {
        css: css`
            flex: 0 0 auto;
        `,
        variant: "secondary",
    },
    userCountGridItem: {
        width: 12,
    },
};

const styles = userListHeaderStyles;

const StyledForm = getStyledWrapper("form");

class UserListHeader extends Component<Props, { query: string; isCreateUserModalOpen: boolean }> {
    state = {
        query: "",
        isCreateUserModalOpen: false,
    };

    componentDidUpdate(prevProps: Props, prevState: { query: string }) {
        if (
            prevProps.parameter.searchText !== this.props.parameter.searchText &&
            this.props.parameter.searchText &&
            prevState.query !== this.props.parameter.searchText
        ) {
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                query: this.props.parameter.searchText,
            });
        }
    }

    handleChangeSearchText: TextFieldProps["onChange"] = event => {
        this.setState({
            query: event.target.value,
        });
    };

    searchUsers = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        this.props.updateSearchFields({
            searchText: this.state.query,
        });
    };

    openCreateUserModal = () => {
        this.setState({ isCreateUserModalOpen: true });
    };

    closeCreateUserModal = () => {
        this.setState({ isCreateUserModalOpen: false });
    };

    render() {
        const { id, accountsDataView, fields } = this.props;
        const createNewUserText = translate("Create New User");

        return (
            <>
                <StyledWrapper {...styles.wrapper} data-test-selector="userListHeader">
                    <GridContainer {...styles.titleContainer}>
                        <GridItem {...styles.titleGridItem}>
                            <Zone zoneName="Content00" contentId={id} />
                        </GridItem>
                        <GridItem {...styles.buttonsGridItem}>
                            <Hidden below="md">
                                <Button
                                    data-test-selector="userListHeader_createNewUser"
                                    onClick={this.openCreateUserModal}
                                >
                                    {createNewUserText}
                                </Button>
                            </Hidden>
                            <Hidden above="sm">
                                <OverflowMenu>
                                    <Clickable onClick={this.openCreateUserModal}>{createNewUserText}</Clickable>
                                </OverflowMenu>
                            </Hidden>
                        </GridItem>
                    </GridContainer>
                    <GridContainer {...styles.searchContainer}>
                        <GridItem {...styles.searchGridItem}>
                            <StyledForm
                                {...styles.searchForm}
                                autoComplete="off"
                                onSubmit={this.searchUsers}
                                noValidate
                            >
                                <VisuallyHidden id="userSearch_label">{translate("User Search")}</VisuallyHidden>
                                <TextField
                                    {...styles.searchTextField}
                                    labelId="userSearch_label"
                                    onChange={this.handleChangeSearchText}
                                    placeholder={translate("User Search")}
                                    value={this.state.query}
                                    data-test-selector="userListHeader_searchTextField"
                                />
                                <Button
                                    {...styles.searchSubmitButton}
                                    data-test-selector="userListHeader_searchButton"
                                    disabled={accountsDataView.isLoading}
                                    type="submit"
                                >
                                    {translate("Search")}
                                </Button>
                            </StyledForm>
                        </GridItem>
                    </GridContainer>
                    <GridContainer {...styles.userCountContainer}>
                        <GridItem {...styles.userCountGridItem}>
                            {accountsDataView.value &&
                                accountsDataView.pagination &&
                                accountsDataView.pagination.totalItemCount > 0 && (
                                    <Typography {...styles.userCountText} data-test-selector="userListHeader_userCount">
                                        {`${accountsDataView.pagination.totalItemCount} ${translate("Users")}`}
                                    </Typography>
                                )}
                        </GridItem>
                    </GridContainer>
                </StyledWrapper>
                <CreateUserModal
                    isOpen={this.state.isCreateUserModalOpen}
                    assignApproverHelpMessage={fields.assignApproverHelpMessage}
                    roleInformation={fields.roleInformation}
                    onClickCancel={this.closeCreateUserModal}
                    onClose={this.closeCreateUserModal}
                />
            </>
        );
    }
}

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(UserListHeader),
    definition: {
        allowedContexts: [UserListPageContext],
        group: "User List",
        fieldDefinitions: [
            {
                name: fields.assignApproverHelpMessage,
                displayName: "Assign Approver Help Message",
                editorTemplate: "TextField",
                defaultValue: "Requisitioner, Buyer Level 1 and Buyer Level 2 require approver assignment.",
                fieldType: "Translatable",
            },
            {
                name: fields.roleInformation,
                displayName: "Role Information",
                editorTemplate: "RichTextField",
                defaultValue: `
                <div>
                    <h5>User Administrator: </h5>
                    <ul>
                        <li>Full access to My Account. </li>
                        <li>Can order over budget.</li>
                        <li>Can see invoices and orders for users that User Administrator is assigned to.</li>
                        <li>Default approver if none is assigned to a user.</li>
                        <li>Can approve requisitions.</li>
                    </ul>
                </div>
                <div>
                    <h5>Buyer Level 3:</h5>
                    <ul>
                        <li>Can order over budget without approval.</li>
                        <li>Can see orders and invoices.</li>
                        <li>Cannot access User Administration or Budget Management. </li>
                        <li>Can approve requisitions. </li>
                    </ul>
                </div>
                <div>
                    <h5>Buyer Level 2:</h5>
                    <ul>
                        <li>Over budget orders require approval.</li>
                        <li>Can see orders.</li>
                        <li>Cannot see invoices.</li>
                        <li>Cannot access User Administration, Budget Management, or Requisition Approval. </li>
                    </ul>
                </div>
                <div>
                    <h5>Buyer Level 1:</h5>
                    <ul>
                        <li>Cannot be assigned as an approver.</li>
                        <li>All orders require approval.</li>
                        <li>Can see orders.</li>
                        <li>Cannot see invoices.</li>
                        <li>Cannot access Order Approval, User Administration, Budget Management, or Requisition Approval. </li>
                    </ul>
                </div>
                <div>
                    <h5>Requisitioner:</h5>
                    <ul>
                        <li>Can only place requisition requests.</li>
                        <li>Cannot place orders.</li>
                        <li>Cannot access Order History, Invoice History, Order Approval, User Administration, Budget Management, or Requisition Approval. </li>
                    </ul>
                </div>`,
                fieldType: "Translatable",
            },
        ],
    },
};

export default widgetModule;
