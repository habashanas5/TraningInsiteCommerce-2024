import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import { makeHandlerChainAwaitable } from "@insite/client-framework/HandlerCreator";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import validatePassword from "@insite/client-framework/Store/CommonHandlers/ValidatePassword";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import resetPassword from "@insite/client-framework/Store/Context/Handlers/ResetPassword";
import { getLocation } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ResetPasswordPageContext } from "@insite/content-library/Pages/ResetPasswordPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
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
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { ReactNode, useContext, useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapDispatchToProps = {
    resetPassword: makeHandlerChainAwaitable(resetPassword),
    validatePassword,
};

const mapStateToProps = (state: ApplicationState) => ({
    accountSettings: getSettingsCollection(state).accountSettings,
    signInPageLink: getPageLinkByPageType(state, "SignInPage"),
    location: getLocation(state),
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasHistory;

export interface ResetPasswordStyles {
    spinner?: LoadingSpinnerProps;
    centeringWrapper?: InjectableCss;
    mainGridContainer?: GridContainerProps;
    passwordGridItem?: GridItemProps;
    passwordGridContainer?: GridContainerProps;
    instructionsText?: TypographyProps;
    newPasswordGridItem?: GridItemProps;
    newPasswordTextField?: TextFieldPresentationProps;
    newPasswordIcon?: IconPresentationProps;
    confirmNewPasswordGridItem?: GridItemProps;
    confirmNewPasswordTextField?: TextFieldPresentationProps;
    confirmNewPasswordIcon?: IconPresentationProps;
    submitGridItem?: GridItemProps;
    submitButton?: ButtonPresentationProps;
    requirementsGridItem?: GridItemProps;
    requirementsTitle?: TypographyProps;
    passwordRequirementsGridItem?: GridItemProps;
    passwordRequirementsGridContainer?: GridContainerProps;
}

export const resetPasswordStyles: ResetPasswordStyles = {
    centeringWrapper: {
        css: css`
            display: flex;
            height: 300px;
            justify-content: center;
            align-items: center;
        `,
    },
    passwordGridItem: {
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
    passwordGridContainer: {
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
    instructionsText: {
        css: css`
            margin-bottom: 10px;
        `,
    },
    newPasswordGridItem: {
        width: 12,
    },
    confirmNewPasswordGridItem: {
        width: 12,
    },
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
                )}
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

const styles = resetPasswordStyles;

const ResetPassword = ({
    accountSettings,
    signInPageLink,
    location,
    history,
    resetPassword,
    validatePassword,
}: Props) => {
    const [userProfileId, setUserProfileId] = useState<string | undefined>("");
    const [isResettingPassword, setIsResettingPassword] = useState(true);
    const [resetToken, setResetToken] = useState<string | undefined>("");
    const [password, setPassword] = useState("");
    const [passwordErrorMessage, setPasswordErrorMessage] = useState<ReactNode>("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const toasterContext = useContext(ToasterContext);

    const {
        passwordMinimumLength,
        passwordRequiresUppercase,
        passwordRequiresSpecialCharacter,
        passwordRequiresLowercase,
        passwordRequiresDigit,
    } = accountSettings;

    useEffect(() => {
        const parsedQuery = parseQueryString<{ userId?: string; resetToken?: string; reset?: string }>(location.search);
        setUserProfileId(parsedQuery.userId);
        setResetToken(parsedQuery.resetToken);
        setIsResettingPassword(parsedQuery.reset?.toLowerCase() === "true");
    }, []);

    const validateConfirmPassword = (newPassword: string, newConfirmPassword: string) => {
        const errorMessage =
            newPassword !== newConfirmPassword
                ? (siteMessage("CreateNewAccountInfo_PasswordCombination_DoesNotMatch") as string)
                : "";
        setConfirmPasswordErrorMessage(errorMessage);
        return !errorMessage;
    };

    const validateSubmitEnabled = () => {
        return !(passwordErrorMessage || confirmPasswordErrorMessage) && password && confirmPassword;
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

    const submitHandler = async (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!isSubmitted) {
            setIsSubmitted(true);
        }

        passwordChangeHandler(password);

        if (!userProfileId || !resetToken || !validateSubmitEnabled()) {
            return;
        }

        await resetPassword({
            userProfileId,
            userName: undefined,
            newPassword: password,
            resetToken,
            onError: (error: any) => {
                toasterContext.addToast({ body: error, messageType: "danger" });
            },
        });
        toasterContext.addToast({
            body: siteMessage(
                isResettingPassword ? "ResetPassword_SuccessMessage" : "AccountActivation_SuccessMessage",
            ),
            messageType: "success",
        });
        signInPageLink && history.push(signInPageLink.url);
    };

    const isSubmitEnabled = validateSubmitEnabled();

    return (
        <GridContainer {...styles.mainGridContainer}>
            <GridItem {...styles.passwordGridItem}>
                <Typography {...styles.instructionsText}>
                    {siteMessage(
                        isResettingPassword
                            ? "ResetPassword_EnterPasswordInstructions"
                            : "AccountActivation_EnterPasswordInstructions",
                    )}
                </Typography>
                <GridContainer {...styles.passwordGridContainer}>
                    <GridItem {...styles.newPasswordGridItem}>
                        <TextField
                            id="password"
                            type={showPassword ? "text" : "password"}
                            {...styles.newPasswordTextField}
                            label={translate("New Password")}
                            value={password}
                            onChange={e => passwordChangeHandler(e.currentTarget.value)}
                            error={isSubmitted && passwordErrorMessage}
                            iconProps={{ ...styles.newPasswordIcon, src: showPassword ? EyeOff : Eye }}
                            iconClickableProps={{
                                onClick: () => {
                                    setShowPassword(!showPassword);
                                },
                            }}
                            autoComplete="new-password"
                            required
                        />
                    </GridItem>
                    <GridItem {...styles.confirmNewPasswordGridItem}>
                        <TextField
                            id="confirm-password"
                            {...styles.confirmNewPasswordTextField}
                            type={showConfirmPassword ? "text" : "password"}
                            label={translate("Confirm New Password")}
                            value={confirmPassword}
                            onChange={e => confirmPasswordChangeHandler(e.currentTarget.value)}
                            error={isSubmitted && confirmPasswordErrorMessage}
                            iconProps={{ ...styles.confirmNewPasswordIcon, src: showConfirmPassword ? EyeOff : Eye }}
                            iconClickableProps={{
                                onClick: () => {
                                    setShowConfirmPassword(!showConfirmPassword);
                                },
                            }}
                            autoComplete="new-password"
                            required
                        />
                    </GridItem>
                    <GridItem {...styles.submitGridItem}>
                        <Button
                            {...styles.submitButton}
                            onClick={submitHandler}
                            disabled={isSubmitted && !isSubmitEnabled}
                        >
                            {translate("Reset Password")}
                        </Button>
                    </GridItem>
                </GridContainer>
            </GridItem>
            <GridItem {...styles.requirementsGridItem}>
                <Typography {...styles.requirementsTitle}>{translate("Password Requirements")}</Typography>
                <GridContainer {...styles.passwordRequirementsGridContainer}>
                    <GridItem {...styles.passwordRequirementsGridItem}>
                        {translate("Password must be at least {0} characters long", passwordMinimumLength.toString())}
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
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(ResetPassword)),
    definition: {
        allowedContexts: [ResetPasswordPageContext],
        group: "Reset Password",
    },
};

export default widgetModule;
