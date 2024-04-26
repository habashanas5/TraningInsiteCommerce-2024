import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ uploadLimitExceeded: boolean }>;

export const DispatchSetUploadLimitExceeded: HandlerType = props => {
    props.dispatch({
        type: "Components/OrderUpload/SetUploadLimitExceeded",
        parameter: props.parameter,
    });
};

export const chain = [DispatchSetUploadLimitExceeded];

const setUploadLimitExceeded = createHandlerChainRunner(chain, "SetUploadLimitExceeded");
export default setUploadLimitExceeded;
