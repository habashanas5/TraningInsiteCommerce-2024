import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ allowCancel: boolean }>;

export const DispatchSetAllowCancel: HandlerType = props => {
    props.dispatch({
        type: "Components/OrderUpload/SetAllowCancel",
        parameter: props.parameter,
    });
};

export const chain = [DispatchSetAllowCancel];

const setAllowCancel = createHandlerChainRunner(chain, "SetAllowCancel");
export default setAllowCancel;
