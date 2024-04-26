import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { isConfigurationCompleted } from "@insite/client-framework/Store/Pages/ProductDetails/ProductDetailsSelectors";
import ProductDetailsState from "@insite/client-framework/Store/Pages/ProductDetails/ProductDetailsState";
import {
    ConfigurationModel,
    ProductInventoryDto,
    ProductPriceDto,
    ProductSubscriptionDto,
    RealTimeInventoryModel,
} from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: ProductDetailsState = {
    selectedImageIndex: 0,
    variantSelection: {},
    variantSelectionCompleted: false,
    configurationSelection: {},
    configurationCompleted: false,
};

const reducer = {
    "Pages/ProductDetails/BeginLoadProduct": (
        draft: Draft<ProductDetailsState>,
        action: { path?: string; styledOption?: string },
    ) => {
        draft.lastProductPath = action.path;
        draft.lastStyledOption = action.styledOption;
        draft.selectedProductId = undefined;
        draft.isProductLoading = true;
    },
    "Pages/ProductDetails/CompleteLoadProduct": (
        draft: Draft<ProductDetailsState>,
        action: {
            productInfosById: SafeDictionary<ProductInfo>;
            variantSelection: SafeDictionary<string>;
            selectedProductId?: string;
            configuration?: ConfigurationModel | null;
        },
    ) => {
        draft.selectedProductId = action.selectedProductId;
        draft.productInfosById = action.productInfosById;
        draft.selectedImageIndex = 0;
        draft.variantSelection = action.variantSelection;
        draft.subscription = undefined;
        draft.isProductLoading = false;
        initConfigurationSelection(draft, action.configuration);
    },
    "Pages/ProductDetails/CancelLoadProduct": (draft: Draft<ProductDetailsState>) => {
        draft.isProductLoading = false;
    },
    "Pages/ProductDetails/InitConfigurationSelection": (
        draft: Draft<ProductDetailsState>,
        action: { configuration?: ConfigurationModel | null },
    ) => {
        initConfigurationSelection(draft, action.configuration);
    },
    "Pages/ProductDetails/UpdateConfigurationSelection": (
        draft: Draft<ProductDetailsState>,
        action: {
            configurationSelection: SafeDictionary<string>;
            configurationCompleted: boolean;
        },
    ) => {
        draft.configurationSelection = action.configurationSelection;
        draft.configurationCompleted = action.configurationCompleted;
    },
    "Pages/ProductDetails/UpdateVariantSelection": (
        draft: Draft<ProductDetailsState>,
        action: {
            variantSelection: SafeDictionary<string>;
            variantSelectionCompleted: boolean;
            selectedProductInfo: ProductInfo;
        },
    ) => {
        draft.variantSelection = action.variantSelection;
        draft.variantSelectionCompleted = action.variantSelectionCompleted;
        draft.selectedProductId = action.selectedProductInfo.productId;
        draft.selectedImageIndex = 0;
        draft.productInfosById![draft.selectedProductId] = action.selectedProductInfo;
    },
    "Pages/ProductDetails/ChangeQtyOrdered": (
        draft: Draft<ProductDetailsState>,
        action: { qtyOrdered: number; productId: string },
    ) => {
        const productInfo = draft.productInfosById![action.productId];
        if (productInfo) {
            productInfo.qtyOrdered = action.qtyOrdered;
        }
    },
    "Pages/ProductDetails/ChangeUnitOfMeasure": (
        draft: Draft<ProductDetailsState>,
        action: { unitOfMeasure: string; productId: string },
    ) => {
        const productInfo = draft.productInfosById![action.productId];
        if (productInfo) {
            productInfo.unitOfMeasure = action.unitOfMeasure;
        }
    },
    "Pages/ProductDetails/SetSelectedImageIndex": (draft: Draft<ProductDetailsState>, action: { index: number }) => {
        draft.selectedImageIndex = action.index;
    },
    "Pages/ProductDetails/UpdateSubscription": (
        draft: Draft<ProductDetailsState>,
        action: { subscription: ProductSubscriptionDto },
    ) => {
        draft.subscription = action.subscription;
    },
    "Pages/ProductDetails/CompleteLoadRealTimePricing": (
        draft: Draft<ProductDetailsState>,
        action: { pricing: ProductPriceDto },
    ) => {
        const productInfo = draft.productInfosById![action.pricing.productId];
        if (productInfo) {
            productInfo.pricing = action.pricing;
            delete productInfo.failedToLoadPricing;
        }
    },
    "Pages/ProductDetails/FailedLoadRealTimePricing": (
        draft: Draft<ProductDetailsState>,
        action: { productId: string },
    ) => {
        const productInfo = draft.productInfosById![action.productId];
        if (productInfo) {
            productInfo.failedToLoadPricing = true;
        }
    },
    "Pages/ProductDetails/CompleteLoadRealTimeInventory": (
        draft: Draft<ProductDetailsState>,
        action: { realTimeInventory: RealTimeInventoryModel },
    ) => {
        if (!draft.productInfosById) {
            return;
        }
        action.realTimeInventory.realTimeInventoryResults?.forEach((inventory: ProductInventoryDto) => {
            const productInfo = draft.productInfosById![inventory.productId];
            if (productInfo) {
                productInfo.inventory = inventory;
            }
        });
    },
    "Pages/ProductDetails/FailedLoadRealTimeInventory": (
        draft: Draft<ProductDetailsState>,
        action: { productId: string },
    ) => {
        const productInfo = draft.productInfosById![action.productId];
        if (productInfo) {
            productInfo.failedToLoadInventory = true;
        }
    },
    "Pages/ProductDetails/ResetSelections": (draft: Draft<ProductDetailsState>) => {
        draft.selectedImageIndex = initialState.selectedImageIndex;
        draft.variantSelection = initialState.variantSelection;
        draft.variantSelectionCompleted = initialState.variantSelectionCompleted;
        draft.configurationSelection = initialState.configurationSelection;
        draft.configurationCompleted = initialState.configurationCompleted;
        draft.lastStyledOption = initialState.lastStyledOption;
    },
};

const initConfigurationSelection = (draft: Draft<ProductDetailsState>, configuration?: ConfigurationModel | null) => {
    draft.configurationSelection = {};
    configuration?.configSections?.forEach(configSection => {
        draft.configurationSelection[configSection.id] = configSection.sectionOptions?.find(o => o.selected)?.id || "";
    });
    draft.configurationCompleted = isConfigurationCompleted(draft.configurationSelection);
};

export default createTypedReducerWithImmer(initialState, reducer);
