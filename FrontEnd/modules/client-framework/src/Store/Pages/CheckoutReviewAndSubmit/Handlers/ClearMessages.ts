import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";

export const DispatchClearMessages: Handler = props => {
    props.dispatch({
        type: "Pages/CheckoutReviewAndSubmit/ClearMessages",
    });
};

export const chain = [DispatchClearMessages];

const clearMessages = createHandlerChainRunnerOptionalParameter(chain, {}, "ClearMessages");
export default clearMessages;
