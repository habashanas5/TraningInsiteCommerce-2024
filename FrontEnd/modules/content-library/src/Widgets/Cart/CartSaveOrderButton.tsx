/* eslint-disable spire/export-styles */
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import saveOrder from "@insite/client-framework/Store/Pages/Cart/Handlers/SaveOrder";
import translate from "@insite/client-framework/Translate";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import { HasHistory, withHistory } from "@insite/mobius/utilities/HistoryContext";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";

type OwnProps =
    | {
          variant: "button";
          extendedStyles?: ButtonPresentationProps;
      }
    | {
          variant: "clickable";
          extendedStyles?: ClickablePresentationProps;
      };

const mapDispatchToProps = {
    saveOrder,
};

const mapStateToProps = (state: ApplicationState) => {
    const cartState = getCurrentCartState(state);
    const { isSavingOrder } = state.pages.cart;
    return {
        isDisabled: cartState.isLoading || isSavingOrder || cartState.value?.cartLines?.length === 0,
        canSaveOrder: cartState.value?.canSaveOrder,
        isSignedIn: cartState.value?.isAuthenticated && !cartState.value?.isGuestOrder,
        savedOrdersPageUrl: getPageLinkByPageType(state, "SavedOrderDetailsPage")?.url,
        signInPageUrl: getPageLinkByPageType(state, "SignInPage")?.url,
        cartPageUrl: getPageLinkByPageType(state, "CartPage")?.url,
    };
};

type Props = OwnProps &
    ReturnType<typeof mapStateToProps> &
    HasHistory &
    HasToasterContext &
    ResolveThunks<typeof mapDispatchToProps>;

const CartSaveOrderButton = ({
    isDisabled,
    canSaveOrder,
    saveOrder,
    history,
    toaster,
    savedOrdersPageUrl,
    cartPageUrl,
    signInPageUrl,
    extendedStyles,
    isSignedIn,
    variant,
}: Props) => {
    if (!canSaveOrder) {
        return null;
    }
    const RenderComponent = variant === "button" ? Button : Clickable;
    const handleClick = () => {
        if (!isSignedIn) {
            history.push(`${signInPageUrl}?returnUrl=${cartPageUrl}`);
            return;
        }

        saveOrder({
            onSuccess: (orderId: string) => {
                history.push(`${savedOrdersPageUrl}?cartId=${orderId}`);
            },
            onComplete(resultProps) {
                if (resultProps.apiResult?.cart) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.(resultProps.apiResult.cart.id);
                }
            },
            onError: (errorMessage: string) => {
                toaster.addToast({ body: errorMessage, messageType: "danger" });
            },
        });
    };

    return (
        <RenderComponent
            disabled={isDisabled}
            data-test-selector="cart_saveOrder"
            {...extendedStyles}
            onClick={handleClick}
        >
            {translate("Save Order")}
        </RenderComponent>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withHistory(withToaster(CartSaveOrderButton)));
