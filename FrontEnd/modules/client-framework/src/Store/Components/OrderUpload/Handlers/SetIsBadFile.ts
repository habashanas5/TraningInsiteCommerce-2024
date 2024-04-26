import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ isBadFile: boolean }>;

export const DispatchSetIsBadFile: HandlerType = props => {
    props.dispatch({
        type: "Components/OrderUpload/SetIsBadFile",
        parameter: props.parameter,
    });
};

export const chain = [DispatchSetIsBadFile];

const setIsBadFile = createHandlerChainRunner(chain, "SetIsBadFile");
export default setIsBadFile;
