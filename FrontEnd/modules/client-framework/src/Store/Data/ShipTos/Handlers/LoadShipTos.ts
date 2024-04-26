import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import { getShipTos, GetShipTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import { ShipToCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    GetShipTosApiParameter & HasOnSuccess,
    GetShipTosApiParameter,
    ShipToCollectionModel
>;

export const DispatchBeginLoadShipTos: HandlerType = props => {
    props.dispatch({
        type: "Data/ShipTos/BeginLoadShipTos",
        parameter: props.parameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    const newParameter = {
        ...props.parameter,
    };
    delete newParameter.onSuccess;
    props.apiParameter = newParameter;
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getShipTos(props.apiParameter);
};

export const DispatchCompleteLoadShipTos: HandlerType = props => {
    props.dispatch({
        type: "Data/ShipTos/CompleteLoadShipTos",
        collection: props.apiResult,
        parameter: props.parameter,
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => props.parameter.onSuccess?.();

export const chain = [
    DispatchBeginLoadShipTos,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadShipTos,
    ExecuteOnSuccessCallback,
];

const loadShipTos = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadShipTos");
export default loadShipTos;
