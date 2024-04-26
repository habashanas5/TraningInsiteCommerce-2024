import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import sendActivationEmail from "@insite/client-framework/Store/Pages/UserSetup/Handlers/SendActivationEmail";
import setUserFields from "@insite/client-framework/Store/Pages/UserSetup/Handlers/SetUserFields";
import { getCurrentEditingUser } from "@insite/client-framework/Store/Pages/UserSetup/UserSetupSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import { UserSetupPageContext } from "@insite/content-library/Pages/UserSetupPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Checkbox, { CheckboxPresentationProps, CheckboxProps } from "@insite/mobius/Checkbox";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    editingUser: getCurrentEditingUser(state),
});

const mapDispatchToProps = {
    setUserFields,
    sendActivationEmail,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & HasToasterContext;

export interface UserSetupStatusStyles {
    title?: TypographyPresentationProps;
    wrapper?: InjectableCss;
    activationStatus?: CheckboxPresentationProps;
    lastSignInLabel?: TypographyPresentationProps;
    lastSignInText?: TypographyPresentationProps;
    accountStatusLabel?: TypographyPresentationProps;
    accountStatusText?: TypographyPresentationProps;
    sendActivationEmailButton?: ButtonPresentationProps;
}

export const userSetupStatusStyles: UserSetupStatusStyles = {
    title: { variant: "h5" },
    wrapper: {
        css: css`
            padding-bottom: 15px;
            font-weight: 400;
        `,
    },
    lastSignInLabel: {
        css: css`
            margin-bottom: 5px;
            font-size: 15px;
            font-weight: 600;
        `,
    },
    accountStatusLabel: {
        variant: "h6",
        css: css`
            margin-bottom: 5px;
            font-size: 15px;
            font-weight: 600;
        `,
    },
    accountStatusText: {
        css: css`
            display: block;
            margin-bottom: 10px;
        `,
    },
    sendActivationEmailButton: {
        variant: "secondary",
    },
};

const styles = userSetupStatusStyles;

const UserSetupStatus = ({ editingUser, toaster, setUserFields, sendActivationEmail }: Props) => {
    const [activationEmailSent, setActivationEmailSent] = React.useState(false);
    if (!editingUser) {
        return null;
    }

    const activationStatusChangeHandler: CheckboxProps["onChange"] = (_, value) => {
        setUserFields({ isApproved: value });
    };

    const sendActivationEmailClickHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        sendActivationEmail({
            userName: editingUser.userName,
            onSuccess: () => {
                setActivationEmailSent(true);
                toaster.addToast({ body: translate("Activation email sent."), messageType: "success" });
            },
            onError: (errorMessage: string) => {
                toaster.addToast({ body: errorMessage, messageType: "danger" });
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

    return (
        <>
            <Typography as="h2" {...styles.title} data-test-selector="tst_UserSetupStatus_statusLabel">
                {translate("Status")}
            </Typography>
            <StyledWrapper {...styles.wrapper}>
                <Checkbox
                    {...styles.activationStatus}
                    checked={!!editingUser.isApproved}
                    onChange={activationStatusChangeHandler}
                    data-test-selector="tst_userSetupStatus_activationStatus"
                >
                    {translate("Activation Status")}
                </Checkbox>
            </StyledWrapper>
            <StyledWrapper {...styles.wrapper}>
                <Typography
                    as="p"
                    {...styles.lastSignInLabel}
                    id="lastSignIn"
                    data-test-selector="tst_userSetupStatus_lastSignIn"
                >
                    {translate("Last Sign In")}
                </Typography>
                {editingUser.lastLoginOn && (
                    <Typography
                        as="p"
                        {...styles.lastSignInText}
                        aria-labelledby="lastSignIn"
                        data-test-selector="tst_UserSetupStatus_lastSignInText"
                    >
                        <LocalizedDateTime
                            dateTime={editingUser.lastLoginOn}
                            options={{ year: "numeric", month: "numeric", day: "numeric" }}
                        />
                    </Typography>
                )}
            </StyledWrapper>
            {editingUser.activationStatus !== "Activated" && (
                <StyledWrapper {...styles.wrapper}>
                    <Typography as="h3" {...styles.accountStatusLabel} id="accountStatus">
                        {translate("Account Status")}
                    </Typography>
                    <Typography {...styles.accountStatusText} aria-labelledby="accountStatus">
                        {!activationEmailSent &&
                            editingUser.activationStatus === "EmailNotSent" &&
                            siteMessage("User_Admin_EmailNotSent")}
                        {(activationEmailSent || editingUser.activationStatus === "EmailSent") &&
                            siteMessage("User_Admin_EmailSent")}
                    </Typography>
                    <Button
                        {...styles.sendActivationEmailButton}
                        onClick={sendActivationEmailClickHandler}
                        data-test-selector="tst_userSetupStatus_sendActivationEmail"
                    >
                        {translate(
                            activationEmailSent || editingUser.activationStatus === "EmailSent"
                                ? "Resend Activation Email"
                                : "Send Activation Email",
                        )}
                    </Button>
                </StyledWrapper>
            )}
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withToaster(UserSetupStatus)),
    definition: {
        group: "User Setup",
        displayName: "Status",
        allowedContexts: [UserSetupPageContext],
    },
};

export default widgetModule;
