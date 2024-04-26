import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

interface Parameter {
    punchOutSessionId?: string;
}

type HandlerType = Handler<Parameter>;

export const DispatchSetPunchOutSessionId: HandlerType = props => {
    props.dispatch({
        type: "Context/SetIsPunchOutSessionId",
        punchOutSessionId: props.parameter.punchOutSessionId,
    });
};

export const chain = [DispatchSetPunchOutSessionId];

const setPunchOutSessionId = createHandlerChainRunner(chain, "setPunchOutSessionId");
export default setPunchOutSessionId;
