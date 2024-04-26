import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import { getShipTo, GetShipToApiParameter } from "@insite/client-framework/Services/CustomersService";
import { ShipToModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    { shipToId: string; billToId: string } & HasOnSuccess,
    GetShipToApiParameter,
    ShipToModel
>;

export const DispatchBeginLoadOrder: HandlerType = props => {
    props.dispatch({
        type: "Data/ShipTos/BeginLoadShipTo",
        id: props.parameter.shipToId,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        shipToId: props.parameter.shipToId,
        billToId: props.parameter.billToId,
    };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getShipTo(props.apiParameter);
};

export const DispatchCompleteLoadOrder: HandlerType = props => {
    props.dispatch({
        type: "Data/ShipTos/CompleteLoadShipTo",
        model: props.apiResult,
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    DispatchBeginLoadOrder,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadOrder,
    ExecuteOnSuccessCallback,
];

const loadShipTo = createHandlerChainRunner(chain, "LoadShipTo");
export default loadShipTo;
