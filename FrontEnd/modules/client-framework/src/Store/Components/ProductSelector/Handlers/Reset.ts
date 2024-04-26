import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler;

export const DispatchReset: HandlerType = props => {
    props.dispatch({
        type: "Components/ProductSelector/Reset",
    });
};

export const chain = [DispatchReset];

const reset = createHandlerChainRunnerOptionalParameter(chain, {}, "Reset");
export default reset;
