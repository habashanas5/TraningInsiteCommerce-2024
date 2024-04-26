import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler;

export const DispatchReset: HandlerType = props => {
    props.dispatch({
        type: "Components/ReCaptcha/Reset",
    });
};

export const chain = [DispatchReset];

const resetReCaptcha = createHandlerChainRunnerOptionalParameter(chain, {}, "ResetReCaptcha");
export default resetReCaptcha;
