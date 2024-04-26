import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import updateAccountSettings from "@insite/client-framework/Store/Pages/AccountSettings/Handlers/UpdateAccountSettings";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { AccountSettingsPageContext } from "@insite/content-library/Pages/AccountSettingsPage";
import Checkbox, { CheckboxProps } from "@insite/mobius/Checkbox/Checkbox";
import CheckboxGroup, { CheckboxGroupComponentProps } from "@insite/mobius/CheckboxGroup/CheckboxGroup";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapDispatchToProps = {
    updateAccountSettings,
};

const mapStateToProps = (state: ApplicationState) => ({
    account: state.pages.accountSettings.editingAccount,
    allowSubscribeToNewsLetter: getSettingsCollection(state).accountSettings.allowSubscribeToNewsLetter,
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface AccountSettingsManageSubscriptionsStyles {
    manageSubscriptionsCheckboxGroup: CheckboxGroupComponentProps;
    manageSubscriptionsCheckbox: CheckboxProps;
    manageSubscriptionsTitle: TypographyProps;
}

export const manageSubscriptionsStyles: AccountSettingsManageSubscriptionsStyles = {
    manageSubscriptionsTitle: {
        variant: "h4",
        as: "h2",
    },
    manageSubscriptionsCheckbox: {
        typographyProps: {
            css: css`
                margin-left: 10px;
            `,
        },
    },
    manageSubscriptionsCheckboxGroup: {},
};

const styles = manageSubscriptionsStyles;

const AccountSettingsManageSubscriptions = ({ allowSubscribeToNewsLetter, account, updateAccountSettings }: Props) => {
    if (!allowSubscribeToNewsLetter || !account) {
        return null;
    }

    return (
        <>
            <Typography {...styles.manageSubscriptionsTitle}>{translate("Manage Subscriptions")}</Typography>
            <CheckboxGroup {...styles.manageSubscriptionsCheckboxGroup}>
                <Checkbox
                    {...styles.manageSubscriptionsCheckbox}
                    onChange={(_, value) => updateAccountSettings({ isSubscribed: value })}
                    checked={account.isSubscribed!}
                    data-test-selector="accountSettings_subscribed"
                >
                    {translate("Subscribe")}
                </Checkbox>
            </CheckboxGroup>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(AccountSettingsManageSubscriptions),
    definition: {
        allowedContexts: [AccountSettingsPageContext],
        group: "Account Settings",
        displayName: "Manage Subscriptions",
    },
};

export default widgetModule;
