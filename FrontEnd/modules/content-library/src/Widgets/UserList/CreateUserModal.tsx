import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import validateEmail from "@insite/client-framework/Common/Utilities/validateEmail";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCurrentAccountState } from "@insite/client-framework/Store/Data/Accounts/AccountsSelector";
import createUser from "@insite/client-framework/Store/Pages/UserList/Handlers/CreateUser";
import translate from "@insite/client-framework/Translate";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import HelpCircle from "@insite/mobius/Icons/HelpCircle";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Select, { SelectPresentationProps } from "@insite/mobius/Select";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import Tooltip, { TooltipPresentationProps } from "@insite/mobius/Tooltip";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import parse from "html-react-parser";
import React, { PureComponent, ReactNode } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    isOpen?: boolean;
    assignApproverHelpMessage?: string;
    roleInformation?: string;
    onClickCancel: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
    onClose: (event?: React.SyntheticEvent<Element, Event>) => void;
}

const mapStateToProps = (state: ApplicationState) => ({
    currentAccountState: getCurrentAccountState(state),
    showUserName: !getSettingsCollection(state).accountSettings.useEmailAsUserName,
});

const mapDispatchToProps = {
    createUser,
};

type Props = OwnProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasToasterContext;

export interface CreateUserModalStyles {
    modal?: ModalPresentationProps;
    form?: InjectableCss;
    container?: GridContainerProps;
    userNameVisibleGridItem?: GridItemProps;
    userNameHiddenGridItem?: GridItemProps;
    userNameTextField?: TextFieldPresentationProps;
    emailGridItem?: GridItemProps;
    emailTextField?: TextFieldPresentationProps;
    firstNameGridItem?: GridItemProps;
    firstNameTextField?: TextFieldPresentationProps;
    lastNameGridItem?: GridItemProps;
    lastNameTextField?: TextFieldPresentationProps;
    settingsHeadingGridItem?: GridItemProps;
    settingsHeadingText?: TypographyPresentationProps;
    roleGridItem?: GridItemProps;
    roleSelect?: SelectPresentationProps;
    roleSelectHelpIcon?: IconPresentationProps;
    roleSelectHelpModal?: ModalPresentationProps;
    approverGridItem?: GridItemProps;
    approverSelect?: SelectPresentationProps;
    approverSelectTooltip?: TooltipPresentationProps;
    buttonsGridItem?: GridItemProps;
    cancelButton?: ButtonPresentationProps;
    submitButton?: ButtonPresentationProps;
}

export const createUserModalStyles: CreateUserModalStyles = {
    container: { gap: 15 },
    userNameVisibleGridItem: { width: [12, 12, 12, 6, 6] },
    userNameHiddenGridItem: {
        css: css`
            display: none;
        `,
    },
    emailGridItem: { width: [12, 12, 12, 6, 6] },
    firstNameGridItem: { width: [12, 12, 12, 6, 6] },
    lastNameGridItem: { width: [12, 12, 12, 6, 6] },
    settingsHeadingGridItem: { width: 12 },
    settingsHeadingText: { variant: "h5" },
    roleGridItem: { width: [12, 12, 12, 6, 6] },
    roleSelectHelpIcon: {
        src: HelpCircle,
        size: 18,
        css: css`
            margin-left: 5px;
            cursor: pointer;
        `,
    },
    approverGridItem: { width: [12, 12, 12, 6, 6] },
    approverSelectTooltip: {
        iconProps: {
            css: css`
                margin-left: 5px;
            `,
        },
    },
    buttonsGridItem: {
        css: css`
            justify-content: flex-end;
        `,
        width: 12,
    },
    cancelButton: { variant: "secondary" },
    submitButton: {
        css: css`
            margin-left: 1rem;
        `,
    },
};

const styles = createUserModalStyles;

const StyledForm = getStyledWrapper("form");

class CreateUserModal extends PureComponent<
    Props,
    {
        userName: string;
        email: string;
        firstName: string;
        lastName: string;
        role: string;
        approver: string;
        userNameErrorMessage?: ReactNode;
        emailErrorMessage?: ReactNode;
        firstNameErrorMessage?: ReactNode;
        lastNameErrorMessage?: ReactNode;
        showFormErrors: boolean;
        roleInformationModalIsOpen: boolean;
    }
> {
    state = {
        userName: "",
        email: "",
        firstName: "",
        lastName: "",
        role: "",
        approver: "",
        userNameErrorMessage: undefined,
        emailErrorMessage: undefined,
        firstNameErrorMessage: undefined,
        lastNameErrorMessage: undefined,
        showFormErrors: false,
        roleInformationModalIsOpen: false,
    };

    usernameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ userName: event.target.value }, () => {
            this.state.showFormErrors && this.validateUserName();
        });
    };
    emailChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ email: event.target.value }, () => {
            this.state.showFormErrors && this.validateEmail();
        });
    };
    firstNameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ firstName: event.target.value }, () => {
            this.state.showFormErrors && this.validateFirstName();
        });
    };
    lastNameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ lastName: event.target.value }, () => {
            this.state.showFormErrors && this.validateLastName();
        });
    };
    roleChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ role: event.target.value });
    };
    approverChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ approver: event.target.value });
    };
    validateUserName = () => {
        const userNameErrorMessage = !this.state.userName ? siteMessage("CreateNewAccountInfo_UserName_Required") : "";
        this.setState({ userNameErrorMessage });
        return !userNameErrorMessage;
    };
    validateEmail = () => {
        let emailErrorMessage: ReturnType<typeof siteMessage> = "";
        if (!this.state.email) {
            emailErrorMessage = siteMessage("CreateNewAccountInfo_EmailAddress_Required");
        } else if (!validateEmail(this.state.email)) {
            emailErrorMessage = siteMessage("CreateNewAccountInfo_EmailAddress_ValidEmail");
        }
        this.setState({ emailErrorMessage });
        return !emailErrorMessage;
    };
    validateFirstName = () => {
        const firstNameErrorMessage = !this.state.firstName ? siteMessage("User_Admin_Info_FirstName_Required") : "";
        this.setState({ firstNameErrorMessage });
        return !firstNameErrorMessage;
    };
    validateLastName = () => {
        const lastNameErrorMessage = !this.state.lastName ? siteMessage("User_Admin_Info_LastName_Required") : "";
        this.setState({ lastNameErrorMessage });
        return !lastNameErrorMessage;
    };
    validateForm = () => {
        const isEmailValid = this.validateEmail();
        const isFirstNameValid = this.validateFirstName();
        const isLastNameValid = this.validateLastName();
        let isFormValid = isEmailValid && isFirstNameValid && isLastNameValid;
        if (this.props.showUserName) {
            isFormValid = this.validateUserName() && isFormValid;
        }
        return isFormValid;
    };
    formSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!this.validateForm()) {
            this.setState({ showFormErrors: true });
            return false;
        }

        this.props.createUser({
            userName: this.state.userName,
            email: this.state.email,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            role: this.state.role,
            approver: this.state.approver,
            onError: (errorMessage: string) => {
                this.props.toaster.addToast({ body: errorMessage, messageType: "danger" });
            },
            onSuccess: () => {
                this.props.toaster.addToast({
                    body: translate("User Created. An activation email has been sent."),
                    messageType: "success",
                });

                this.props.onClose();
                this.resetState();
            },
        });
    };
    resetState = () => {
        this.setState({
            userName: "",
            email: "",
            firstName: "",
            lastName: "",
            role: "",
            approver: "",
            userNameErrorMessage: undefined,
            emailErrorMessage: undefined,
            firstNameErrorMessage: undefined,
            lastNameErrorMessage: undefined,
            showFormErrors: false,
        });
    };
    closeModalHandler = (event: React.SyntheticEvent<Element, Event>) => {
        this.props.onClose(event);
        this.resetState();
    };
    cancelFormHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        this.props.onClickCancel(event);
        this.resetState();
    };

    render() {
        let availableRoles: string[] | null = [];
        let availableApprovers: string[] | null = [];
        if (this.props.currentAccountState.value) {
            availableRoles = this.props.currentAccountState.value.availableRoles;
            availableApprovers = this.props.currentAccountState.value.availableApprovers;
        }
        const { userName, email, firstName, lastName, role, approver, showFormErrors } = this.state;
        const userNameGridItemStyles = this.props.showUserName
            ? styles.userNameVisibleGridItem
            : styles.userNameHiddenGridItem;

        const roleSelectLabel = this.props.roleInformation ? (
            <>
                {translate("Assign User Role")}
                <Icon
                    {...styles.roleSelectHelpIcon}
                    onClick={() => this.setState({ roleInformationModalIsOpen: true })}
                />
                <Modal
                    {...styles.roleSelectHelpModal}
                    headline={translate("User Roles")}
                    isOpen={this.state.roleInformationModalIsOpen}
                    handleClose={() => this.setState({ roleInformationModalIsOpen: false })}
                >
                    {parse(this.props.roleInformation, parserOptions)}
                </Modal>
            </>
        ) : (
            translate("Assign User Role")
        );

        const approverLabel = this.props.assignApproverHelpMessage ? (
            <>
                {translate("Assign Approver")}
                <Tooltip {...styles.approverSelectTooltip} text={this.props.assignApproverHelpMessage} />
            </>
        ) : (
            translate("Assign Approver")
        );

        return (
            <Modal
                {...styles.modal}
                handleClose={this.closeModalHandler}
                headline={translate("Create User")}
                isOpen={this.props.isOpen}
                data-test-selector="tst_ModalTitle"
            >
                <StyledForm
                    {...styles.form}
                    data-test-selector="userAddForm"
                    noValidate
                    onSubmit={this.formSubmitHandler}
                >
                    <GridContainer {...styles.container}>
                        {this.props.showUserName && (
                            <GridItem {...userNameGridItemStyles}>
                                <TextField
                                    {...styles.userNameTextField}
                                    error={showFormErrors && this.state.userNameErrorMessage}
                                    label={translate("Username")}
                                    onChange={this.usernameChangeHandler}
                                    required
                                    value={userName}
                                    data-test-selector="userEditForm_userNameText"
                                />
                            </GridItem>
                        )}
                        <GridItem {...styles.emailGridItem}>
                            <TextField
                                {...styles.emailTextField}
                                error={showFormErrors && this.state.emailErrorMessage}
                                label={translate("Email")}
                                onChange={this.emailChangeHandler}
                                required
                                value={email}
                                data-test-selector="userEditForm_emailText"
                            />
                        </GridItem>
                        <GridItem {...styles.firstNameGridItem}>
                            <TextField
                                {...styles.firstNameTextField}
                                error={showFormErrors && this.state.firstNameErrorMessage}
                                label={translate("First Name")}
                                onChange={this.firstNameChangeHandler}
                                required
                                value={firstName}
                                data-test-selector="userEditForm_firstNameText"
                            />
                        </GridItem>
                        <GridItem {...styles.lastNameGridItem}>
                            <TextField
                                {...styles.lastNameTextField}
                                error={showFormErrors && this.state.lastNameErrorMessage}
                                label={translate("Last Name")}
                                onChange={this.lastNameChangeHandler}
                                required
                                value={lastName}
                                data-test-selector="userEditForm_lastNameText"
                            />
                        </GridItem>
                        <GridItem {...styles.settingsHeadingGridItem}>
                            <Typography {...styles.settingsHeadingText} as="h2">
                                {translate("Settings")}
                            </Typography>
                        </GridItem>
                        {availableRoles && (
                            <GridItem {...styles.roleGridItem}>
                                <Select
                                    {...styles.roleSelect}
                                    label={roleSelectLabel}
                                    onChange={this.roleChangeHandler}
                                    value={role}
                                    data-test-selector="userEditForm_userRoleSelect"
                                >
                                    <option value="">{translate("Select User Role")}</option>
                                    {availableRoles.map(o => (
                                        <option key={o} value={o}>
                                            {o}
                                        </option>
                                    ))}
                                </Select>
                            </GridItem>
                        )}
                        {availableApprovers && (
                            <GridItem {...styles.approverGridItem}>
                                <Select
                                    {...styles.approverSelect}
                                    label={approverLabel}
                                    onChange={this.approverChangeHandler}
                                    value={approver}
                                    data-test-selector="userEditForm_approverSelect"
                                >
                                    <option value="">{translate("Select an Approver")}</option>
                                    {availableApprovers.map(o => (
                                        <option key={o} value={o}>
                                            {o}
                                        </option>
                                    ))}
                                </Select>
                            </GridItem>
                        )}
                        <GridItem {...styles.buttonsGridItem}>
                            <Button
                                {...styles.cancelButton}
                                data-test-selector="userAddForm_cancelButton"
                                onClick={this.cancelFormHandler}
                                type="button"
                            >
                                {translate("Cancel")}
                            </Button>
                            <Button {...styles.submitButton} data-test-selector="userAddForm_saveButton" type="submit">
                                {translate("Create User")}
                            </Button>
                        </GridItem>
                    </GridContainer>
                </StyledForm>
            </Modal>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withToaster(CreateUserModal));
