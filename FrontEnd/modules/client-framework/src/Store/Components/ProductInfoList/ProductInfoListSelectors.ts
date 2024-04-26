import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { ProductModel } from "@insite/client-framework/Types/ApiModels";

export function getProductsForProductInfoList(state: ApplicationState, id: string): ProductModel[] | undefined {
    const productInfoByProductId = state.components.productInfoLists.productInfoListById[id]?.productInfoByProductId;
    return productInfoByProductId
        ? Object.keys(productInfoByProductId).map(o => state.data.products.byId[o])
        : undefined;
}

export function getProductInfoFromList(state: ApplicationState, id: string, productId: string) {
    return state.components.productInfoLists.productInfoListById[id]?.productInfoByProductId[productId];
}

export function getErrorMessage(state: ApplicationState, id: string): string | undefined {
    return state.components.productInfoLists.errorMessageById[id];
}
