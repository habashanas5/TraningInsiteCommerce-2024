import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ wishListLineId: string; qtyOrdered: number }>;

export const DispatchUpdateQuantity: HandlerType = props => {
    props.dispatch({
        type: "Pages/MyListDetails/UpdateQuantity",
        wishListLineId: props.parameter.wishListLineId,
        qtyOrdered: props.parameter.qtyOrdered,
    });
};

export const chain = [DispatchUpdateQuantity];

const updateQuantity = createHandlerChainRunner(chain, "UpdateQuantity");
export default updateQuantity;
