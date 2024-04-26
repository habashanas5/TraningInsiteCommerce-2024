import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentUserIsGuest, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getLocation, getReturnUrl } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import signInAsGuest from "@insite/client-framework/Store/Pages/SignIn/Handlers/SignInAsGuest";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { SignInPageContext } from "@insite/content-library/Pages/SignInPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyProps } from "@insite/mobius/Typography/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const enum fields {
    text = "text",
}

const mapStateToProps = (state: ApplicationState) => {
    const { search } = getLocation(state);
    const accountSettings = getSettingsCollection(state).accountSettings;
    const returnUrl = getReturnUrl(state);
    const shippingPageUrl = getPageLinkByPageType(state, "CheckoutShippingPage")?.url;
    const referredFromShipping = returnUrl === shippingPageUrl;
    const createAccountPageLink = getPageLinkByPageType(state, "CreateAccountPage");
    return {
        allowCreateAccount: accountSettings.allowCreateAccount,
        allowGuestCheckout: accountSettings.allowGuestCheckout && !getCurrentUserIsGuest(state) && referredFromShipping,
        returnUrl,
        createAccountUrl: createAccountPageLink ? `${createAccountPageLink.url}${search}` : undefined,
    };
};

const mapDispatchToProps = {
    signInAsGuest,
};

interface OwnProps extends WidgetProps {
    fields: {
        [fields.text]: string;
    };
}

type Props = ReturnType<typeof mapStateToProps> & OwnProps & ResolveThunks<typeof mapDispatchToProps> & HasHistory;

export interface SignInCreateNewAccountStyles {
    signInCreateNewAccountGridContainer?: GridContainerProps;
    signInCreateNewAccountTitleGridItem?: GridItemProps;
    signInCreateNewAccountTextGridItem?: GridItemProps;
    signInCreateNewAccountButtonGridItem?: GridItemProps;
    signInCreateNewAccountTitle?: TypographyProps;
    signInCreateNewAccountText?: TypographyProps;
    checkoutAsGuestButton?: ButtonPresentationProps;
    createNewAccountButton?: ButtonPresentationProps;
}

export const signInCreateNewAccountStyles: SignInCreateNewAccountStyles = {
    signInCreateNewAccountTitle: {
        variant: "h4",
    },
    signInCreateNewAccountTitleGridItem: {
        width: 12,
    },
    signInCreateNewAccountTextGridItem: {
        width: 12,
    },
    signInCreateNewAccountButtonGridItem: {
        width: 12,
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            flex-direction: column;
                        `,
                        null,
                        null,
                        null,
                        css`
                            flex-direction: row;
                            justify-content: space-between;
                        `,
                    ],
                    "min",
                )}
        `,
    },
    checkoutAsGuestButton: {
        variant: "tertiary",
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        null,
                        null,
                        null,
                        css`
                            margin-bottom: 1rem;
                        `,
                    ],
                    "max",
                )}
        `,
    },
    createNewAccountButton: { variant: "secondary" },
};

/**
 * @deprecated Use signInCreateNewAccountStyles instead.
 */
export const signInCreateNewAccount = signInCreateNewAccountStyles;
const styles = signInCreateNewAccountStyles;

const SignInCreateNewAccount: FC<Props> = ({
    history,
    fields,
    allowCreateAccount,
    allowGuestCheckout,
    returnUrl,
    createAccountUrl,
    signInAsGuest,
}) => {
    if (!allowCreateAccount) {
        return null;
    }

    const handleCheckoutAsGuest = () => {
        if (!returnUrl) {
            return;
        }

        signInAsGuest({ returnUrl });
    };

    const handleCreateNewAccount = () => {
        if (!createAccountUrl) {
            return;
        }

        history.push(createAccountUrl);
    };

    return (
        <GridContainer {...styles.signInCreateNewAccountGridContainer}>
            <GridItem {...styles.signInCreateNewAccountTitleGridItem}>
                <Typography {...styles.signInCreateNewAccountTitle}>{translate("Create New Account")}</Typography>
            </GridItem>
            <GridItem {...styles.signInCreateNewAccountTextGridItem}>
                <Typography {...styles.signInCreateNewAccountText}>{fields.text}</Typography>
            </GridItem>
            <GridItem {...styles.signInCreateNewAccountButtonGridItem}>
                {allowGuestCheckout && (
                    <Button
                        {...styles.checkoutAsGuestButton}
                        onClick={handleCheckoutAsGuest}
                        data-test-selector="signInCreateNewAccount_checkoutAsGuest"
                    >
                        {translate("Checkout as Guest")}
                    </Button>
                )}
                {createAccountUrl && (
                    <Button
                        {...styles.createNewAccountButton}
                        onClick={handleCreateNewAccount}
                        data-test-selector="signInCreateNewAccount_createNewAccount"
                    >
                        {translate("Create Account")}
                    </Button>
                )}
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: withHistory(connect(mapStateToProps, mapDispatchToProps)(SignInCreateNewAccount)),
    definition: {
        allowedContexts: [SignInPageContext],
        group: "Sign In",
        icon: "User",
        fieldDefinitions: [
            {
                name: fields.text,
                displayName: "Main Text",
                editorTemplate: "MultilineTextField",
                defaultValue: "Create an account to checkout faster, view order history, save product lists, and more!",
                fieldType: "Translatable",
            },
        ],
    },
};

export default widgetModule;
