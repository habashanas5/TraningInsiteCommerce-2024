import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getVmiLocation, GetVmiLocationApiParameter } from "@insite/client-framework/Services/VmiLocationService";
import { VmiLocationModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<{ id: string }, GetVmiLocationApiParameter, VmiLocationModel>;

export const DispatchBeginLoadVmiLocation: HandlerType = props => {
    props.dispatch({
        type: "Data/VmiLocations/BeginLoadVmiLocation",
        id: props.parameter.id,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        id: props.parameter.id,
        expand: ["customerlabel", "customer"],
    };
};

export const RequestDataFromApi: HandlerType = async props => {
    try {
        props.apiResult = await getVmiLocation(props.apiParameter);
    } catch (error) {
        if ("status" in error && error.status === 404) {
            props.dispatch({
                type: "Data/VmiLocations/FailedToLoadVmiLocation",
                id: props.parameter.id,
                status: 404,
            });
            return false;
        }
        throw error;
    }
};

export const DispatchCompleteLoadVmiLocation: HandlerType = props => {
    props.dispatch({
        type: "Data/VmiLocations/CompleteLoadVmiLocation",
        model: props.apiResult,
    });
};

export const chain = [
    DispatchBeginLoadVmiLocation,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadVmiLocation,
];

const loadVmiLocation = createHandlerChainRunner(chain, "LoadVmiLocation");
export default loadVmiLocation;
