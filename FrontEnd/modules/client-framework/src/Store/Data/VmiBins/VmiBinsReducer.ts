import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetVmiBinsApiParameter } from "@insite/client-framework/Services/VmiBinsService";
import { setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { VmiBinsState } from "@insite/client-framework/Store/Data/VmiBins/VmiBinsState";
import { VmiBinCollectionModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: VmiBinsState = {
    isLoading: {},
    byId: {},
    dataViews: {},
    errorStatusCodeById: {},
    isRemoving: false,
};

const reducer = {
    "Data/VmiBins/BeginLoadVmiBins": (draft: Draft<VmiBinsState>, action: { parameter: GetVmiBinsApiParameter }) => {
        draft.isRemoving = false;
        setDataViewLoading(draft, action.parameter);
    },

    "Data/VmiBins/CompleteLoadVmiBins": (
        draft: Draft<VmiBinsState>,
        action: { parameter: GetVmiBinsApiParameter; collection: VmiBinCollectionModel },
    ) => {
        setDataViewLoaded(draft, action.parameter, action.collection, collection => collection.vmiBins!);
    },

    "Data/VmiBins/BeginRemoveVmiBins": (draft: Draft<VmiBinsState>) => {
        draft.isRemoving = true;
    },

    "Data/VmiBins/Reset": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
