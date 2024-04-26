import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ cartId?: string }>;

export const DispatchSetCartId: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutReviewAndSubmit/SetCartId",
        cartId: props.parameter.cartId,
    });
};

export const chain = [DispatchSetCartId];

const setCartId = createHandlerChainRunner(chain, "SetCartId");
export default setCartId;
