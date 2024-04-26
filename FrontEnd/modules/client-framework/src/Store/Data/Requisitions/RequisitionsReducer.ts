import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetRequisitionsApiParameter } from "@insite/client-framework/Services/RequisitionService";
import { setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { RequisitionsState } from "@insite/client-framework/Store/Data/Requisitions/RequisitionsState";
import { RequisitionCollectionModel, RequisitionModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: RequisitionsState = {
    isLoading: {},
    byId: {},
    dataViews: {},
    errorStatusCodeById: {},
};

const reducer = {
    "Data/Requisitions/BeginLoadRequisitions": (
        draft: Draft<RequisitionsState>,
        action: { parameter: GetRequisitionsApiParameter },
    ) => {
        setDataViewLoading(draft, action.parameter);
    },
    "Data/Requisitions/CompleteLoadRequisitions": (
        draft: Draft<RequisitionsState>,
        action: { parameter: GetRequisitionsApiParameter; collection: RequisitionCollectionModel },
    ) => {
        setDataViewLoaded(draft, action.parameter, action.collection, collection => collection.requisitions!);
    },
    "Data/Requisitions/BeginLoadRequisition": (draft: Draft<RequisitionsState>, action: { requisitionId: string }) => {
        draft.isLoading[action.requisitionId] = true;
    },
    "Data/Requisitions/CompleteLoadRequisition": (
        draft: Draft<RequisitionsState>,
        action: { requisition: RequisitionModel },
    ) => {
        delete draft.isLoading[action.requisition.id];
        draft.byId[action.requisition.id] = action.requisition;
        if (draft.errorStatusCodeById) {
            delete draft.errorStatusCodeById[action.requisition.id];
        }
    },
    "Data/Requisitions/FailedToLoadRequisition": (
        draft: Draft<RequisitionsState>,
        action: { requisitionId: string; status: number },
    ) => {
        delete draft.isLoading[action.requisitionId];
        if (draft.errorStatusCodeById) {
            draft.errorStatusCodeById[action.requisitionId] = action.status;
        }
    },
    "Data/Requisitions/Reset": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
