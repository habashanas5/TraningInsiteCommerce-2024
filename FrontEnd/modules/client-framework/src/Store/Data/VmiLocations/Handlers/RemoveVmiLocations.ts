import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import {
    deleteVmiLocations,
    DeleteVmiLocationsApiParameter,
} from "@insite/client-framework/Services/VmiLocationService";
import loadVmiLocations from "@insite/client-framework/Store/Data/VmiLocations/Handlers/LoadVmiLocations";
import { VmiLocationCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<DeleteVmiLocationsApiParameter, VmiLocationCollectionModel>;

export const DispatchBeginRemoveVmiLocations: HandlerType = props => {
    props.dispatch({
        type: "Data/VmiLocations/BeginRemoveVmiLocations",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RemoveDataFromApi: HandlerType = props => {
    deleteVmiLocations(props.apiParameter).then(() => {
        const state = props.getState();
        props.dispatch(loadVmiLocations(state.pages.vmiLocations.getVmiLocationsParameter));
    });
};

export const DispatchClearDataView: HandlerType = props => {
    props.dispatch({
        type: "Data/VmiLocations/Reset",
    });
};

export const chain = [PopulateApiParameter, DispatchBeginRemoveVmiLocations, RemoveDataFromApi, DispatchClearDataView];

const removeVmiLocations = createHandlerChainRunner(chain, "RemoveVmiLocations");
export default removeVmiLocations;
