import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import waitFor from "@insite/client-framework/Common/Utilities/waitFor";
import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { GetWishListsApiParameter } from "@insite/client-framework/Services/WishListService";
import loadRealTimeInventory from "@insite/client-framework/Store/CommonHandlers/LoadRealTimeInventory";
import loadRealTimePricing from "@insite/client-framework/Store/CommonHandlers/LoadRealTimePricing";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import loadWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/LoadWishList";
import { getWishListState } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    {
        wishListId: string;
    },
    GetWishListsApiParameter,
    WishListModel,
    {
        wishList: WishListModel;
        pricingLoaded?: true;
        inventoryLoaded?: true;
        productInfosByWishListLineId: SafeDictionary<ProductInfo>;
    }
>;

export const DispatchSetWishListId: HandlerType = props => {
    props.dispatch({
        type: "Pages/StaticList/SetWishListId",
        wishListId: props.parameter.wishListId,
    });
};

export const DispatchLoadWishListIfNeeded: HandlerType = props => {
    const wishListState = getWishListState(props.getState(), props.parameter.wishListId);
    if (!wishListState.value && !wishListState.isLoading) {
        props.dispatch(
            loadWishList({
                wishListId: props.parameter.wishListId,
                expand: ["staticList", "getAllLines"],
            }),
        );
    }
};

export const WaitForWishList: HandlerType = async props => {
    const checkData = () => {
        const wishListState = getWishListState(props.getState(), props.parameter.wishListId);
        return !!wishListState.value;
    };

    await waitFor(checkData);

    const wishListState = getWishListState(props.getState(), props.parameter.wishListId);
    props.wishList = wishListState.value!;
};

export const MapProducts: HandlerType = props => {
    props.productInfosByWishListLineId = {};
    props.wishList.wishListLineCollection?.forEach(o => {
        props.productInfosByWishListLineId[o.id] = {
            productId: o.productId,
            qtyOrdered: o.qtyOrdered,
            unitOfMeasure: o.unitOfMeasure,
            productDetailPath: o.productUri,
        };
    });
};

export const LoadRealTimePrices: HandlerType = async props => {
    const { wishList, productInfosByWishListLineId } = props;
    if (
        !wishList.wishListLineCollection?.length ||
        !getSettingsCollection(props.getState()).productSettings.canSeePrices
    ) {
        props.pricingLoaded = true;
        return;
    }

    props.dispatch(
        loadRealTimePricing({
            productPriceParameters: wishList.wishListLineCollection.map(o => ({
                productId: o.productId,
                unitOfMeasure: o.unitOfMeasure,
                qtyOrdered: o.qtyOrdered,
            })),
            onSuccess: realTimePricing => {
                realTimePricing.realTimePricingResults?.forEach(pricing => {
                    for (const wishListLineId in productInfosByWishListLineId) {
                        const productInfo = productInfosByWishListLineId[wishListLineId]!;
                        if (
                            productInfo.productId === pricing.productId &&
                            productInfo.unitOfMeasure === pricing.unitOfMeasure
                        ) {
                            productInfo.pricing = pricing;
                        }
                    }
                });

                props.pricingLoaded = true;
            },
            onError: () => {
                for (const wishListLineId in productInfosByWishListLineId) {
                    productInfosByWishListLineId[wishListLineId]!.failedToLoadPricing = true;
                }
                props.pricingLoaded = true;
            },
            onComplete(realTimePricingProps) {
                if (realTimePricingProps.apiResult) {
                    this.onSuccess?.(realTimePricingProps.apiResult);
                } else if (realTimePricingProps.error) {
                    this.onError?.(realTimePricingProps.error);
                }
            },
        }),
    );

    if (getSettingsCollection(props.getState()).productSettings.inventoryIncludedWithPricing) {
        await waitFor(() => !!props.pricingLoaded);
    }
};

export const LoadRealTimeInventory: HandlerType = props => {
    const { wishList, productInfosByWishListLineId } = props;
    if (!wishList.wishListLineCollection?.length) {
        props.inventoryLoaded = true;
        return;
    }

    const wishListLineIds = Object.keys(productInfosByWishListLineId);
    props.dispatch(
        loadRealTimeInventory({
            productIds: wishListLineIds.map(o => productInfosByWishListLineId[o]!.productId),
            onSuccess: realTimeInventory => {
                realTimeInventory.realTimeInventoryResults?.forEach(inventory => {
                    wishListLineIds.forEach(o => {
                        const productInfo = productInfosByWishListLineId[o]!;
                        if (productInfo.productId === inventory.productId) {
                            productInfo.inventory = inventory;
                        }
                    });
                });

                props.inventoryLoaded = true;
            },
            onError: () => {
                for (const wishListLineId in productInfosByWishListLineId) {
                    productInfosByWishListLineId[wishListLineId]!.failedToLoadInventory = true;
                }
                props.inventoryLoaded = true;
            },
            onComplete(realTimeInventoryProps) {
                if (realTimeInventoryProps.apiResult) {
                    this.onSuccess?.(realTimeInventoryProps.apiResult);
                } else if (realTimeInventoryProps.error) {
                    this.onError?.(realTimeInventoryProps.error);
                }
            },
        }),
    );
};

export const WaitForPricingAndInventory: HandlerType = async props => {
    const checkData = () => {
        return !!props.pricingLoaded && !!props.inventoryLoaded;
    };

    await waitFor(checkData);
};

export const DispatchCompleteLoadProductInfos: HandlerType = ({ dispatch, productInfosByWishListLineId }) => {
    dispatch({
        type: "Pages/StaticList/CompleteLoadProductInfos",
        productInfosByWishListLineId,
    });
};

export const chain = [
    DispatchSetWishListId,
    DispatchLoadWishListIfNeeded,
    WaitForWishList,
    MapProducts,
    LoadRealTimePrices,
    LoadRealTimeInventory,
    WaitForPricingAndInventory,
    DispatchCompleteLoadProductInfos,
];

const loadWishListIfNeeded = createHandlerChainRunner(chain, "LoadWishListIfNeeded");
export default loadWishListIfNeeded;
