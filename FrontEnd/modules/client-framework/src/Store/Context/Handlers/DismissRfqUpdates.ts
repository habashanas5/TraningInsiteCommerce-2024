import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
} from "@insite/client-framework/HandlerCreator";
import { Session, updateSession, UpdateSessionApiParameter } from "@insite/client-framework/Services/SessionService";
import { getSession } from "@insite/client-framework/Store/Context/ContextSelectors";

type HandlerType = ApiHandlerDiscreteParameter<{}, UpdateSessionApiParameter, Session>;

export const PopulateApiParameter: HandlerType = props => {
    const session = getSession(props.getState());
    props.apiParameter = {
        session: {
            ...session,
            hasRfqUpdates: false,
        },
    };
};

export const UpdateSession: HandlerType = async props => {
    props.apiResult = await updateSession(props.apiParameter);
};

export const chain = [PopulateApiParameter, UpdateSession];

const dismissRfqUpdates = createHandlerChainRunnerOptionalParameter(chain, {}, "DismissRfqUpdates");
export default dismissRfqUpdates;
