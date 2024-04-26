import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ productId: string; unitOfMeasure: string }>;

export const DispatchRemoveProduct: HandlerType = props => {
    props.dispatch({
        type: "Pages/QuickOrder/RemoveProduct",
        productId: props.parameter.productId,
        unitOfMeasure: props.parameter.unitOfMeasure,
    });
};

export const chain = [DispatchRemoveProduct];

const removeProduct = createHandlerChainRunner(chain, "RemoveProduct");
export default removeProduct;
