import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
} from "@insite/client-framework/HandlerCreator";
import { getShipTo, GetShipToApiParameter } from "@insite/client-framework/Services/CustomersService";
import { ShipToModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<{}, GetShipToApiParameter, ShipToModel>;

export const PopulateApiParameter: HandlerType = props => {
    const {
        session: { billToId, shipToId },
    } = props.getState().context;
    if (!shipToId || !billToId) {
        throw new Error("Unable to load current ship to because it is not defined on the current session");
    }
    props.apiParameter = {
        billToId,
        shipToId,
        expand: ["validation"],
    };
};

export const DispatchBeginLoadShipTo: HandlerType = props => {
    props.dispatch({
        type: "Data/ShipTos/BeginLoadShipTo",
        id: props.apiParameter.shipToId,
    });
};

export const GetShipTo: HandlerType = async props => {
    props.apiResult = await getShipTo(props.apiParameter);
};

export const DispatchCompleteLoadCart: HandlerType = props => {
    props.dispatch({
        type: "Data/ShipTos/CompleteLoadShipTo",
        model: props.apiResult,
        isCurrent: true,
    });
};

export const chain = [PopulateApiParameter, DispatchBeginLoadShipTo, GetShipTo, DispatchCompleteLoadCart];

const loadCurrentShipTo = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadCurrentShipTo");
export default loadCurrentShipTo;
