import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type Parameter = {
    qtyOrdered: number;
    productId: string;
};

type HandlerType = Handler<Parameter>;

export const DispatchChangeQtyOrdered: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductDetails/ChangeQtyOrdered",
        qtyOrdered: props.parameter.qtyOrdered,
        productId: props.parameter.productId,
    });
};

export const chain = [DispatchChangeQtyOrdered];

const changeQtyOrdered = createHandlerChainRunner(chain, "ChangeQtyOrdered");
export default changeQtyOrdered;
