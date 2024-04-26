import { parserOptions } from "@insite/client-framework/Common/BasicSelectors";
import { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import validatePassword from "@insite/client-framework/Store/CommonHandlers/ValidatePassword";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import updatePassword from "@insite/client-framework/Store/Context/Handlers/UpdatePassword";
import translate from "@insite/client-framework/Translate";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Checkbox, { CheckboxPresentationProps } from "@insite/mobius/Checkbox";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import parse from "html-react-parser";
import React, { ReactNode, useEffect, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    enteredUserName: string;
    enteredPassword: string;
    instructionsText?: string;
    onPasswordChanged: (newPassword: string) => void;
}

const mapStateToProps = (state: ApplicationState) => ({
    accountSettings: getSettingsCollection(state).accountSettings,
});

const mapDispatchToProps = {
    validatePassword,
    updatePassword,
};

type Props = OwnProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    HasToasterContext;

export interface SignInChangePasswordFormStyles {
    form?: InjectableCss;
    instructionsText?: TypographyPresentationProps;
    passwordGridContainer?: GridContainerProps;
    userNameGridItem?: GridItemProps;
    userNameTextField?: TextFieldPresentationProps;
    existingPasswordGridItem?: GridItemProps;
    existingPasswordTextField?: TextFieldPresentationProps;
    newPasswordGridItem?: GridItemProps;
    newPasswordTextField?: TextFieldPresentationProps;
    confirmNewPasswordGridItem?: GridItemProps;
    confirmNewPasswordTextField?: TextFieldPresentationProps;
    showPasswordsGridItem?: GridItemProps;
    showPasswordsCheckbox?: CheckboxPresentationProps;
    passwordRequirementsTitle?: TypographyPresentationProps;
    passwordRequirementsGridContainer?: GridContainerProps;
    passwordRequirementsGridItem?: GridItemProps;
    changePasswordButton?: ButtonPresentationProps;
}

export const signInChangePasswordFormStyles: SignInChangePasswordFormStyles = {
    instructionsText: {
        css: css`
            margin-bottom: 10px;
        `,
    },
    passwordGridContainer: {
        gap: 10,
        css: css`
            margin-bottom: 15px;
        `,
    },
    userNameGridItem: { width: 12 },
    existingPasswordGridItem: { width: 12 },
    newPasswordGridItem: { width: 12 },
    confirmNewPasswordGridItem: { width: 12 },
    showPasswordsGridItem: { width: 12 },
    passwordRequirementsTitle: {
        variant: "h6",
        css: css`
            margin-bottom: 10px;
        `,
    },
    passwordRequirementsGridContainer: {
        gap: 2,
        css: css`
            margin-bottom: 15px;
        `,
    },
    passwordRequirementsGridItem: { width: 12 },
    changePasswordButton: {
        css: css`
            float: right;
        `,
    },
};

const styles = signInChangePasswordFormStyles;
const StyledForm = getStyledWrapper("form");

const SignInChangePasswordForm = ({
    enteredUserName,
    enteredPassword,
    instructionsText,
    accountSettings,
    toaster,
    onPasswordChanged,
    validatePassword,
    updatePassword,
}: Props) => {
    const [userName, setUserName] = useState(enteredUserName);
    const [password, setPassword] = useState(enteredPassword);
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

    const userNameChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setUserName(event.currentTarget.value);
    };

    const passwordChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setPassword(event.currentTarget.value);
    };

    const newPasswordChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
        validatePassword({
            password: event.currentTarget.value,
            onComplete: errorMessage => {
                setNewPasswordErrorMessage(errorMessage);
            },
        });
        setNewPassword(event.currentTarget.value);
    };

    const confirmNewPasswordChangeHandler = (event: React.FormEvent<HTMLInputElement>) => {
        setConfirmNewPassword(event.currentTarget.value);
    };

    const savePasswordClickHandler = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (error || newPasswordErrorMessage) {
            setShowValidation(true);
            return;
        }

        updatePassword({
            userName,
            password,
            newPassword,
            onApiResponse: onPasswordChangeApiResponse,
        });
    };

    const onPasswordChangeApiResponse = (error?: string) => {
        if (error) {
            toaster.addToast({
                body: error,
                messageType: "danger",
            });
            return;
        }

        toaster.addToast({
            body: translate("Password Updated"),
            messageType: "success",
        });

        onPasswordChanged(newPassword);
    };

    const confirmNewPasswordError =
        showValidation && newPassword && confirmNewPassword && newPassword !== confirmNewPassword
            ? siteMessage("CreateNewAccountInfo_PasswordCombination_DoesNotMatch")
            : "";

    return (
        <StyledForm {...styles.form} onSubmit={savePasswordClickHandler} noValidate>
            {instructionsText && (
                <Typography as="p" {...styles.instructionsText}>
                    {parse(instructionsText, parserOptions)}
                </Typography>
            )}
            <GridContainer {...styles.passwordGridContainer}>
                <GridItem {...styles.userNameGridItem}>
                    <TextField
                        label={translate("Username")}
                        onInput={userNameChangeHandler}
                        autoComplete="user-name"
                        value={userName}
                        {...styles.userNameTextField}
                    />
                </GridItem>
                <GridItem {...styles.existingPasswordGridItem}>
                    <TextField
                        type={showPasswords ? "text" : "password"}
                        label={translate("Existing Password")}
                        onInput={passwordChangeHandler}
                        autoComplete="existing-password"
                        value={password}
                        {...styles.existingPasswordTextField}
                    />
                </GridItem>
                <GridItem {...styles.newPasswordGridItem}>
                    <TextField
                        type={showPasswords ? "text" : "password"}
                        label={translate("New Password")}
                        onInput={newPasswordChangeHandler}
                        error={newPasswordErrorMessage}
                        autoComplete="new-password"
                        {...styles.newPasswordTextField}
                    />
                </GridItem>
                <GridItem {...styles.confirmNewPasswordGridItem}>
                    <TextField
                        type={showPasswords ? "text" : "password"}
                        label={translate("Confirm New Password")}
                        onInput={confirmNewPasswordChangeHandler}
                        error={confirmNewPasswordError}
                        autoComplete="new-password"
                        {...styles.confirmNewPasswordTextField}
                    />
                </GridItem>
                <GridItem {...styles.showPasswordsGridItem}>
                    <Checkbox
                        onChange={() => {
                            setShowPasswords(!showPasswords);
                        }}
                        checked={showPasswords}
                        hiddenIconText={password}
                        {...styles.showPasswordsCheckbox}
                    >
                        {translate("Show Passwords")}
                    </Checkbox>
                </GridItem>
            </GridContainer>
            <Typography as="h3" {...styles.passwordRequirementsTitle}>
                {translate("Password Requirements")}
            </Typography>
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
            <Button
                {...styles.changePasswordButton}
                type="submit"
                disabled={!userName || !password || !newPassword || !confirmNewPassword}
            >
                {translate("Save New Password")}
            </Button>
        </StyledForm>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withToaster(SignInChangePasswordForm));
