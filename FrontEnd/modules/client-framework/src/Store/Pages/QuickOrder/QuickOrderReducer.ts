import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import QuickOrderState from "@insite/client-framework/Store/Pages/QuickOrder/QuickOrderState";
import { ProductPriceDto } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: QuickOrderState = {
    productInfos: [],
    total: 0,
};

const reducer = {
    "Pages/QuickOrder/CalculateTotal": (draft: Draft<QuickOrderState>, action: { total: number }) => {
        draft.total = action.total;
    },
    "Pages/QuickOrder/ChangeProductQtyOrdered": (
        draft: Draft<QuickOrderState>,
        action: { productId: string; qtyOrdered: number; unitOfMeasure: string; pricing?: ProductPriceDto },
    ) => {
        const productInfo = draft.productInfos.find(
            o => o.productId === action.productId && o.unitOfMeasure === action.unitOfMeasure,
        );
        if (productInfo) {
            productInfo.qtyOrdered = action.qtyOrdered;
            productInfo.pricing = action.pricing || productInfo.pricing;
        }
    },
    "Pages/QuickOrder/ClearProducts": (draft: Draft<QuickOrderState>) => {
        draft.productInfos = [];
    },
    "Pages/QuickOrder/RemoveProduct": (
        draft: Draft<QuickOrderState>,
        action: { productId: string; unitOfMeasure: string },
    ) => {
        draft.productInfos = draft.productInfos.filter(
            o => !(o.productId === action.productId && o.unitOfMeasure === action.unitOfMeasure),
        );
    },
    "Pages/QuickOrder/BeginAddProduct": () => {},
    "Pages/QuickOrder/CompleteAddProduct": (draft: Draft<QuickOrderState>, action: { productInfo: ProductInfo }) => {
        const existingProduct = draft.productInfos.find(
            o => o.productId === action.productInfo.productId && o.unitOfMeasure === action.productInfo.unitOfMeasure,
        );
        if (!existingProduct) {
            draft.productInfos.unshift(action.productInfo);
        } else {
            existingProduct.pricing = action.productInfo.pricing;
            existingProduct.inventory = action.productInfo.inventory;
            existingProduct.qtyOrdered = action.productInfo.qtyOrdered;
            existingProduct.failedToLoadPricing = action.productInfo.failedToLoadPricing;
        }
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
