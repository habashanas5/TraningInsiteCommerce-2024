import { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import validateEmail from "@insite/client-framework/Common/Utilities/validateEmail";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import signIn from "@insite/client-framework/Store/Context/Handlers/SignIn";
import { getLocation, removeAbsoluteUrl } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { SignInPageContext } from "@insite/content-library/Pages/SignInPage";
import SignInChangePasswordForm from "@insite/content-library/Widgets/SignIn/SignInChangePasswordForm";
import SignInResetPasswordForm from "@insite/content-library/Widgets/SignIn/SignInResetPasswordForm";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Checkbox, { CheckboxProps } from "@insite/mobius/Checkbox";
import CheckboxGroup, { CheckboxGroupComponentProps } from "@insite/mobius/CheckboxGroup";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import { IconProps } from "@insite/mobius/Icon/Icon";
import Eye from "@insite/mobius/Icons/Eye";
import EyeOff from "@insite/mobius/Icons/EyeOff";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import Typography, { TypographyProps } from "@insite/mobius/Typography/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const enum fields {
    changePasswordInstructions = "changePasswordInstructions",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.changePasswordInstructions]: string;
    };
}

const mapStateToProps = (state: ApplicationState) => {
    const parsedQuery = parseQueryString<{ externalError?: string }>(getLocation(state).search);
    return {
        accountSettings: getSettingsCollection(state).accountSettings,
        externalError: parsedQuery.externalError,
    };
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const mapDispatchToProps = {
    signIn,
};

export interface SignInExistingAccountStyles {
    form?: InjectableCss;
    rememberMeCheckbox?: CheckboxProps;
    rememberMeCheckboxGroup?: CheckboxGroupComponentProps;
    userNameTextField?: TextFieldProps;
    signInGridContainer?: GridContainerProps;
    icon?: IconProps;
    passwordTextField?: TextFieldProps;
    signInButton?: ButtonPresentationProps;
    signInButtonGridItem?: GridItemProps;
    forgotPasswordGridItem?: GridItemProps;
    rememberMeGridItem?: GridItemProps;
    passwordGridItem?: GridItemProps;
    userNameGridItem?: GridItemProps;
    signInExistingAccountTitle?: TypographyProps;
    forgotPasswordLink?: LinkPresentationProps;
    resetPasswordModal?: ModalPresentationProps;
    changePasswordModal?: ModalPresentationProps;
}

export const signInExistingAccountStyles: SignInExistingAccountStyles = {
    icon: {
        css: css`
            padding-top: 50px;
        `,
    },
    signInExistingAccountTitle: {
        variant: "h4",
    },
    userNameGridItem: {
        width: 12,
    },
    passwordGridItem: {
        width: 12,
    },
    signInButtonGridItem: {
        width: 12,
        css: css`
            justify-content: flex-end;
        `,
    },
    rememberMeGridItem: {
        width: 6,
    },
    forgotPasswordGridItem: {
        width: 6,
        css: css`
            justify-content: flex-end;
        `,
    },
    forgotPasswordLink: {
        typographyProps: {
            size: 13,
        },
    },
    signInButton: {
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        width: 100%;
                    `,
                    css`
                        width: 100%;
                    `,
                    null,
                    null,
                    null,
                ])}
        `,
    },
    resetPasswordModal: {
        sizeVariant: "small",
    },
    changePasswordModal: {
        sizeVariant: "small",
    },
};

/**
 * @deprecated Use signInExistingAccountStyles instead.
 */
export const signInExistingAccount = signInExistingAccountStyles;
const styles = signInExistingAccountStyles;
const StyledForm = getStyledWrapper("form");

const SignInExistingAccount = ({ signIn, fields, accountSettings, externalError }: Props) => {
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [isSignInClicked, setIsSignInClicked] = useState(false);
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState(externalError || "");

    const showRememberMe = accountSettings.rememberMe;

    const signInHandler = (newPassword?: string) => {
        const pass = newPassword || password;
        setIsSignInClicked(true);
        if (!userName || !pass) {
            return;
        }

        if (accountSettings.useEmailAsUserName && !validateEmail(userName)) {
            return;
        }

        const queryParams = parseQueryString<{ returnUrl?: string }>(window.location.search);
        const returnUrl = removeAbsoluteUrl(queryParams.returnUrl?.toString());

        setErrorMessage("");

        signIn({
            userName,
            password: pass,
            rememberMe,
            returnUrl,
            onError: (error, statusCode) => {
                if (statusCode === 422) {
                    setIsChangePasswordModalOpen(true);
                    return;
                }

                setErrorMessage(error);
            },
        });
    };

    const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        signInHandler();
    };

    const onResetPasswordClose = () => {
        setIsResetPasswordModalOpen(false);
    };

    const onChangePasswordClose = () => {
        setIsChangePasswordModalOpen(false);
    };

    const onPasswordChanged = (newPassword: string) => {
        setPassword(newPassword);
        setIsChangePasswordModalOpen(false);
        signInHandler(newPassword);
    };

    const validateUserName = () => {
        if (isSignInClicked) {
            if (userName) {
                if (accountSettings.useEmailAsUserName && !validateEmail(userName)) {
                    return siteMessage("SignInInfo_Email_Validation");
                }
            } else {
                return accountSettings.useEmailAsUserName
                    ? siteMessage("SignInInfo_Email_Required")
                    : siteMessage("SignInInfo_UserName_Required");
            }
        }

        return "";
    };

    const userErrorMessage = validateUserName();
    const passwordErrorMessage =
        !password && isSignInClicked ? siteMessage("SignInInfo_Password_Required") : errorMessage || "";

    return (
        <>
            <Typography {...styles.signInExistingAccountTitle}>{translate("Already have an account?")}</Typography>
            <StyledForm {...styles.form} onSubmit={submitHandler} noValidate>
                <GridContainer {...styles.signInGridContainer}>
                    <GridItem {...styles.userNameGridItem}>
                        <TextField
                            id="userName"
                            {...styles.userNameTextField}
                            label={accountSettings.useEmailAsUserName ? translate("Email") : translate("User Name")}
                            onChange={e => setUserName(e.currentTarget.value)}
                            value={userName}
                            error={userErrorMessage}
                            autoComplete="username"
                            data-test-selector="signIn_userName"
                        />
                    </GridItem>
                    <GridItem {...styles.passwordGridItem}>
                        <TextField
                            id="password"
                            {...styles.passwordTextField}
                            label={translate("Password")}
                            onChange={e => setPassword(e.currentTarget.value)}
                            value={password}
                            error={passwordErrorMessage}
                            iconProps={{
                                ...styles.icon,
                                src: showPassword ? EyeOff : Eye,
                            }}
                            iconClickableProps={{
                                onClick: () => {
                                    setShowPassword(!showPassword);
                                },
                                type: "button",
                            }}
                            clickableText={password}
                            autoComplete="current-password"
                            data-test-selector="signIn_password"
                            type={showPassword ? "text" : "password"}
                        />
                    </GridItem>
                    <GridItem {...styles.rememberMeGridItem}>
                        {showRememberMe && (
                            <CheckboxGroup {...styles.rememberMeCheckboxGroup}>
                                <Checkbox
                                    uid="rememberMe"
                                    {...styles.rememberMeCheckbox}
                                    checked={rememberMe}
                                    onChange={(e, value) => setRememberMe(value)}
                                >
                                    {translate("Remember Me")}
                                </Checkbox>
                            </CheckboxGroup>
                        )}
                    </GridItem>
                    <GridItem {...styles.forgotPasswordGridItem}>
                        <Link
                            {...styles.forgotPasswordLink}
                            type="button"
                            onClick={() => setIsResetPasswordModalOpen(true)}
                            data-test-selector="signIn_forgotPassword"
                        >
                            {translate("Forgot Password")}
                        </Link>
                        <Modal
                            headline={translate("Reset Password")}
                            {...styles.resetPasswordModal}
                            isOpen={isResetPasswordModalOpen}
                            handleClose={() => onResetPasswordClose()}
                            data-test-selector="resetPasswordModal"
                        >
                            <SignInResetPasswordForm onClose={() => onResetPasswordClose()} />
                        </Modal>
                    </GridItem>
                    <GridItem {...styles.signInButtonGridItem}>
                        <Button {...styles.signInButton} type="submit" data-test-selector="signIn_submit">
                            {translate("Sign In")}
                        </Button>
                        <Modal
                            headline={translate("Change Password")}
                            {...styles.changePasswordModal}
                            isOpen={isChangePasswordModalOpen}
                            handleClose={onChangePasswordClose}
                        >
                            <SignInChangePasswordForm
                                enteredUserName={userName}
                                enteredPassword={password}
                                instructionsText={fields.changePasswordInstructions}
                                onPasswordChanged={onPasswordChanged}
                            />
                        </Modal>
                    </GridItem>
                </GridContainer>
            </StyledForm>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(SignInExistingAccount),
    definition: {
        allowedContexts: [SignInPageContext],
        group: "Sign In",
        icon: "LogIn",
        fieldDefinitions: [
            {
                fieldType: "Translatable",
                name: fields.changePasswordInstructions,
                editorTemplate: "RichTextField",
                displayName: "Change Password Instructions",
                defaultValue: "A password change is required for your account before you may continue.",
                extendedConfig: { height: 170 },
                expandedToolbarButtons: {
                    moreMisc: {},
                    code: {},
                },
            },
        ],
    },
};

export default widgetModule;
