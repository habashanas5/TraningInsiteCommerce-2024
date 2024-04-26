import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";
import { getIsPunchOutSession } from "@insite/client-framework/Store/Context/ContextSelectors";

type HandlerType = Handler;

export const AbortIfNoPunchOutSession: HandlerType = props => {
    if (!getIsPunchOutSession(props.getState())) {
        return false;
    }
};

export const RedirectToPunchOutSubmit: HandlerType = () => {
    window.location.href = "/api/v1/punchOut/porequisition";
};

export const chain = [AbortIfNoPunchOutSession, RedirectToPunchOutSubmit];

const doPunchOutCheckout = createHandlerChainRunnerOptionalParameter(chain, {}, "DoPunchOutCheckout");
export default doPunchOutCheckout;
