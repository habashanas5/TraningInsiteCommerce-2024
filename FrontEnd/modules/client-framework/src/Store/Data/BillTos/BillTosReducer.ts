import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { GetBillTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import { BillTosState } from "@insite/client-framework/Store/Data/BillTos/BillTosState";
import { assignById, setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { BillToCollectionModel, BillToModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: BillTosState = {
    isLoading: {},
    byId: {},
    dataViews: {},
};

const reducer = {
    "Data/BillTos/BeginLoadBillTos": (draft: Draft<BillTosState>, action: { parameter: GetBillTosApiParameter }) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/BillTos/CompleteLoadBillTos": (
        draft: Draft<BillTosState>,
        action: { parameter: GetBillTosApiParameter; collection: BillToCollectionModel },
    ) => {
        setDataViewLoaded(draft, action.parameter, action.collection, collection => collection.billTos!);
    },

    "Data/BillTos/BeginLoadBillTo": (draft: Draft<BillTosState>, action: { id: string }) => {
        draft.isLoading[action.id] = true;
    },

    "Data/BillTos/CompleteLoadBillTo": (
        draft: Draft<BillTosState>,
        action: { model: BillToModel; isCurrent?: boolean },
    ) => {
        if (action.isCurrent) {
            delete draft.isLoading[API_URL_CURRENT_FRAGMENT];
            draft.currentId = action.model.id;
        } else {
            delete draft.isLoading[action.model.id];
        }

        assignById(draft, action.model);
    },

    "Data/BillTos/CompleteUpdateBillTo": (draft: Draft<BillTosState>, action: { model: BillToModel }) => {
        assignById(draft, action.model);
    },

    "Data/BillTos/Reset": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
