import { ProductContextModel } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { ProductModel } from "@insite/client-framework/Types/ApiModels";

export const MAX_PRODUCTS_TO_COMPARE = 6;

export function getProductIdsForCompare(state: ApplicationState) {
    return state.components.compareProductsDrawer.productsIds;
}

export function getProductsForCompare(state: ApplicationState): ProductModel[] {
    const productsForCompareIds = state.components.compareProductsDrawer.productsIds;
    return productsForCompareIds
        ? productsForCompareIds.map(o => state.data.products.byId[o]).filter(a => typeof a !== "undefined")
        : [];
}

export function getProductCompareChecked(state: ApplicationState, productContext: ProductContextModel) {
    if (productContext && productContext.product) {
        return state.components.compareProductsDrawer.productsIds.includes(productContext.product.id);
    }
    return false;
}

export function getIsProductCompareFull(state: ApplicationState) {
    return state.components.compareProductsDrawer.productsIds.length >= MAX_PRODUCTS_TO_COMPARE;
}

export function getProductCompareReturnUrl(state: ApplicationState): string | undefined {
    return state.components.compareProductsDrawer.returnUrl;
}
