import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import loadRealTimePricing from "@insite/client-framework/Store/CommonHandlers/LoadRealTimePricing";

interface Parameter {
    id: string;
    productId: string;
    qtyOrdered?: number;
    unitOfMeasure?: string;
}

type HandlerType = Handler<Parameter>;

export const LoadRealTimePricing: HandlerType = props => {
    if (!props.parameter.unitOfMeasure) {
        return;
    }
    const productOption =
        props.getState().components.productInfoLists.productInfoListById[props.parameter.id]?.productInfoByProductId[
            props.parameter.productId
        ];
    if (props.parameter.unitOfMeasure === productOption?.unitOfMeasure) {
        return;
    }

    const productParameter = {
        productId: props.parameter.productId,
        qtyOrdered: productOption?.qtyOrdered ?? 1,
        unitOfMeasure: props.parameter.unitOfMeasure,
    };

    props.dispatch(
        loadRealTimePricing({
            productPriceParameters: [productParameter],
            onSuccess: realTimePricing => {
                props.dispatch({
                    type: "Components/ProductInfoLists/CompleteLoadRealTimePricing",
                    id: props.parameter.id,
                    realTimePricing,
                });
            },
            onError: () => {
                props.dispatch({
                    type: "Components/ProductInfoLists/FailedLoadRealTimePricing",
                    id: props.parameter.id,
                });
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
};

export const DispatchUpdateCarouselProduct: HandlerType = props => {
    props.dispatch({
        type: "Components/ProductInfoLists/UpdateProduct",
        id: props.parameter.id,
        productId: props.parameter.productId,
        qtyOrdered: props.parameter.qtyOrdered,
        unitOfMeasure: props.parameter.unitOfMeasure,
    });
};

export const chain = [LoadRealTimePricing, DispatchUpdateCarouselProduct];

const updateProductInfo = createHandlerChainRunner(chain, "UpdateProductInfo");

export default updateProductInfo;
