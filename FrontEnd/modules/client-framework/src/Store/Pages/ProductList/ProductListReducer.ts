import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetProductCollectionApiV2Parameter } from "@insite/client-framework/Services/ProductServiceV2";
import { DisplayProductsResult } from "@insite/client-framework/Store/Pages/ProductList/Handlers/DisplayProducts";
import ProductListState, {
    ProductFilters,
    ProductListViewType,
} from "@insite/client-framework/Store/Pages/ProductList/ProductListState";
import {
    AttributeTypeFacetModel,
    ProductInventoryDto,
    RealTimeInventoryModel,
    RealTimePricingModel,
} from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: ProductListState = {
    isLoading: false,
    productFilters: {},
    productInfosByProductId: {},
    visibleColumnNames: [],
    tableColumns: [],
};

const reducer = {
    "Pages/ProductList/BeginLoadProducts": (draft: Draft<ProductListState>) => {
        draft.isLoading = true;
    },
    "Pages/ProductList/SetParameter": (
        draft: Draft<ProductListState>,
        action: { parameter: GetProductCollectionApiV2Parameter },
    ) => {
        draft.lastParameter = draft.parameter;
        draft.parameter = action.parameter;
    },
    "Pages/ProductList/CompleteLoadProducts": (
        draft: Draft<ProductListState>,
        action: { result: DisplayProductsResult },
    ) => {
        draft.isLoading = false;

        draft.unfilteredApiParameter = action.result.unfilteredApiParameter;
        draft.filteredApiParameter = action.result.filteredApiParameter;

        if (action.result.productFilters) {
            draft.productFilters = action.result.productFilters;
            draft.isSearchPage = !!action.result.productFilters.query;
        }

        draft.productInfosByProductId = action.result.productInfosByProductId;
    },
    "Pages/ProductList/SetView": (
        draft: Draft<ProductListState>,
        action: { parameter: { view: ProductListViewType } },
    ) => {
        draft.view = action.parameter.view;
    },
    "Pages/ProductList/SetProductFilters": (draft: Draft<ProductListState>, action: { result: ProductFilters }) => {
        draft.productFilters = action.result;
    },
    "Pages/ProductList/SetFilterQuery": (draft: Draft<ProductListState>, action: { result: string }) => {
        draft.filterQuery = action.result;
    },
    "Pages/ProductList/ChangeUnitOfMeasure": (
        draft: Draft<ProductListState>,
        action: { unitOfMeasure: string; productId: string },
    ) => {
        const productInfo = draft.productInfosByProductId[action.productId];
        if (productInfo) {
            productInfo.unitOfMeasure = action.unitOfMeasure;
        }
    },
    "Pages/ProductList/ChangeQtyOrdered": (
        draft: Draft<ProductListState>,
        action: { qtyOrdered: number; productId: string },
    ) => {
        const productInfo = draft.productInfosByProductId[action.productId];
        if (productInfo) {
            productInfo.qtyOrdered = action.qtyOrdered;
        }
    },
    "Pages/ProductList/CompleteLoadRealTimePricing": (
        draft: Draft<ProductListState>,
        action: { realTimePricing: RealTimePricingModel },
    ) => {
        action.realTimePricing.realTimePricingResults?.forEach(pricing => {
            const productInfo = draft.productInfosByProductId[pricing.productId];
            if (productInfo) {
                productInfo.pricing = pricing;
                delete productInfo.failedToLoadPricing;
            }
        });
    },
    "Pages/ProductList/FailedLoadRealTimePricing": (draft: Draft<ProductListState>, action: { productId?: string }) => {
        if (action.productId) {
            const productInfo = draft.productInfosByProductId[action.productId];
            if (productInfo) {
                productInfo.failedToLoadPricing = true;
            }
            return;
        }

        for (const productId in draft.productInfosByProductId) {
            draft.productInfosByProductId[productId]!.failedToLoadPricing = true;
        }
    },

    "Pages/ProductList/CompleteLoadRealTimeInventory": (
        draft: Draft<ProductListState>,
        action: { realTimeInventory: RealTimeInventoryModel },
    ) => {
        action.realTimeInventory?.realTimeInventoryResults?.forEach((inventory: ProductInventoryDto) => {
            const productInfo = draft.productInfosByProductId[inventory.productId];
            if (productInfo) {
                productInfo.inventory = inventory;
            }
        });
    },
    "Pages/ProductList/FailedLoadRealTimeInventory": (
        draft: Draft<ProductListState>,
        action: { productId?: string },
    ) => {
        if (action.productId) {
            const productInfo = draft.productInfosByProductId[action.productId];
            if (productInfo) {
                productInfo.failedToLoadInventory = true;
            }
            return;
        }

        for (const productId in draft.productInfosByProductId) {
            draft.productInfosByProductId[productId]!.failedToLoadInventory = true;
        }
    },
    "Pages/ProductList/ClearProducts": (draft: Draft<ProductListState>) => {
        draft.lastParameter = undefined;
        draft.parameter = undefined;
        draft.productInfosByProductId = {};
        draft.isSearchPage = undefined;
    },
    "Pages/ProductList/SetTableColumns": (
        draft: Draft<ProductListState>,
        action: { tableColumns: AttributeTypeFacetModel[] },
    ) => {
        draft.tableColumns = action.tableColumns;
    },
    "Pages/ProductList/SetVisibleColumnNames": (
        draft: Draft<ProductListState>,
        action: { visibleColumnNames: string[] },
    ) => {
        draft.visibleColumnNames = action.visibleColumnNames;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
