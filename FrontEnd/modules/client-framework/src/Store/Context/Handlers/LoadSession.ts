import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
    HasOnComplete,
} from "@insite/client-framework/HandlerCreator";
import { getSession, GetSessionApiParameter, Session } from "@insite/client-framework/Services/SessionService";
import { getCurrentBillToState } from "@insite/client-framework/Store/Data/BillTos/BillTosSelectors";
import loadCurrentBillTo from "@insite/client-framework/Store/Data/BillTos/Handlers/LoadCurrentBillTo";
import loadCurrentShipTo from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadCurrentShipTo";
import { getCurrentShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";

type HandlerType = ApiHandlerDiscreteParameter<
    GetSessionApiParameter & HasOnComplete<{ apiResult: Session }>,
    GetSessionApiParameter,
    Session
>;

export const DispatchBeginLoadSession: HandlerType = props => {
    props.dispatch({
        type: "Context/BeginLoadSession",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    const { onComplete, ...apiParameter } = props.parameter;
    props.apiParameter = apiParameter;
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getSession(props.apiParameter);
};

export const DispatchCompleteLoadSession: HandlerType = props => {
    props.dispatch({
        type: "Context/CompleteLoadSession",
        session: props.apiResult,
    });
};

export const LoadCurrentBillTo: HandlerType = props => {
    if (props.apiResult.billToId) {
        const billToState = getCurrentBillToState(props.getState());
        if (!billToState.value && !billToState.isLoading) {
            props.dispatch(loadCurrentBillTo);
        }
    }
};

export const LoadCurrentShipTo: HandlerType = props => {
    if (props.apiResult.shipToId) {
        const shipToState = getCurrentShipToState(props.getState());
        if (!shipToState.value && !shipToState.isLoading) {
            props.dispatch(loadCurrentShipTo);
        }
    }
};

export const chain = [
    DispatchBeginLoadSession,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadSession,
    LoadCurrentBillTo,
    LoadCurrentShipTo,
];

const loadSession = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadSession");
export default loadSession;
