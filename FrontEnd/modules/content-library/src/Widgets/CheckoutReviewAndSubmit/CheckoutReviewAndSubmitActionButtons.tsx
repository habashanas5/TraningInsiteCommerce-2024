import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import {
    canPlaceOrder,
    canSubmitForApprovalOrder,
    getCartState,
    getCurrentCartState,
} from "@insite/client-framework/Store/Data/Carts/CartsSelector";
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
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
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
    };
};

const mapDispatchToProps = {
    preloadCheckoutShippingData,
};

type Props = WidgetProps & HasHistory & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface CheckoutReviewAndSubmitActionButtonsStyles {
    buttonsWrapper?: InjectableCss;
    backButton?: ButtonPresentationProps;
    placeOrderButton?: ButtonPresentationProps;
    submitForApprovalButton?: ButtonPresentationProps;
}

export const checkoutReviewAndSubmitActionButtonsStyles: CheckoutReviewAndSubmitActionButtonsStyles = {
    buttonsWrapper: {
        css: css`
            display: flex;
            justify-content: flex-end;
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
                    ],
                    "max",
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
                    ],
                    "max",
                )}
        `,
    },
};

const styles = checkoutReviewAndSubmitActionButtonsStyles;

const CheckoutReviewAndSubmitActionButtons = ({
    checkoutShippingPageLink,
    showPlaceOrderButton,
    showSubmitForApprovalOrder,
    history,
    isBackButtonDisabled,
    preloadCheckoutShippingData,
    cart,
    cartId,
}: Props) => {
    if (!cart) {
        return null;
    }

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
        <StyledWrapper {...styles.buttonsWrapper}>
            <Button
                {...styles.backButton}
                onClick={backClickHandler}
                disabled={isBackButtonDisabled}
                data-test-selector="checkoutReviewAndSubmit_back"
            >
                {translate("Back")}
            </Button>
            {showPlaceOrderButton && <PlaceOrderButton styles={styles.placeOrderButton} />}
            {showSubmitForApprovalOrder && <SubmitForApprovalButton extendedStyles={styles.submitForApprovalButton} />}
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(withHistory(CheckoutReviewAndSubmitActionButtons)),
    definition: {
        group: "Checkout - Review & Submit",
        allowedContexts: [CheckoutReviewAndSubmitPageContext],
        displayName: "Action Buttons",
    },
};

export default widgetModule;
