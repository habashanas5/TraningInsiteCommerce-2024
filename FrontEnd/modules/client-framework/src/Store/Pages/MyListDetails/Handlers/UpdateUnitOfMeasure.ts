import waitFor from "@insite/client-framework/Common/Utilities/waitFor";
import { createHandlerChainRunner, Handler, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import { updateWishListLine as updateWishListLineApi } from "@insite/client-framework/Services/WishListService";
import loadRealTimeInventory from "@insite/client-framework/Store/CommonHandlers/LoadRealTimeInventory";
import loadRealTimePricing from "@insite/client-framework/Store/CommonHandlers/LoadRealTimePricing";
import { getById } from "@insite/client-framework/Store/Data/DataState";
import { getWishListLinesDataView } from "@insite/client-framework/Store/Data/WishListLines/WishListLinesSelectors";
import loadWishListLines from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListLines";
import { ProductInventoryDto, ProductPriceDto, WishListLineModel } from "@insite/client-framework/Types/ApiModels";

interface Parameter extends HasOnSuccess {
    wishListLineId: string;
    unitOfMeasure: string;
}

interface Props {
    updatedWishListLine: WishListLineModel;
    reloadAllLines: boolean;
    apiResult: WishListLineModel;
    pricing?: ProductPriceDto;
    inventory?: ProductInventoryDto;
    failedToLoadPricing?: true;
    failedToLoadInventory?: true;
}

type HandlerType = Handler<Parameter, Props>;

export const SetUpWishListLine: HandlerType = props => {
    props.reloadAllLines = false;
    const wishListLine = getById(props.getState().data.wishListLines, props.parameter.wishListLineId).value;
    if (!wishListLine) {
        throw new Error(`WishListLine not found for id ${props.parameter.wishListLineId}`);
    }

    props.updatedWishListLine = { ...wishListLine };
    props.updatedWishListLine.unitOfMeasure = props.parameter.unitOfMeasure;
};

export const RequestUpdateWishListLine: HandlerType = async props => {
    props.apiResult = await updateWishListLineApi({
        wishListId: props.getState().pages.myListDetails.loadWishListLinesParameter.wishListId,
        wishListLineId: props.parameter.wishListLineId,
        wishListLine: props.updatedWishListLine,
    });
};

export const ReloadIfProductsHaveSameUnitOfMeasure: HandlerType = props => {
    const state = props.getState();
    const wishListLinesDataView = getWishListLinesDataView(state, state.pages.myListDetails.loadWishListLinesParameter);
    if (!wishListLinesDataView.value) {
        return;
    }

    if (
        wishListLinesDataView.value.find(
            o =>
                o.unitOfMeasure === props.parameter.unitOfMeasure &&
                o.productId === props.updatedWishListLine.productId,
        )
    ) {
        // two products now have the same unit of measure, one will get deleted so reload all
        props.reloadAllLines = true;
        props.dispatch({
            type: "Data/WishListLines/Reset",
        });
        props.dispatch(loadWishListLines());
    }
};

export const UpdatePrice: HandlerType = async props => {
    if (props.reloadAllLines || !props.apiResult || props.apiResult.quoteRequired) {
        return;
    }

    let loadedPricing = false;
    props.dispatch(
        loadRealTimePricing({
            productPriceParameters: [
                {
                    productId: props.apiResult.productId,
                    unitOfMeasure: props.apiResult.unitOfMeasure,
                    qtyOrdered: props.apiResult.qtyOrdered,
                },
            ],
            onComplete: realTimePricingProps => {
                if (realTimePricingProps.apiResult) {
                    props.pricing = realTimePricingProps.apiResult.realTimePricingResults?.find(
                        o => o.productId === props.apiResult.productId,
                    );
                } else if (realTimePricingProps.error) {
                    props.failedToLoadPricing = true;
                }

                loadedPricing = true;
            },
        }),
    );

    await waitFor(() => loadedPricing);
};

export const UpdateInventory: HandlerType = async props => {
    if (props.reloadAllLines || !props.apiResult || props.apiResult.quoteRequired) {
        return;
    }

    let loadedInventory = false;

    props.dispatch(
        loadRealTimeInventory({
            productIds: [props.apiResult.productId],
            onComplete: realTimeInventoryProps => {
                if (realTimeInventoryProps.error) {
                    props.failedToLoadInventory = true;
                } else {
                    props.inventory = realTimeInventoryProps.apiResult?.realTimeInventoryResults?.find(
                        o => o.productId === props.apiResult.productId,
                    );
                }
                loadedInventory = true;
            },
        }),
    );

    await waitFor(() => loadedInventory);
};

export const DispatchUpdateWishListLine: HandlerType = props => {
    if (props.reloadAllLines || !props.apiResult) {
        return;
    }

    props.dispatch({
        type: "Pages/MyListDetails/UpdateUnitOfMeasure",
        wishListLineId: props.apiResult.id,
        unitOfMeasure: props.apiResult.unitOfMeasure,
        pricing: props.pricing,
        inventory: props.inventory,
        failedToLoadPricing: props.failedToLoadPricing,
        failedToLoadInventory: props.failedToLoadInventory,
    });

    props.dispatch({
        type: "Data/WishListLines/UpdateWishListLine",
        model: props.apiResult,
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    SetUpWishListLine,
    RequestUpdateWishListLine,
    ReloadIfProductsHaveSameUnitOfMeasure,
    UpdatePrice,
    UpdateInventory,
    DispatchUpdateWishListLine,
    ExecuteOnSuccessCallback,
];

const updateUnitOfMeasure = createHandlerChainRunner(chain, "UpdateUnitOfMeasure");
export default updateUnitOfMeasure;
