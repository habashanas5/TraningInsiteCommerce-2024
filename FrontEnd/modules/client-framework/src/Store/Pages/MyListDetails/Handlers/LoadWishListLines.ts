import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import waitFor from "@insite/client-framework/Common/Utilities/waitFor";
import {
    createHandlerChainRunnerOptionalParameter,
    Handler,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import { getWishListLines, GetWishListLinesApiParameter } from "@insite/client-framework/Services/WishListService";
import loadRealTimeInventory from "@insite/client-framework/Store/CommonHandlers/LoadRealTimeInventory";
import loadRealTimePricing from "@insite/client-framework/Store/CommonHandlers/LoadRealTimePricing";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getWishListLinesDataView } from "@insite/client-framework/Store/Data/WishListLines/WishListLinesSelectors";
import updateLoadWishListLinesParameter from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/UpdateLoadWishListLinesParameter";
import { WishListLineCollectionModel, WishListLineModel } from "@insite/client-framework/Types/ApiModels";

type Parameter = HasOnSuccess;

type Props = {
    pricingLoaded?: true;
    inventoryLoaded?: true;
    productInfosByWishListLineId: SafeDictionary<ProductInfo>;
    dataViewParameter: GetWishListLinesApiParameter;
    wishListLines?: WishListLineModel[];
    apiResult?: WishListLineCollectionModel;
    apiParameter: GetWishListLinesApiParameter;
};

type HandlerType = Handler<Parameter, Props>;

export const DispatchBeginLoadWishListLines: HandlerType = props => {
    props.dataViewParameter = props.getState().pages.myListDetails.loadWishListLinesParameter;
    props.wishListLines = getWishListLinesDataView(props.getState(), props.dataViewParameter).value;
    if (!props.wishListLines) {
        props.dispatch({
            type: "Data/WishListLines/BeginLoadWishListLines",
            parameter: props.dataViewParameter,
        });
    }
};

export const PopulateApiParameter: HandlerType = props => {
    if (!props.wishListLines) {
        props.apiParameter = { ...props.dataViewParameter };
    }
};

export const RequestDataFromApi: HandlerType = async props => {
    if (!props.wishListLines) {
        props.apiResult = await getWishListLines(props.apiParameter);
        props.wishListLines = props.apiResult.wishListLines!;
    }
};

export const CheckForEmptyPage: HandlerType = ({ wishListLines, getState, dispatch }) => {
    const loadWishListLinesParameter = getState().pages.myListDetails.loadWishListLinesParameter;
    if (wishListLines?.length === 0 && loadWishListLinesParameter.page && loadWishListLinesParameter.page > 1) {
        dispatch(updateLoadWishListLinesParameter({ page: loadWishListLinesParameter.page - 1 }));
        dispatch(loadWishListLines());
        return false;
    }
};

export const MapProducts: HandlerType = props => {
    props.productInfosByWishListLineId = {};
    props.wishListLines?.forEach(o => {
        props.productInfosByWishListLineId[o.id] = {
            productId: o.productId,
            qtyOrdered: o.qtyOrdered,
            unitOfMeasure: o.unitOfMeasure,
            productDetailPath: o.productUri,
        };
    });
};

export const LoadRealTimePrices: HandlerType = async props => {
    const { wishListLines, productInfosByWishListLineId } = props;
    if (!wishListLines?.length) {
        props.pricingLoaded = true;
        return;
    }

    props.dispatch(
        loadRealTimePricing({
            productPriceParameters: wishListLines!.map(o => ({
                productId: o.productId,
                unitOfMeasure: o.unitOfMeasure,
                qtyOrdered: o.qtyOrdered,
            })),
            onComplete: realTimePricingProps => {
                if (realTimePricingProps?.apiResult) {
                    realTimePricingProps.apiResult.realTimePricingResults?.forEach(pricing => {
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
                } else if (realTimePricingProps.error) {
                    for (const wishListLineId in productInfosByWishListLineId) {
                        productInfosByWishListLineId[wishListLineId]!.failedToLoadPricing = true;
                    }
                }
                props.pricingLoaded = true;
            },
        }),
    );

    if (getSettingsCollection(props.getState()).productSettings.inventoryIncludedWithPricing) {
        await waitFor(() => !!props.pricingLoaded);
    }
};

export const LoadRealTimeInventory: HandlerType = props => {
    const { wishListLines, productInfosByWishListLineId } = props;
    if (!wishListLines?.length) {
        props.inventoryLoaded = true;
        return;
    }

    const wishListLineIds = Object.keys(productInfosByWishListLineId);
    props.dispatch(
        loadRealTimeInventory({
            productIds: wishListLineIds.map(o => productInfosByWishListLineId[o]!.productId),
            onComplete: realTimeInventoryProps => {
                if (realTimeInventoryProps?.error) {
                    wishListLineIds.forEach(o => {
                        const productInfo = productInfosByWishListLineId[o]!;
                        if (productInfo) {
                            productInfo.failedToLoadInventory = true;
                        }
                    });
                } else {
                    realTimeInventoryProps?.apiResult?.realTimeInventoryResults?.forEach(inventory => {
                        wishListLineIds.forEach(o => {
                            const productInfo = productInfosByWishListLineId[o]!;
                            if (productInfo.productId === inventory.productId) {
                                productInfo.inventory = inventory;
                            }
                        });
                    });
                }

                props.inventoryLoaded = true;
            },
        }),
    );
};

export const WaitForData: HandlerType = async props => {
    const checkData = () => {
        return !!props.pricingLoaded && !!props.inventoryLoaded;
    };

    await waitFor(checkData);
};

export const DispatchCompleteLoadWishListLines: HandlerType = ({
    dispatch,
    apiParameter,
    apiResult,
    productInfosByWishListLineId,
    dataViewParameter,
}) => {
    dispatch({
        type: "Data/WishLists/ResetDataViews",
    });

    dispatch({
        type: "Pages/MyListDetails/CompleteLoadProductInfos",
        productInfosByWishListLineId,
    });

    if (apiResult) {
        dispatch({
            type: "Data/WishListLines/CompleteLoadWishListLines",
            parameter: dataViewParameter,
            result: apiResult,
        });
        dispatch({
            type: "Data/WishLists/CompleteLoadWishListLines",
            parameter: apiParameter,
            result: apiResult,
        });
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    DispatchBeginLoadWishListLines,
    PopulateApiParameter,
    RequestDataFromApi,
    CheckForEmptyPage,
    MapProducts,
    LoadRealTimePrices,
    LoadRealTimeInventory,
    WaitForData,
    DispatchCompleteLoadWishListLines,
    ExecuteOnSuccessCallback,
];

const loadWishListLines = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadWishListLines");
export default loadWishListLines;
