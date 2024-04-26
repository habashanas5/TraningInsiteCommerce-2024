import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getProductsDataView } from "@insite/client-framework/Store/Data/Products/ProductsSelectors";
import { ProductsDataView } from "@insite/client-framework/Store/Data/Products/ProductsState";

export function getProductListDataView(state: ApplicationState) {
    const { parameter, lastParameter } = state.pages.productList;
    let productsDataView = getProductsDataView(state, parameter);
    if (!productsDataView.value) {
        productsDataView = getProductsDataView(state, lastParameter);
    }

    return productsDataView;
}

export function getProductListDataViewProperty<K extends keyof Omit<ProductsDataView, "ids">>(
    state: ApplicationState,
    key: K,
) {
    const productsDataView = getProductListDataView(state);
    return productsDataView.value ? productsDataView[key] : undefined;
}
