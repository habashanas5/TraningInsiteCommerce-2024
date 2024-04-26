import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ isUploading: boolean }>;

export const DispatchSetIsUploading: HandlerType = props => {
    props.dispatch({
        type: "Components/OrderUpload/SetIsUploading",
        parameter: props.parameter,
    });
};

export const chain = [DispatchSetIsUploading];

const setIsUploading = createHandlerChainRunner(chain, "SetIsUploading");
export default setIsUploading;
