import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import updateAccountSettings from "@insite/client-framework/Store/Pages/AccountSettings/Handlers/UpdateAccountSettings";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { AccountSettingsPageContext } from "@insite/content-library/Pages/AccountSettingsPage";
import GridContainer from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Link from "@insite/mobius/Link";
import { LinkPresentationProps } from "@insite/mobius/Link/Link";
import TextField from "@insite/mobius/TextField";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import React, { ChangeEvent } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapDispatchToProps = {
    updateAccountSettings,
};

const mapStateToProps = (state: ApplicationState) => ({
    editingAccount: state.pages.accountSettings.editingAccount,
    emailErrorMessage: state.pages.accountSettings.emailErrorMessage,
    useEmailAsUserName: getSettingsCollection(state).accountSettings.useEmailAsUserName,
    changePasswordUrl: getPageLinkByPageType(state, "ChangePasswordPage")?.url,
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface AccountSettingsUserInformationStyles {
    userInformationTitle: TypographyProps;
    userInformationGridItem?: GridItemProps;
    changePasswordLink?: LinkPresentationProps;
}

export const userInformationStyles: AccountSettingsUserInformationStyles = {
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
    },
};

const styles = userInformationStyles;
const password = "*************";

const AccountSettingsUserInformation = ({
    editingAccount,
    useEmailAsUserName,
    changePasswordUrl,
    emailErrorMessage,
    updateAccountSettings,
}: Props) => {
    if (!editingAccount) {
        return null;
    }

    const fullName = `${editingAccount.firstName} ${editingAccount.lastName}`;
    const emailChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        updateAccountSettings({ email: event.currentTarget.value });
    };

    const label = (
        <>
            <Typography>{translate("Password")}</Typography>
            <Link {...styles.changePasswordLink} href={changePasswordUrl}>
                {translate("Change")}
            </Link>
        </>
    );

    return (
        <>
            <Typography {...styles.userInformationTitle}>{translate("Your Information")}</Typography>
            <GridContainer>
                {!useEmailAsUserName && (
                    <GridItem {...styles.userInformationGridItem}>
                        <TextField
                            label={translate("User Name")}
                            value={editingAccount.userName}
                            data-test-selector="accountSettings_userName"
                            disabled
                        />
                    </GridItem>
                )}
                <GridItem {...styles.userInformationGridItem}>
                    <TextField
                        type="email"
                        label={translate("Email")}
                        onChange={emailChangeHandler}
                        value={editingAccount.email}
                        data-test-selector="accountSettings_email"
                        required
                        error={emailErrorMessage}
                    />
                </GridItem>
                <GridItem {...styles.userInformationGridItem}>
                    <TextField label={translate("Full Name")} value={fullName} disabled />
                </GridItem>
                <GridItem {...styles.userInformationGridItem}>
                    <TextField type="password" label={label} disabled value={password} />
                </GridItem>
            </GridContainer>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(AccountSettingsUserInformation),
    definition: {
        allowedContexts: [AccountSettingsPageContext],
        group: "Account Settings",
        displayName: "User Information",
    },
};

export default widgetModule;
