import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import {
    canPlaceOrder,
    canSubmitForApprovalOrder,
    getCartState,
    getCurrentCartState,
} from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import preloadCheckoutShippingData from "@insite/client-framework/Store/Pages/CheckoutShipping/Handlers/PreloadCheckoutShippingData";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { CheckoutReviewAndSubmitPageContext } from "@insite/content-library/Pages/CheckoutReviewAndSubmitPage";
import PlaceOrderButton from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/CheckoutReviewAndSubmitPlaceOrderButton";
import SubmitForApprovalButton from "@insite/content-library/Widgets/CheckoutReviewAndSubmit/CheckoutReviewAndSubmitSubmitForApprovalButton";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import get from "@insite/mobius/utilities/get";
import getColor from "@insite/mobius/utilities/getColor";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const { cartId } = state.pages.checkoutReviewAndSubmit;
    const cartState = cartId ? getCartState(state, cartId) : getCurrentCartState(state);
    return {
        cartId,
        isBackButtonDisabled: state.pages.checkoutReviewAndSubmit.isPlacingOrder,
        checkoutShippingPageLink: getPageLinkByPageType(state, "CheckoutShippingPage"),
        cart: cartState.value,
        showPlaceOrderButton: canPlaceOrder(cartState.value),
        showSubmitForApprovalOrder: canSubmitForApprovalOrder(cartState.value),
        pageTitle: getCurrentPage(state).fields.title,
    };
};

const mapDispatchToProps = {
    preloadCheckoutShippingData,
};

type Props = WidgetProps & HasHistory & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface CheckoutReviewAndSubmitHeaderStyles {
    container?: GridContainerProps;
    gridItem?: GridItemProps;
    headingText?: TypographyPresentationProps;
    buttonsWrapper?: InjectableCss;
    backButton?: ButtonPresentationProps;
    placeOrderButton?: ButtonPresentationProps;
    submitForApprovalButton?: ButtonPresentationProps;
}

export const checkoutReviewAndSubmitHeaderStyles: CheckoutReviewAndSubmitHeaderStyles = {
    gridItem: { width: 12 },
    headingText: {
        variant: "h2",
        css: css`
            margin-bottom: 0;
        `,
    },
    buttonsWrapper: {
        css: css`
            display: flex;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        position: fixed;
                        left: 0;
                        bottom: 0;
                        width: 100%;
                        background: ${getColor("common.background")({ theme })};
                        justify-content: center;
                        z-index: ${get(theme, "zIndex.stickyFooter")};
                    `,
                    css`
                        margin-left: 16px;
                    `,
                    css`
                        margin-left: auto;
                    `,
                    css`
                        margin-left: auto;
                    `,
                    css`
                        margin-left: auto;
                    `,
                ])}
        `,
    },
    backButton: {
        variant: "secondary",
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            width: 50%;
                        `,
                        css`
                            flex-shrink: 1;
                        `,
                        css`
                            flex-shrink: 1;
                        `,
                        css`
                            flex-shrink: 1;
                        `,
                        css`
                            flex-shrink: 1;
                        `,
                    ],
                    "max",
                )}
        `,
    },
    placeOrderButton: {
        css: css`
            flex-shrink: 0;
            margin-left: 10px;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            width: 50%;
                        `,
                        css`
                            width: unset;
                        `,
                    ],
                    "min",
                )}
        `,
    },
    submitForApprovalButton: {
        css: css`
            flex-shrink: 0;
            margin-left: 10px;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            width: 50%;
                        `,
                        css`
                            width: unset;
                        `,
                    ],
                    "min",
                )}
        `,
    },
};

/**
 * @deprecated Use checkoutReviewAndSubmitHeaderStyles instead.
 */
export const header = checkoutReviewAndSubmitHeaderStyles;
const styles = checkoutReviewAndSubmitHeaderStyles;

const CheckoutReviewAndSubmitHeader: FC<Props> = ({
    checkoutShippingPageLink,
    pageTitle,
    showPlaceOrderButton,
    isBackButtonDisabled,
    history,
    preloadCheckoutShippingData,
    cart,
    cartId,
    showSubmitForApprovalOrder,
}) => {
    const backClickHandler = () => {
        preloadCheckoutShippingData({
            cartId,
            onSuccess: () => {
                const backUrl = cartId
                    ? `${checkoutShippingPageLink!.url}?cartId=${cartId}`
                    : checkoutShippingPageLink!.url;
                history.push(backUrl);
            },
        });
    };

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.gridItem}>
                <Typography {...styles.headingText} as="h1">
                    {pageTitle}
                </Typography>
                {cart && (
                    <StyledWrapper {...styles.buttonsWrapper}>
                        <Button
                            {...styles.backButton}
                            onClick={backClickHandler}
                            disabled={isBackButtonDisabled}
                            data-test-selector="checkoutReviewAndSubmitHeader_backButton"
                        >
                            {translate("Back")}
                        </Button>
                        {showPlaceOrderButton && <PlaceOrderButton styles={styles.placeOrderButton} />}
                        {showSubmitForApprovalOrder && (
                            <SubmitForApprovalButton extendedStyles={styles.submitForApprovalButton} />
                        )}
                    </StyledWrapper>
                )}
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(CheckoutReviewAndSubmitHeader)),
    definition: {
        group: "Checkout - Review & Submit",
        allowedContexts: [CheckoutReviewAndSubmitPageContext],
        displayName: "Page Header",
    },
};

export default widgetModule;
