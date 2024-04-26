import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ value: boolean }>;

export const DispatchSetCanSendReturnRequest: HandlerType = props => {
    props.dispatch({
        type: "Pages/RequestRma/SetCanSendReturnRequest",
        canSendReturnRequest: props.parameter.value,
    });
};

export const chain = [DispatchSetCanSendReturnRequest];

const setCanSendReturnRequest = createHandlerChainRunner(chain, "SetCanSendReturnRequest");
export default setCanSendReturnRequest;
