import { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import validatePassword from "@insite/client-framework/Store/CommonHandlers/ValidatePassword";
import validateReCaptcha from "@insite/client-framework/Store/Components/ReCaptcha/Handlers/ValidateReCaptcha";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import signIn from "@insite/client-framework/Store/Context/Handlers/SignIn";
import addAccount from "@insite/client-framework/Store/Data/Accounts/Handlers/AddAccount";
import { getCreateAccountReturnUrl } from "@insite/client-framework/Store/Pages/CreateAccount/CreateAccountSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ReCaptcha from "@insite/content-library/Components/ReCaptcha";
import { CreateAccountPageContext } from "@insite/content-library/Pages/CreateAccountPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Checkbox from "@insite/mobius/Checkbox";
import CheckboxGroup from "@insite/mobius/CheckboxGroup";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import { IconPresentationProps } from "@insite/mobius/Icon";
import Eye from "@insite/mobius/Icons/Eye";
import EyeOff from "@insite/mobius/Icons/EyeOff";
import { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { ReactNode, useContext, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapDispatchToProps = {
    addAccount,
    signIn,
    validatePassword,
    validateReCaptcha: makeHandlerChainAwaitable<{}, boolean>(validateReCaptcha),
};

const mapStateToProps = (state: ApplicationState) => ({
    accountSettings: getSettingsCollection(state).accountSettings,
    returnUrl: getCreateAccountReturnUrl(state),
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface CreateAccountStyles {
    form?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    centeringWrapper?: InjectableCss;
    mainGridContainer?: GridContainerProps;
    userGridItem?: GridItemProps;
    userGridContainer?: GridContainerProps;
    emailGridItem?: GridItemProps;
    emailTextField?: TextFieldPresentationProps;
    userNameGridItem?: GridItemProps;
    userNameTextField?: TextFieldPresentationProps;
    passwordGridItem?: GridItemProps;
    passwordTextField?: TextFieldPresentationProps;
    passwordIcon?: IconPresentationProps;
    confirmPasswordGridItem?: GridItemProps;
    confirmPasswordTextField?: TextFieldPresentationProps;
    confirmPasswordIcon?: IconPresentationProps;
    subscriptionGridItem?: GridItemProps;
    submitErrorGridItem?: GridItemProps;
    submitErrorTitle?: TypographyProps;
    submitGridItem?: GridItemProps;
    reCaptchaGridItem?: GridItemProps;
    submitButton?: ButtonPresentationProps;
    requirementsGridItem?: GridItemProps;
    requirementsTitle?: TypographyProps;
    passwordRequirementsGridItem?: GridItemProps;
    passwordRequirementsGridContainer?: GridContainerProps;
    passwordGridContainer?: GridContainerProps;
}

export const createAccountStyles: CreateAccountStyles = {
    centeringWrapper: {
        css: css`
            display: flex;
            height: 300px;
            justify-content: center;
            align-items: center;
        `,
    },
    userGridItem: {
        width: [12, 12, 6, 6, 6],
        css: css`
            flex-direction: column;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        null,
                        null,
                        css`
                            padding-left: 100px;
                        `,
                    ],
                    "min",
                )}
        `,
    },
    userGridContainer: {
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        null,
                        null,
                        css`
                            max-width: 300px;
                        `,
                    ],
                    "min",
                )}
        `,
    },
    emailGridItem: {
        width: 12,
    },
    userNameGridItem: {
        width: 12,
    },
    passwordGridItem: {
        width: 12,
    },
    confirmPasswordGridItem: {
        width: 12,
    },
    subscriptionGridItem: {
        width: 12,
    },
    submitErrorGridItem: {
        width: 12,
    },
    submitErrorTitle: {
        color: "danger",
    },
    reCaptchaGridItem: { width: 12 },
    submitGridItem: {
        width: 12,
        css: css`
            justify-content: flex-end;
        `,
    },
    requirementsGridItem: {
        width: [12, 12, 6, 6, 6],
        css: css`
            flex-direction: column;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        null,
                        null,
                        css`
                            padding-left: 50px;
                        `,
                    ],
                    "min",
                )}/* stylelint-disable-line declaration-block-single-line-max-declarations */
        `,
    },
    passwordRequirementsGridContainer: {
        gap: 5,
    },
    passwordRequirementsGridItem: {
        width: 12,
    },
    requirementsTitle: {
        variant: "h4",
        as: "h2",
    },
};

const styles = createAccountStyles;
const emailRegexp = new RegExp("\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*");
const StyledForm = getStyledWrapper("form");

const CreateAccount = ({
    addAccount,
    signIn,
    validatePassword,
    validateReCaptcha,
    accountSettings,
    returnUrl,
}: Props) => {
    const userNameRequiredFieldMessage = siteMessage("CreateNewAccountInfo_UserName_Required");
    const emailRequiredFieldMessage = siteMessage("CreateNewAccountInfo_EmailAddress_Required");
    const emailFieldMessage = siteMessage("CreateNewAccountInfo_EmailAddress_ValidEmail");

    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [userNameError, setUserNameError] = useState(
        accountSettings.useEmailAsUserName ? "" : userNameRequiredFieldMessage,
    );
    const [errorMessage, setErrorMessage] = useState("");
    const [password, setPassword] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<ReactNode>("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState<ReactNode>("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailError, setEmailError] = useState(emailRequiredFieldMessage);
    const toasterContext = useContext(ToasterContext);

    const {
        passwordMinimumLength,
        passwordRequiresUppercase,
        passwordRequiresSpecialCharacter,
        passwordRequiresLowercase,
        passwordRequiresDigit,
        useEmailAsUserName,
    } = accountSettings;

    const validateEmail = (email: string) => {
        const errorMessage = !email ? emailRequiredFieldMessage : emailRegexp.test(email) ? "" : emailFieldMessage;
        setEmailError(errorMessage);
        return !errorMessage;
    };

    const validateUserName = (name: string) => {
        const errorMessage = !name && !useEmailAsUserName ? userNameRequiredFieldMessage : "";
        setUserNameError(errorMessage);
        return !errorMessage;
    };

    const validateConfirmPassword = (newPassword: string, newConfirmPassword: string) => {
        const errorMessage =
            newPassword !== newConfirmPassword
                ? siteMessage("CreateNewAccountInfo_PasswordCombination_DoesNotMatch")
                : "";
        setConfirmPasswordErrorMessage(errorMessage);
        return !errorMessage;
    };

    const validateSubmitEnabled = () => {
        return !(emailError || passwordErrorMessage || confirmPasswordErrorMessage || userNameError);
    };

    const emailChangeHandler = (email: string) => {
        validateEmail(email);
        setEmail(email);
    };

    const userChangeHandler = (name: string) => {
        validateUserName(name);
        setUserName(name);
    };

    const passwordChangeHandler = (newPassword: string) => {
        validateConfirmPassword(newPassword, confirmPassword);
        validatePassword({
            password: newPassword,
            onComplete: errorMessage => {
                setPasswordErrorMessage(errorMessage);
            },
        });
        setPassword(newPassword);
    };

    const confirmPasswordChangeHandler = (newConfirmPassword: string) => {
        setConfirmPassword(newConfirmPassword);
        validateConfirmPassword(password, newConfirmPassword);
    };

    const onSuccessHandler = () => {
        setErrorMessage("");
        toasterContext.addToast({ body: translate("Account created successfully!"), messageType: "success" });
        setTimeout(() => {
            signIn({
                userName: useEmailAsUserName ? email : userName,
                password,
                rememberMe: false,
                returnUrl,
            });
        }, 500);
    };

    const submitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isSubmitted) {
            setIsSubmitted(true);
        }

        if (!validateSubmitEnabled()) {
            return;
        }

        const isReCaptchaValid = await validateReCaptcha({});
        if (!isReCaptchaValid) {
            return;
        }

        setIsSubmitting(true);
        addAccount({
            email,
            userName,
            password,
            isSubscribed,
            onSuccess: onSuccessHandler,
            onError: error => {
                setErrorMessage(error);
                setIsSubmitting(false);
            },
            onComplete(resultProps) {
                if (resultProps.apiResult?.successful) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.();
                } else if (resultProps.apiResult?.errorMessage) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onError?.(resultProps.apiResult.errorMessage);
                }
            },
        });
    };

    const isSubmitEnabled = validateSubmitEnabled();

    return (
        <StyledForm {...styles.form} onSubmit={submitHandler} noValidate>
            <GridContainer {...styles.mainGridContainer}>
                <GridItem {...styles.userGridItem}>
                    <GridContainer {...styles.userGridContainer}>
                        <GridItem {...styles.emailGridItem}>
                            <TextField
                                {...styles.emailTextField}
                                type="email"
                                label={translate("Email Address")}
                                onChange={e => emailChangeHandler(e.currentTarget.value)}
                                value={email}
                                data-test-selector="createAccount_email"
                                required
                                error={isSubmitted && emailError}
                            />
                        </GridItem>
                        {!useEmailAsUserName && (
                            <GridItem {...styles.userNameGridItem}>
                                <TextField
                                    {...styles.userNameTextField}
                                    label={translate("User Name")}
                                    value={userName}
                                    data-test-selector="createAccount_userName"
                                    onChange={e => userChangeHandler(e.currentTarget.value)}
                                    error={isSubmitted && userNameError}
                                    required
                                />
                            </GridItem>
                        )}
                        <GridItem {...styles.passwordGridItem}>
                            <TextField
                                id="password"
                                {...styles.passwordTextField}
                                type={showPassword ? undefined : "password"}
                                label={translate("Password")}
                                value={password}
                                onChange={e => passwordChangeHandler(e.currentTarget.value)}
                                error={isSubmitted && passwordErrorMessage}
                                iconProps={{ ...styles.passwordIcon, src: showPassword ? EyeOff : Eye }}
                                iconClickableProps={{
                                    onClick: () => {
                                        setShowPassword(!showPassword);
                                    },
                                    type: "button",
                                }}
                                clickableText={password}
                                data-test-selector="createAccount_password"
                                required
                            />
                        </GridItem>
                        <GridItem {...styles.confirmPasswordGridItem}>
                            <TextField
                                id="confirm-password"
                                {...styles.confirmPasswordTextField}
                                type={showConfirmPassword ? undefined : "password"}
                                label={translate("Confirm Password")}
                                value={confirmPassword}
                                onChange={e => confirmPasswordChangeHandler(e.currentTarget.value)}
                                error={isSubmitted && confirmPasswordErrorMessage}
                                iconProps={{ ...styles.confirmPasswordIcon, src: showConfirmPassword ? EyeOff : Eye }}
                                iconClickableProps={{
                                    onClick: () => {
                                        setShowConfirmPassword(!showConfirmPassword);
                                    },
                                    type: "button",
                                }}
                                clickableText={confirmPassword}
                                data-test-selector="createAccount_confirmPassword"
                                required
                            />
                        </GridItem>
                        <GridItem {...styles.subscriptionGridItem}>
                            <CheckboxGroup>
                                <Checkbox
                                    onChange={(e, value) => setIsSubscribed(value)}
                                    checked={isSubscribed}
                                    data-test-selector="createAccount_Subscription"
                                >
                                    {siteMessage("SignIn_Sign_Up_Newsletter")}
                                </Checkbox>
                            </CheckboxGroup>
                        </GridItem>
                        {errorMessage && (
                            <GridItem data-test-selector="createAccount_ErrorMessage" {...styles.submitErrorGridItem}>
                                <Typography {...styles.submitErrorTitle}>{errorMessage}</Typography>
                            </GridItem>
                        )}
                        <GridItem {...styles.reCaptchaGridItem}>
                            <ReCaptcha location="CreateAccount" />
                        </GridItem>
                        <GridItem {...styles.submitGridItem}>
                            <Button
                                {...styles.submitButton}
                                type="submit"
                                disabled={isSubmitting || (isSubmitted && !isSubmitEnabled)}
                                data-test-selector="createAccount_createButton"
                            >
                                {translate("Create")}
                            </Button>
                        </GridItem>
                    </GridContainer>
                </GridItem>
                <GridItem {...styles.requirementsGridItem}>
                    <Typography {...styles.requirementsTitle}>{translate("Password Requirements")}</Typography>
                    <GridContainer {...styles.passwordRequirementsGridContainer}>
                        <GridItem {...styles.passwordRequirementsGridItem}>
                            {translate(
                                "Password must be at least {0} characters long",
                                passwordMinimumLength.toString(),
                            )}
                        </GridItem>
                        {passwordRequiresDigit && (
                            <GridItem {...styles.passwordRequirementsGridItem}>
                                {translate("Password must include at least one number")}
                            </GridItem>
                        )}
                        {passwordRequiresLowercase && (
                            <GridItem {...styles.passwordRequirementsGridItem}>
                                {translate("Password must include at least one lowercase character")}
                            </GridItem>
                        )}
                        {passwordRequiresUppercase && (
                            <GridItem {...styles.passwordRequirementsGridItem}>
                                {translate("Password must include at least one uppercase character")}
                            </GridItem>
                        )}
                        {passwordRequiresSpecialCharacter && (
                            <GridItem {...styles.passwordRequirementsGridItem}>
                                {translate("Password must include at least one non alphanumeric character")}
                            </GridItem>
                        )}
                    </GridContainer>
                </GridItem>
            </GridContainer>
        </StyledForm>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(CreateAccount),
    definition: {
        allowedContexts: [CreateAccountPageContext],
        group: "Create Account",
    },
};

export default widgetModule;
