import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getVmiLocations, GetVmiLocationsApiParameter } from "@insite/client-framework/Services/VmiLocationService";
import { VmiLocationCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetVmiLocationsApiParameter, VmiLocationCollectionModel>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const DispatchBeginLoadVmiLocations: HandlerType = props => {
    props.dispatch({
        type: "Data/VmiLocations/BeginLoadVmiLocations",
        parameter: props.parameter,
    });
};

export const DispatchClearLocationChecks: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiLocations/ClearLocationChecks",
    });
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getVmiLocations(props.apiParameter);
};

export const DispatchCompleteLoadVmiLocations: HandlerType = props => {
    props.dispatch({
        type: "Data/VmiLocations/CompleteLoadVmiLocations",
        collection: props.apiResult,
        parameter: props.parameter,
    });
};

export const chain = [
    PopulateApiParameter,
    DispatchBeginLoadVmiLocations,
    DispatchClearLocationChecks,
    RequestDataFromApi,
    DispatchCompleteLoadVmiLocations,
];

const loadVmiLocations = createHandlerChainRunner(chain, "LoadVmiLocations");
export default loadVmiLocations;
