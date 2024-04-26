import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";
import { deleteSession } from "@insite/client-framework/Services/SessionService";
import { getIsPunchOutSession } from "@insite/client-framework/Store/Context/ContextSelectors";

type HandlerType = Handler;

export const AbortIfNoPunchOutSession: HandlerType = props => {
    if (!getIsPunchOutSession(props.getState())) {
        return false;
    }
};

export const DeleteSession: HandlerType = () => {
    return deleteSession();
};

export const RedirectAndCancel: HandlerType = () => {
    window.location.href = "/api/v1/punchOut/porequisition?operation=cancel";
};

export const chain = [AbortIfNoPunchOutSession, DeleteSession, RedirectAndCancel];

const cancelPunchOut = createHandlerChainRunnerOptionalParameter(chain, {}, "CancelPunchOut");
export default cancelPunchOut;
