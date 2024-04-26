import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetVmiLocationsApiParameter } from "@insite/client-framework/Services/VmiLocationService";
import { setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { VmiLocationsState } from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsState";
import { VmiLocationCollectionModel, VmiLocationModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: VmiLocationsState = {
    isLoading: {},
    byId: {},
    dataViews: {},
    errorStatusCodeById: {},
    isRemoving: false,
};

const reducer = {
    "Data/VmiLocations/BeginLoadVmiLocations": (
        draft: Draft<VmiLocationsState>,
        action: { parameter: GetVmiLocationsApiParameter },
    ) => {
        draft.isRemoving = false;
        setDataViewLoading(draft, action.parameter);
    },

    "Data/VmiLocations/CompleteLoadVmiLocations": (
        draft: Draft<VmiLocationsState>,
        action: { parameter: GetVmiLocationsApiParameter; collection: VmiLocationCollectionModel },
    ) => {
        setDataViewLoaded(draft, action.parameter, action.collection, collection => collection.vmiLocations!);
    },

    "Data/VmiLocations/BeginLoadVmiLocation": (draft: Draft<VmiLocationsState>, action: { id: string }) => {
        draft.isLoading[action.id] = true;
    },

    "Data/VmiLocations/CompleteLoadVmiLocation": (
        draft: Draft<VmiLocationsState>,
        action: { model: VmiLocationModel },
    ) => {
        delete draft.isLoading[action.model.id];
        draft.byId[action.model.id] = action.model;
        if (draft.errorStatusCodeById) {
            delete draft.errorStatusCodeById[action.model.id];
        }
    },

    "Data/VmiLocations/FailedToLoadVmiLocation": (
        draft: Draft<VmiLocationsState>,
        action: { id: string; status: number },
    ) => {
        delete draft.isLoading[action.id];
        if (draft.errorStatusCodeById) {
            draft.errorStatusCodeById[action.id] = action.status;
        }
    },

    "Data/VmiLocations/BeginRemoveVmiLocations": (draft: Draft<VmiLocationsState>) => {
        draft.isRemoving = true;
    },

    "Data/VmiLocations/Reset": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
