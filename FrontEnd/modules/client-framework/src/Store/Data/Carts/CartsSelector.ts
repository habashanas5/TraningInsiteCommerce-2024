import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { Cart, GetCartsApiParameter } from "@insite/client-framework/Services/CartService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getById, getDataView } from "@insite/client-framework/Store/Data/DataState";
import { CartLineModel } from "@insite/client-framework/Types/ApiModels";
import { createContext } from "react";

export function getCurrentCartState(state: ApplicationState) {
    return getById(state.data.carts, API_URL_CURRENT_FRAGMENT, o => state.data.carts.currentId || o);
}

export function getCartState(state: ApplicationState, cartId: string | undefined) {
    return getById(state.data.carts, cartId);
}

export function getCartsDataView(state: ApplicationState, getCartsApiParameter: GetCartsApiParameter) {
    return getDataView(state.data.carts, getCartsApiParameter);
}

export const CartsDataViewContext = createContext<ReturnType<typeof getCartsDataView>>({
    value: undefined,
    isLoading: false,
});

export function isOutOfStock(cartLine: CartLineModel) {
    return cartLine.availability!.messageType === 2 && !cartLine.canBackOrder;
}

export const isPunchOutOrder = (cart: Cart | undefined) => !!cart && !!cart.properties["isPunchout"];

export const isCartEmpty = (cart: Cart | undefined) => cart && !!cart.cartLines && cart.cartLines.length === 0;

export const canCheckoutWithCart = (cart: Cart | undefined) =>
    cart && (cart.canCheckOut || hasRestrictedCartLines(cart) || hasProductsWithInvalidPrice(cart));

export const isCartCheckoutDisabled = (cart: Cart | undefined) =>
    cart &&
    ((!cart.canCheckOut && !cart.canRequisition) ||
        isCartEmpty(cart) ||
        hasRestrictedCartLines(cart) ||
        hasProductsWithInvalidPrice(cart));

export const canSaveOrder = (cart: Cart | undefined) => cart && cart.canSaveOrder && !isCartEmpty(cart);

export const canAddAllToList = (cart: Cart | undefined) =>
    !isCartEmpty(cart) && cart && !!cart.cartLines && cart.cartLines.every(line => line.canAddToWishlist);

export const hasRestrictedCartLines = (cart: Cart | undefined) =>
    cart && !!cart.cartLines && cart.cartLines.filter(cartLine => cartLine.isRestricted).length > 0;

export const canPlaceOrder = (cart: Cart | undefined) =>
    cart &&
    !cart.requiresApproval &&
    (!cart.paymentMethod || (cart.paymentMethod && !cart.paymentMethod.isPaymentProfileExpired));

export const canSubmitForApprovalOrder = (cart: Cart | undefined) => cart && cart.requiresApproval && cart.hasApprover;

export const canSubmitForQuote = (cart: Cart | undefined) =>
    cart && cart.canRequestQuote && !cart.isAwaitingApproval && !isCartEmpty(cart);

export const canSubmitRequisition = (cart: Cart | undefined) => cart && cart.canRequisition && !isCartEmpty(cart);

export const canApplyPromotionsToCart = (cart: Cart | undefined) =>
    cart && !cart.paymentOptions?.isPayPal && cart.type !== "Quote" && cart.type !== "Job";

export const hasQuoteRequiredProducts = (cart: Cart | undefined) =>
    cart?.cartLines?.some(cartLine => cartLine.quoteRequired);

export const hasOnlyQuoteRequiredProducts = (cart: Cart | undefined) =>
    cart?.cartLines?.every(cartLine => cartLine.quoteRequired);

export const hasProductsWithInvalidPrice = (cart: Cart | undefined) =>
    cart?.cartLines?.some(
        cartLine =>
            !cartLine.isPromotionItem &&
            !cartLine.quoteRequired &&
            !cartLine.allowZeroPricing &&
            cartLine.pricing?.unitNetPrice === 0 &&
            cartLine.pricing?.unitRegularPrice === 0,
    );
