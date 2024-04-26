import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetVmiLocationsApiParameter } from "@insite/client-framework/Services/VmiLocationService";
import VmiLocationsState from "@insite/client-framework/Store/Pages/VmiLocations/VmiLocationsState";
import { Draft } from "immer";

const initialState: VmiLocationsState = {
    getVmiLocationsParameter: {
        expand: ["customerlabel"],
    },
    selectedVmiLocations: {},
};

const reducer = {
    "Pages/VmiLocations/UpdateSearchFields": (
        draft: Draft<VmiLocationsState>,
        action: { parameter: GetVmiLocationsApiParameter },
    ) => {
        draft.getVmiLocationsParameter = { ...draft.getVmiLocationsParameter, ...action.parameter };
    },
    "Pages/VmiLocations/ToggleLocationCheck": (draft: Draft<VmiLocationsState>, action: { ids: string[] }) => {
        for (const id of action.ids) {
            if (draft.selectedVmiLocations[id]) {
                delete draft.selectedVmiLocations[id];
            } else {
                draft.selectedVmiLocations[id] = true;
            }
        }
    },
    "Pages/VmiLocations/ClearLocationChecks": (draft: Draft<VmiLocationsState>) => {
        draft.selectedVmiLocations = {};
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
