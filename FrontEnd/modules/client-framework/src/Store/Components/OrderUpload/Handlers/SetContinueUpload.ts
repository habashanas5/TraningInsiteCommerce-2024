import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ continueUpload: boolean }>;

export const DispatchSetContinueUpload: HandlerType = props => {
    props.dispatch({
        type: "Components/OrderUpload/SetContinueUpload",
        parameter: props.parameter,
    });
};

export const chain = [DispatchSetContinueUpload];

const setContinueUpload = createHandlerChainRunner(chain, "SetContinueUpload");
export default setContinueUpload;
