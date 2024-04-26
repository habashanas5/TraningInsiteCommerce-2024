import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { GetProductCollectionApiV2Parameter } from "@insite/client-framework/Services/ProductServiceV2";
import ProductInfoListState from "@insite/client-framework/Store/Components/ProductInfoList/ProductInfoListsState";
import {
    ProductInventoryDto,
    RealTimeInventoryModel,
    RealTimePricingModel,
} from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: ProductInfoListState = {
    productInfoListById: {},
    errorMessageById: {},
};

const reducer = {
    "Components/ProductInfoLists/CompleteLoadProductInfoList": (
        draft: Draft<ProductInfoListState>,
        action: {
            id: string;
            parameter?: GetProductCollectionApiV2Parameter;
            productInfos: ProductInfo[];
            errorMessage?: string;
        },
    ) => {
        const productInfoByProductId: SafeDictionary<ProductInfo> = {};
        for (const productInfo of action.productInfos) {
            productInfoByProductId[productInfo.productId] = productInfo;
        }

        draft.productInfoListById[action.id] = {
            productInfoByProductId,
        };
        draft.errorMessageById[action.id] = action.errorMessage;
    },
    "Components/ProductInfoLists/UpdateProduct": (
        draft: Draft<ProductInfoListState>,
        action: {
            id: string;
            productId: string;
            qtyOrdered?: number;
            unitOfMeasure?: string;
        },
    ) => {
        const productInfoByProductId = draft.productInfoListById[action.id]?.productInfoByProductId;
        if (!productInfoByProductId) {
            return;
        }
        const productInfo = productInfoByProductId[action.productId];
        if (!productInfo) {
            return;
        }

        productInfo.qtyOrdered = action.qtyOrdered ?? productInfo.qtyOrdered;
        productInfo.unitOfMeasure = action.unitOfMeasure ?? productInfo.unitOfMeasure;
    },
    "Components/ProductInfoLists/CompleteLoadRealTimePricing": (
        draft: Draft<ProductInfoListState>,
        action: { realTimePricing: RealTimePricingModel; id: string },
    ) => {
        const productInfoList = draft.productInfoListById[action.id];
        if (!productInfoList) {
            throw new Error(`There was no productInfoList found for the id ${action.id}`);
        }

        action.realTimePricing.realTimePricingResults?.forEach(pricing => {
            const productInfo = productInfoList.productInfoByProductId[pricing.productId];
            if (!productInfo) {
                return;
            }
            productInfo.pricing = pricing;
            delete productInfo.failedToLoadPricing;
        });
    },
    "Components/ProductInfoLists/FailedLoadRealTimePricing": (
        draft: Draft<ProductInfoListState>,
        action: { id: string },
    ) => {
        const productInfoList = draft.productInfoListById[action.id];
        if (!productInfoList) {
            throw new Error(`There was no productInfoList found for the id ${action.id}`);
        }

        for (const key in productInfoList.productInfoByProductId) {
            const productInfo = productInfoList.productInfoByProductId[key];
            if (!productInfo) {
                continue;
            }
            productInfo.failedToLoadPricing = true;
        }
    },

    "Components/ProductInfoLists/CompleteLoadRealTimeInventory": (
        draft: Draft<ProductInfoListState>,
        action: { realTimeInventory: RealTimeInventoryModel; id: string },
    ) => {
        const productInfoList = draft.productInfoListById[action.id];
        if (!productInfoList) {
            throw new Error(`There was no productInfoList found for the id ${action.id}`);
        }

        action.realTimeInventory.realTimeInventoryResults?.forEach((inventory: ProductInventoryDto) => {
            const productInfo = productInfoList.productInfoByProductId[inventory.productId];
            if (!productInfo) {
                return;
            }

            productInfo.inventory = inventory;
        });
    },
    "Components/ProductInfoLists/FailedLoadRealTimeInventory": (
        draft: Draft<ProductInfoListState>,
        action: { id: string },
    ) => {
        const productInfoList = draft.productInfoListById[action.id];
        if (!productInfoList) {
            throw new Error(`There was no productInfoList found for the id ${action.id}`);
        }

        for (const key in productInfoList.productInfoByProductId) {
            const productInfo = productInfoList.productInfoByProductId[key];
            if (!productInfo) {
                continue;
            }
            productInfo.failedToLoadInventory = true;
        }
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
