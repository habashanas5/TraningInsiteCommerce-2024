import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { createFromProduct, ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import ProductSelectorState from "@insite/client-framework/Store/Components/ProductSelector/ProductSelectorState";
import { ProductAutocompleteItemModel, ProductModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: ProductSelectorState = {
    isSearching: false,
    variantModalIsOpen: false,
    variantSelection: {},
    variantSelectionCompleted: false,
};

const reducer = {
    "Components/ProductSelector/BeginSearchProducts": (draft: Draft<ProductSelectorState>) => {
        draft.isSearching = true;
        draft.searchResults = undefined;
    },
    "Components/ProductSelector/CompleteSearchProducts": (
        draft: Draft<ProductSelectorState>,
        action: { result: ProductAutocompleteItemModel[] | null },
    ) => {
        draft.isSearching = false;
        draft.searchResults = action.result ?? [];
    },
    "Components/ProductSelector/UpdateOptions": (
        draft: Draft<ProductSelectorState>,
        action: { result: ProductModel },
    ) => {
        draft.searchResults = [
            {
                id: action.result.id,
                image: action.result.mediumImagePath,
                brandName: action.result.brand?.name ?? "",
                erpNumber: action.result.productNumber,
                brandDetailPagePath: "",
                name: action.result.productTitle,
                url: action.result.urlSegment,
                isNameCustomerOverride: false,
                manufacturerItemNumber: action.result.manufacturerItem,
                title: action.result.productTitle,
            } as ProductAutocompleteItemModel,
        ];
    },
    "Components/ProductSelector/BeginSetProduct": (draft: Draft<ProductSelectorState>) => {
        delete draft.selectedProductInfo;
        delete draft.errorType;
    },
    "Components/ProductSelector/CompleteSetProduct": (
        draft: Draft<ProductSelectorState>,
        action: { productInfo?: ProductInfo },
    ) => {
        draft.selectedProductInfo = action.productInfo;
    },
    "Components/ProductSelector/SetUnitOfMeasure": (
        draft: Draft<ProductSelectorState>,
        action: { unitOfMeasure: string },
    ) => {
        if (!draft.selectedProductInfo) {
            return;
        }

        draft.selectedProductInfo.unitOfMeasure = action.unitOfMeasure;
    },
    "Components/ProductSelector/SetErrorType": (draft: Draft<ProductSelectorState>, action: { errorType: string }) => {
        draft.errorType = action.errorType;
    },
    "Components/ProductSelector/CloseVariantModal": (draft: Draft<ProductSelectorState>) => {
        draft.variantModalIsOpen = false;
        draft.variantSelectionCompleted = false;
        draft.variantModalProductId = undefined;
        draft.selectedVariantProductInfo = undefined;
        draft.variantSelection = {};
    },
    "Components/ProductSelector/OpenVariantModal": (
        draft: Draft<ProductSelectorState>,
        action: {
            productId: string;
        },
    ) => {
        draft.variantModalIsOpen = true;
        draft.variantModalProductId = action.productId;
        draft.variantSelection = {};
    },
    "Components/ProductSelector/UpdateVariantSelection": (
        draft: Draft<ProductSelectorState>,
        action: {
            variantSelection: SafeDictionary<string>;
            variantSelectionCompleted: boolean;
            productInfo?: ProductInfo;
        },
    ) => {
        draft.selectedVariantProductInfo = action.productInfo;
        draft.variantSelection = action.variantSelection;
        draft.variantSelectionCompleted = action.variantSelectionCompleted;
    },
    "Components/ProductSelector/Reset": (draft: Draft<ProductSelectorState>) => {
        return { ...initialState };
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
