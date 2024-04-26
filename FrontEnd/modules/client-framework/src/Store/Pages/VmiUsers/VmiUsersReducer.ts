import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetAccountsApiParameter } from "@insite/client-framework/Services/AccountService";
import { GetVmiLocationsApiParameter } from "@insite/client-framework/Services/VmiLocationService";
import VmiUsersState from "@insite/client-framework/Store/Pages/VmiUsers/VmiUsersState";
import { UpdateSearchFieldsType } from "@insite/client-framework/Types/UpdateSearchFieldsType";
import { Draft } from "immer";

const initialState: VmiUsersState = {
    getVmiUsersParameter: {
        expand: ["administration"],
        sort: "UserName",
        roles: ["VMI_User", "VMI_Admin"],
    },
    getVmiLocationsParameter: {
        expand: ["customerlabel"],
    },
    selectedVmiLocations: {},
};

const reducer = {
    "Pages/VmiUsers/ClearSelectedVmiLocations": (draft: Draft<VmiUsersState>) => {
        draft.selectedVmiLocations = {};
    },
    "Pages/VmiUsers/ToggleLocationCheck": (draft: Draft<VmiUsersState>, action: { ids: string[] }) => {
        for (const id of action.ids) {
            if (draft.selectedVmiLocations[id]) {
                delete draft.selectedVmiLocations[id];
            } else {
                draft.selectedVmiLocations[id] = true;
            }
        }
    },
    "Pages/VmiUsers/UpdateSearchFields": (
        draft: Draft<VmiUsersState>,
        action: { parameter: GetAccountsApiParameter & UpdateSearchFieldsType },
    ) => {
        draft.getVmiUsersParameter = { ...draft.getVmiUsersParameter, ...action.parameter };
    },
    "Pages/VmiUsers/UpdateLocationsSearchFields": (
        draft: Draft<VmiUsersState>,
        action: { parameter: GetVmiLocationsApiParameter },
    ) => {
        draft.getVmiLocationsParameter = { ...draft.getVmiLocationsParameter, ...action.parameter };
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
