import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { Session, updateSession, UpdateSessionApiParameter } from "@insite/client-framework/Services/SessionService";

type HandlerType = ApiHandlerDiscreteParameter<{ dashboardIsHomepage: boolean }, UpdateSessionApiParameter, Session>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        session: {
            dashboardIsHomepage: props.parameter.dashboardIsHomepage,
        } as Session,
    };
};

export const UpdateSession: HandlerType = async props => {
    props.apiResult = await updateSession(props.apiParameter);
};

export const chain = [PopulateApiParameter, UpdateSession];

const setDashboardIsHomepage = createHandlerChainRunner(chain, "SetDashboardIsHomepage");
export default setDashboardIsHomepage;
