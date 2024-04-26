import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import {
    createHandlerChainRunner,
    Handler,
    HasOnSuccess,
    makeHandlerChainAwaitable,
} from "@insite/client-framework/HandlerCreator";
import loadRealTimeInventory from "@insite/client-framework/Store/CommonHandlers/LoadRealTimeInventory";
import loadRealTimePricing from "@insite/client-framework/Store/CommonHandlers/LoadRealTimePricing";
import { getById } from "@insite/client-framework/Store/Data/DataState";
import {
    ProductInventoryDto,
    ProductPriceDto,
    RealTimeInventoryModel,
    RealTimePricingModel,
    WishListLineModel,
} from "@insite/client-framework/Types/ApiModels";

interface Parameter extends HasOnSuccess {
    wishListLineId: string;
    unitOfMeasure: string;
}

interface Props {
    productInfo: ProductInfo;
    pricing?: ProductPriceDto;
    inventory?: ProductInventoryDto;
}

type HandlerType = Handler<Parameter, Props>;

export const SetUpProductInfo: HandlerType = props => {
    const productInfo = props.getState().pages.staticList.productInfosByWishListLineId[props.parameter.wishListLineId];
    if (!productInfo) {
        throw new Error(`ProductInfo not found for id ${props.parameter.wishListLineId}`);
    }

    props.productInfo = productInfo;
};

export const UpdatePrice: HandlerType = async props => {
    const awaitableLoadRealTimePricing = makeHandlerChainAwaitable<
        Parameters<typeof loadRealTimePricing>[0],
        RealTimePricingModel
    >(loadRealTimePricing);

    const parameter = {
        productPriceParameters: [
            {
                productId: props.productInfo.productId,
                unitOfMeasure: props.parameter.unitOfMeasure,
                qtyOrdered: props.productInfo.qtyOrdered,
            },
        ],
    };
    const realTimePricingModel = await awaitableLoadRealTimePricing(parameter)(props.dispatch, props.getState);
    props.pricing = realTimePricingModel.realTimePricingResults?.find(o => o.productId === props.productInfo.productId);
};

export const UpdateInventory: HandlerType = async props => {
    const awaitableLoadRealTimeInventory = makeHandlerChainAwaitable<
        Parameters<typeof loadRealTimeInventory>[0],
        RealTimeInventoryModel
    >(loadRealTimeInventory);

    const realTimeInventoryModel = await awaitableLoadRealTimeInventory({
        productIds: [props.productInfo.productId],
    })(props.dispatch, props.getState);
    props.inventory = realTimeInventoryModel.realTimeInventoryResults?.find(
        o => o.productId === props.productInfo.productId,
    );
};

export const DispatchUpdateUnitOfMeasure: HandlerType = props => {
    props.dispatch({
        type: "Pages/StaticList/UpdateUnitOfMeasure",
        wishListLineId: props.parameter.wishListLineId,
        unitOfMeasure: props.parameter.unitOfMeasure,
        pricing: props.pricing,
        inventory: props.inventory,
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    SetUpProductInfo,
    UpdatePrice,
    UpdateInventory,
    DispatchUpdateUnitOfMeasure,
    ExecuteOnSuccessCallback,
];

const updateUnitOfMeasure = createHandlerChainRunner(chain, "UpdateUnitOfMeasure");
export default updateUnitOfMeasure;
