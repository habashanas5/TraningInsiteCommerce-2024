import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ uploadCancelled: boolean }>;

export const DispatchSetUploadCancelled: HandlerType = props => {
    props.dispatch({
        type: "Components/OrderUpload/SetUploadCancelled",
        parameter: props.parameter,
    });
};

export const chain = [DispatchSetUploadCancelled];

const setUploadCancelled = createHandlerChainRunner(chain, "SetUploadCancelled");
export default setUploadCancelled;
