import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import StaticListState from "@insite/client-framework/Store/Pages/StaticList/StaticListState";
import { ProductInventoryDto, ProductPriceDto } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: StaticListState = {
    productInfosByWishListLineId: {},
};

const reducer = {
    "Pages/StaticList/SetWishListId": (draft: Draft<StaticListState>, action: { wishListId: string }) => {
        draft.wishListId = action.wishListId;
    },
    "Pages/StaticList/CompleteLoadProductInfos": (
        draft: Draft<StaticListState>,
        action: { productInfosByWishListLineId: SafeDictionary<ProductInfo> },
    ) => {
        for (const wishListLineId in action.productInfosByWishListLineId) {
            const productInfo = action.productInfosByWishListLineId[wishListLineId]!;
            const existingProductInfo = draft.productInfosByWishListLineId[wishListLineId];
            if (existingProductInfo) {
                existingProductInfo.pricing = productInfo.pricing ?? existingProductInfo.pricing;
                existingProductInfo.inventory = productInfo.inventory ?? existingProductInfo.inventory;
            } else {
                draft.productInfosByWishListLineId[wishListLineId] = productInfo;
            }
        }
    },
    "Pages/StaticList/UpdateQuantity": (
        draft: Draft<StaticListState>,
        action: { wishListLineId: string; qtyOrdered: number },
    ) => {
        const productInfo = draft.productInfosByWishListLineId[action.wishListLineId];
        if (!productInfo) {
            return;
        }

        productInfo.qtyOrdered = action.qtyOrdered;
    },
    "Pages/StaticList/UpdateUnitOfMeasure": (
        draft: Draft<StaticListState>,
        action: {
            wishListLineId: string;
            unitOfMeasure: string;
            pricing?: ProductPriceDto;
            inventory?: ProductInventoryDto;
        },
    ) => {
        const productInfo = draft.productInfosByWishListLineId[action.wishListLineId];
        if (!productInfo) {
            return;
        }

        productInfo.unitOfMeasure = action.unitOfMeasure;
        productInfo.pricing = action.pricing;
        productInfo.inventory = action.inventory;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
