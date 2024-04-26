import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ errorMessage?: string }>;

export const DispatchSetPlaceOrderErrorMessage: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutReviewAndSubmit/SetPlaceOrderErrorMessage",
        errorMessage: props.parameter.errorMessage,
    });
};

export const chain = [DispatchSetPlaceOrderErrorMessage];

const setPlaceOrderErrorMessage = createHandlerChainRunner(chain, "SetPlaceOrderErrorMessage");
export default setPlaceOrderErrorMessage;
