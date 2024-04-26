import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import validatePassword from "@insite/client-framework/Store/CommonHandlers/ValidatePassword";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ChangePasswordPageContext } from "@insite/content-library/Pages/ChangePasswordPage";
import ChangePasswordActions from "@insite/content-library/Widgets/ChangePassword/ChangePasswordActions";
import ChangePasswordHeader from "@insite/content-library/Widgets/ChangePassword/ChangePasswordHeader";
import Checkbox, { CheckboxPresentationProps } from "@insite/mobius/Checkbox";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden/Hidden";
import { LinkPresentationProps } from "@insite/mobius/Link/Link";
import { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner/LoadingSpinner";
import TextField from "@insite/mobius/TextField";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { ReactNode, useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const mapDispatchToProps = {
    validatePassword,
};

const mapStateToProps = (state: ApplicationState) => ({
    accountSettings: getSettingsCollection(state).accountSettings,
    pageTitle: getCurrentPage(state).fields.title,
});

export interface ChangePasswordStyles {
    actions: HiddenProps;
    passwordRequirementsGridItem: GridItemProps;
    passwordRequirementsGridContainer: GridContainerProps;
    passwordGridContainer: GridContainerProps;
    userInformationTitle: TypographyProps;
    userInformationGridItem?: GridItemProps;
    showPasswordsGridItem?: GridItemProps;
    showPasswordsCheckbox?: CheckboxPresentationProps;
    changePasswordLink?: LinkPresentationProps;
    spinner?: LoadingSpinnerProps;
    centeringWrapper?: InjectableCss;
}

export const changePasswordStyles: ChangePasswordStyles = {
    actions: {
        css: css`
            width: 100%;
        `,
    },
    passwordGridContainer: {
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    null,
                    null,
                    css`
                        max-width: 300px;
                    `,
                    css`
                        max-width: 300px;
                    `,
                    css`
                        max-width: 300px;
                    `,
                ])}
        `,
        gap: 10,
    },
    passwordRequirementsGridContainer: {
        gap: 2,
        css: css`
            margin-bottom: 10px;
        `,
    },
    passwordRequirementsGridItem: {
        width: 12,
    },
    showPasswordsGridItem: {
        width: 12,
    },
    userInformationGridItem: {
        width: 12,
    },
    changePasswordLink: {
        css: css`
            margin-left: 10px;
        `,
    },
    userInformationTitle: {
        variant: "h4",
        as: "h2",
    },
    spinner: {
        css: css`
            margin: auto;
        `,
    },
    centeringWrapper: {
        css: css`
            height: 150px;
            display: flex;
            align-items: center;
        `,
    },
};

const styles = changePasswordStyles;

const ChangePasswordView = ({ accountSettings, pageTitle, validatePassword }: Props) => {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordErrorMessage, setNewPasswordErrorMessage] = useState<ReactNode>("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [showValidation, setShowValidation] = useState(false);
    const [error, setError] = useState(false);
    const [showPasswords, setShowPasswords] = useState(false);

    useEffect(() => {
        setError(
            !!newPasswordErrorMessage || !newPassword || !confirmNewPassword || confirmNewPassword !== newPassword,
        );
    }, [newPassword, newPasswordErrorMessage, confirmNewPassword]);

    const {
        passwordMinimumLength,
        passwordRequiresUppercase,
        passwordRequiresSpecialCharacter,
        passwordRequiresLowercase,
        passwordRequiresDigit,
    } = accountSettings;

    const currentPasswordChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setPassword(event.currentTarget.value);
    };

    const newPasswordChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
        const newPassword = event.currentTarget.value;

        validatePassword({
            password: newPassword,
            onComplete: errorMessage => {
                setNewPasswordErrorMessage(errorMessage);
            },
        });

        setNewPassword(newPassword);
    };

    const confirmNewPasswordChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setConfirmNewPassword(event.currentTarget.value);
    };

    const confirmNewPasswordError =
        showValidation && newPassword && confirmNewPassword && newPassword !== confirmNewPassword
            ? siteMessage("CreateNewAccountInfo_PasswordCombination_DoesNotMatch")
            : "";

    return (
        <form>
            <ChangePasswordHeader
                title={pageTitle}
                password={password}
                newPassword={newPassword}
                confirmNewPassword={confirmNewPassword}
                error={error}
                showValidation={showValidation}
                setShowValidation={setShowValidation}
            ></ChangePasswordHeader>
            <Typography {...styles.userInformationTitle}>{translate("Password Requirements")}</Typography>
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
            <GridContainer {...styles.passwordGridContainer}>
                <GridItem {...styles.userInformationGridItem}>
                    <TextField
                        type={showPasswords ? "text" : "password"}
                        label={translate("Current Password")}
                        onInput={currentPasswordChangeHandler}
                        autoComplete="current-password"
                    />
                </GridItem>
                <GridItem {...styles.userInformationGridItem}>
                    <TextField
                        type={showPasswords ? "text" : "password"}
                        label={translate("New Password")}
                        onInput={newPasswordChangeHandler}
                        error={showValidation && newPasswordErrorMessage}
                        autoComplete="new-password"
                    />
                </GridItem>
                <GridItem {...styles.userInformationGridItem}>
                    <TextField
                        type={showPasswords ? "text" : "password"}
                        label={translate("Confirm New Password")}
                        onInput={confirmNewPasswordChangeHandler}
                        error={confirmNewPasswordError}
                        autoComplete="new-password"
                    />
                </GridItem>
                <GridItem {...styles.showPasswordsGridItem}>
                    <Checkbox
                        onChange={() => {
                            setShowPasswords(!showPasswords);
                        }}
                        checked={showPasswords}
                    >
                        {translate("Show Passwords")}
                    </Checkbox>
                </GridItem>
                <GridItem {...styles.userInformationGridItem}>
                    <Hidden {...styles.actions} above="sm">
                        <ChangePasswordActions
                            password={password}
                            newPassword={newPassword}
                            confirmNewPassword={confirmNewPassword}
                            error={error}
                            showValidation={showValidation}
                            setShowValidation={setShowValidation}
                        ></ChangePasswordActions>
                    </Hidden>
                </GridItem>
            </GridContainer>
        </form>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(ChangePasswordView),
    definition: {
        allowedContexts: [ChangePasswordPageContext],
        group: "Change Password",
    },
};

export default widgetModule;
