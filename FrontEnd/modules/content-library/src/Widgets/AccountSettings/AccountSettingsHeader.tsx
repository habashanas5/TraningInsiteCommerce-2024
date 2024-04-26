import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { hasChanges } from "@insite/client-framework/Store/Pages/AccountSettings/AccountSettingsSelectors";
import saveCurrentAccount from "@insite/client-framework/Store/Pages/AccountSettings/Handlers/SaveCurrentAccount";
import setInitialValues from "@insite/client-framework/Store/Pages/AccountSettings/Handlers/SetInitialValues";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { AccountSettingsPageContext } from "@insite/content-library/Pages/AccountSettingsPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import GridContainer from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import OverflowMenu, { OverflowMenuPresentationProps } from "@insite/mobius/OverflowMenu";
import ToasterContext from "@insite/mobius/Toast/ToasterContext";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import React, { useContext } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    account: state.pages.accountSettings.editingAccount,
    isEmailValid: !state.pages.accountSettings.emailErrorMessage,
    hasChanges: hasChanges(state),
    useDefaultCustomer: state.pages.accountSettings.useDefaultCustomer,
    initialUseDefaultCustomer: state.pages.accountSettings.initialUseDefaultCustomer,
    pageTitle: getCurrentPage(state).fields.title,
});

const mapDispatchToProps = {
    saveCurrentAccount,
    setInitialValues,
};

type Props = WidgetProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

export interface AccountSettingsHeaderStyles {
    title: TypographyProps;
    titleWrapper: GridItemProps;
    buttonSetHidden?: HiddenProps;
    saveButton?: ButtonPresentationProps;
    cancelButton?: ButtonPresentationProps;
    menuHidden?: HiddenProps;
    overflowMenu?: OverflowMenuPresentationProps;
    saveClickable?: ClickablePresentationProps;
    cancelClickable?: ClickablePresentationProps;
    buttonSet?: GridItemProps;
}

export const headerStyles: AccountSettingsHeaderStyles = {
    saveButton: {
        css: css`
            margin-left: 10px;
        `,
    },
    buttonSetHidden: {
        below: "md",
    },
    menuHidden: {
        above: "sm",
    },
    buttonSet: {
        css: css`
            justify-content: flex-end;
        `,
        width: [1, 1, 4, 3, 3],
    },
    titleWrapper: {
        width: [11, 11, 8, 9, 9],
    },
    title: {
        variant: "h2",
    },
};

const styles = headerStyles;

const AccountSettingsHeader = ({
    account,
    isEmailValid,
    hasChanges,
    pageTitle,
    useDefaultCustomer,
    saveCurrentAccount,
    setInitialValues,
}: Props) => {
    if (!account) {
        return null;
    }

    const toasterContext = useContext(ToasterContext);
    const updateSettingsHandler = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
        event.preventDefault();
        saveCurrentAccount({
            onSuccess: () => {
                toasterContext.addToast({ body: translate("Settings updated"), messageType: "success" });
            },
            onError: message => {
                toasterContext.addToast({ body: message, messageType: "warning" });
            },
        });
    };

    const invalidCustomerState = useDefaultCustomer && !account.defaultCustomerId;
    const enableSaveButton = hasChanges && isEmailValid && !invalidCustomerState;

    return (
        <GridContainer>
            <GridItem {...styles.titleWrapper}>
                <Typography {...styles.title}>{pageTitle}</Typography>
            </GridItem>
            <GridItem {...styles.buttonSet}>
                <Hidden {...styles.buttonSetHidden}>
                    {hasChanges && (
                        <Button {...styles.cancelButton} onClick={setInitialValues}>
                            {translate("Cancel")}
                        </Button>
                    )}
                    <Button
                        {...styles.saveButton}
                        onClick={updateSettingsHandler}
                        disabled={!enableSaveButton}
                        data-test-selector="accountSettings_save"
                    >
                        {translate("Save")}
                    </Button>
                </Hidden>
                <Hidden {...styles.menuHidden}>
                    <OverflowMenu position="end" {...styles.overflowMenu}>
                        <Clickable {...styles.cancelClickable} onClick={setInitialValues} disabled={!hasChanges}>
                            {translate("Cancel")}
                        </Clickable>
                        <Clickable
                            {...styles.saveClickable}
                            onClick={updateSettingsHandler}
                            disabled={!enableSaveButton}
                        >
                            {translate("Save")}
                        </Clickable>
                    </OverflowMenu>
                </Hidden>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(AccountSettingsHeader),
    definition: {
        group: "Account Settings",
        allowedContexts: [AccountSettingsPageContext],
        displayName: "Header",
    },
};

export default widgetModule;
