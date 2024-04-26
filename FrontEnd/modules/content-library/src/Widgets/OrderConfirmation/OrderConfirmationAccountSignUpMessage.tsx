import { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentUserIsGuest, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { OrderConfirmationPageContext } from "@insite/content-library/Pages/OrderConfirmationPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import { breakpointMediaQueries } from "@insite/mobius/utilities";
import getColor from "@insite/mobius/utilities/getColor";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const allowCreateAccount = getSettingsCollection(state).accountSettings.allowCreateAccount;
    const currentUserIsGuest = getCurrentUserIsGuest(state);
    return {
        createAccountUrl: getPageLinkByPageType(state, "CreateAccountPage")?.url,
        showCreateAccountMessage: currentUserIsGuest && allowCreateAccount,
    };
};

export interface OrderConfirmationAccountSignUpMessageStyles {
    container?: InjectableCss;
    createAccountText?: TypographyPresentationProps;
    createAccountButton?: ButtonPresentationProps;
}

export const orderConfirmationAccountSignUpMessageStyles: OrderConfirmationAccountSignUpMessageStyles = {
    container: {
        css: css`
            border: 1px solid ${getColor("common.border")};
            display: flex;
            padding: 1rem;
            width: 100%;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        flex-wrap: wrap;
                    `,
                    css`
                        flex-wrap: wrap;
                    `,
                    null,
                    null,
                    null,
                ])}
        `,
    },
    createAccountText: {
        css: css`
            margin-right: 1rem;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        margin-bottom: 1rem;
                    `,
                    css`
                        margin-bottom: 1rem;
                    `,
                    null,
                    null,
                    null,
                ])}
        `,
    },
    createAccountButton: {
        css: css`
            margin-left: auto;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        null,
                        null,
                        css`
                            flex: 0 0 auto;
                        `,
                    ],
                    "min",
                )}
        `,
    },
};

type Props = HasHistory & WidgetProps & ReturnType<typeof mapStateToProps>;

const StyledContainer = getStyledWrapper("aside");

const styles = orderConfirmationAccountSignUpMessageStyles;

const OrderConfirmationAccountSignUpMessage = ({ createAccountUrl, showCreateAccountMessage, history }: Props) => {
    if (!showCreateAccountMessage || !createAccountUrl) {
        return null;
    }

    const createAccountClickHandler = () => {
        createAccountUrl && history.push(createAccountUrl);
    };

    return (
        <StyledContainer {...styles.container}>
            <Typography {...styles.createAccountText}>{siteMessage("OrderConfirmation_AddAccountMessage")}</Typography>
            <Button {...styles.createAccountButton} onClick={createAccountClickHandler}>
                {translate("Create Account")}
            </Button>
        </StyledContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(withHistory(OrderConfirmationAccountSignUpMessage)),
    definition: {
        allowedContexts: [OrderConfirmationPageContext],
        displayName: "Account Sign Up Message",
        group: "Order Confirmation",
    },
};

export default widgetModule;
