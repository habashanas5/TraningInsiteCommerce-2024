import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import loadRealTimePricing from "@insite/client-framework/Store/CommonHandlers/LoadRealTimePricing";
import { getProductState } from "@insite/client-framework/Store/Data/Products/ProductsSelectors";

type Parameter = {
    unitOfMeasure: string;
    productId: string;
};

type HandlerType = Handler<Parameter>;

export const DispatchChangeUnitOfMeasure: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductDetails/ChangeUnitOfMeasure",
        unitOfMeasure: props.parameter.unitOfMeasure,
        productId: props.parameter.productId,
    });
};

export const UpdatePrice: HandlerType = props => {
    const state = props.getState();
    const { productId, unitOfMeasure } = props.parameter;
    const product = getProductState(state, productId).value;
    if (!product || product.quoteRequired) {
        return;
    }

    const { productInfosById } = state.pages.productDetails;
    if (!productInfosById) {
        return;
    }

    const productInfo = productInfosById[productId];
    if (!productInfo) {
        return;
    }

    props.dispatch(
        loadRealTimePricing({
            productPriceParameters: [
                {
                    productId,
                    qtyOrdered: productInfo.qtyOrdered,
                    unitOfMeasure: unitOfMeasure ?? "",
                },
            ],
            onSuccess: realTimePricing => {
                const pricing = realTimePricing.realTimePricingResults!.find(o => o.productId === productId);
                if (pricing) {
                    props.dispatch({
                        type: "Pages/ProductDetails/CompleteLoadRealTimePricing",
                        pricing,
                    });
                } else {
                    props.dispatch({
                        type: "Pages/ProductDetails/FailedLoadRealTimePricing",
                        productId,
                    });
                }
            },
            onError: () => {
                props.dispatch({
                    type: "Pages/ProductDetails/FailedLoadRealTimePricing",
                    productId,
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

export const chain = [DispatchChangeUnitOfMeasure, UpdatePrice];

const changeUnitOfMeasure = createHandlerChainRunner(chain, "ChangeUnitOfMeasure");
export default changeUnitOfMeasure;
