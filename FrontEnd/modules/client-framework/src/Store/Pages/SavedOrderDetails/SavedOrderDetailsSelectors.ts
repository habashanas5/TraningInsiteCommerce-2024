import { Cart } from "@insite/client-framework/Services/CartService";

export const canPlaceSavedOrder = (cart: Cart | undefined) =>
    cart &&
    !!cart.cartLines &&
    cart.cartLines.filter(
        o =>
            !o.isRestricted &&
            !o.isDiscontinued &&
            o.canAddToCart &&
            (o.availability?.messageType !== 2 || o.canBackOrder),
    ).length > 0;

export const canAddToListSavedOrder = (cart: Cart | undefined) =>
    cart && !!cart.cartLines && cart.cartLines.filter(o => !o.isRestricted && o.canAddToWishlist).length > 0;
