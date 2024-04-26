import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { GetWishListLinesApiParameter } from "@insite/client-framework/Services/WishListService";
import { SetAllWishListLinesIsSelectedParameter } from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/SetAllWishListLinesIsSelected";
import MyListDetailsState from "@insite/client-framework/Store/Pages/MyListDetails/MyListDetailsState";
import { ProductInventoryDto, ProductPriceDto } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: MyListDetailsState = {
    loadWishListLinesParameter: { wishListId: "", page: 1, sort: "SortOrder" },
    selectedWishListLineIds: [],
    editingSortOrder: false,
    wishListLinesWithUpdatedQuantity: {},
    quantityAdjustmentModalIsOpen: false,
    productInfosByWishListLineId: {},
};

const reducer = {
    "Pages/MyListDetails/UpdateLoadWishListLinesParameter": (
        draft: Draft<MyListDetailsState>,
        action: { parameter: Partial<GetWishListLinesApiParameter> },
    ) => {
        let needToGoBackToFirstPage = false;
        for (const key in action.parameter) {
            if (key === "page" || key === "wishListId") {
                continue;
            }

            const oldValue = (<any>draft.loadWishListLinesParameter)[key];
            const newValue = (<any>action.parameter)[key];
            if (oldValue !== undefined && oldValue !== newValue) {
                needToGoBackToFirstPage = true;
            }
        }

        draft.loadWishListLinesParameter = { ...draft.loadWishListLinesParameter, ...action.parameter };

        for (const key in draft.loadWishListLinesParameter) {
            const value = (<any>draft.loadWishListLinesParameter)[key];

            // remove empty parameters
            if (value === "" || value === undefined) {
                delete (<any>draft.loadWishListLinesParameter)[key];
            }
        }

        if (
            draft.loadWishListLinesParameter.page &&
            draft.loadWishListLinesParameter.page > 1 &&
            needToGoBackToFirstPage
        ) {
            draft.loadWishListLinesParameter.page = 1;
        }
    },
    "Pages/MyListDetails/SetWishListId": (draft: Draft<MyListDetailsState>, action: { wishListId: string }) => {
        draft.wishListId = action.wishListId;
        draft.productInfosByWishListLineId = {};
    },
    "Pages/MyListDetails/SetWishListLineIsSelected": (
        draft: Draft<MyListDetailsState>,
        action: { wishListLineId: string; isSelected: boolean },
    ) => {
        if (action.isSelected) {
            draft.selectedWishListLineIds = draft.selectedWishListLineIds.concat([action.wishListLineId]);
        } else {
            draft.selectedWishListLineIds = draft.selectedWishListLineIds.filter(o => o !== action.wishListLineId);
        }
    },
    "Pages/MyListDetails/SetAllWishListLinesIsSelected": (
        draft: Draft<MyListDetailsState>,
        action: SetAllWishListLinesIsSelectedParameter,
    ) => {
        draft.selectedWishListLineIds = action.isSelected && action.wishListLineIds ? action.wishListLineIds : [];
    },
    "Pages/MyListDetails/SetEditingSortOrder": (
        draft: Draft<MyListDetailsState>,
        action: { editingSortOrder: boolean },
    ) => {
        draft.editingSortOrder = action.editingSortOrder;
    },
    "Pages/MyListDetails/CompleteUpdateWishListLineQuantities": (
        draft: Draft<MyListDetailsState>,
        action: { isQuantityAdjusted: boolean; wishListLinesWithUpdatedQuantity: SafeDictionary<number> },
    ) => {
        Object.keys(action.wishListLinesWithUpdatedQuantity).forEach(o => {
            draft.wishListLinesWithUpdatedQuantity[o] = true;
        });
        draft.quantityAdjustmentModalIsOpen = action.isQuantityAdjusted;
    },
    "Pages/MyListDetails/SetQuantityAdjustmentModalIsOpen": (
        draft: Draft<MyListDetailsState>,
        action: { modalIsOpen: boolean },
    ) => {
        draft.quantityAdjustmentModalIsOpen = action.modalIsOpen;
    },
    "Pages/MyListDetails/CompleteLoadProductInfos": (
        draft: Draft<MyListDetailsState>,
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

    "Pages/MyListDetails/UpdateQuantity": (
        draft: Draft<MyListDetailsState>,
        action: { wishListLineId: string; qtyOrdered: number },
    ) => {
        const productInfo = draft.productInfosByWishListLineId[action.wishListLineId];
        if (!productInfo) {
            return; // TODO ISC-133147 should this be an error?
        }

        draft.wishListLinesWithUpdatedQuantity[action.wishListLineId] = false;
        productInfo.qtyOrdered = action.qtyOrdered;
    },

    "Pages/MyListDetails/UpdateUnitOfMeasure": (
        draft: Draft<MyListDetailsState>,
        action: {
            wishListLineId: string;
            unitOfMeasure: string;
            pricing?: ProductPriceDto;
            inventory?: ProductInventoryDto;
            failedToLoadPricing?: true;
            failedToLoadInventory?: true;
        },
    ) => {
        const productInfo = draft.productInfosByWishListLineId[action.wishListLineId];
        if (!productInfo) {
            return; // TODO ISC-133147 should this be an error?
        }

        productInfo.unitOfMeasure = action.unitOfMeasure;
        productInfo.pricing = action.pricing;
        productInfo.inventory = action.inventory;
        productInfo.failedToLoadInventory = action.failedToLoadInventory;
        productInfo.failedToLoadPricing = action.failedToLoadPricing;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
