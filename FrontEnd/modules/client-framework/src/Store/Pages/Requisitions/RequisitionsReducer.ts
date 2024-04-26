import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetRequisitionsApiParameter } from "@insite/client-framework/Services/RequisitionService";
import { SetAllRequisitionsIsSelectedParameter } from "@insite/client-framework/Store/Pages/Requisitions/Handlers/SetAllRequisitionsIsSelected";
import RequisitionsState from "@insite/client-framework/Store/Pages/Requisitions/RequisitionsState";
import { Draft } from "immer";

const initialState: RequisitionsState = {
    getRequisitionsParameter: { recalculatePrice: true },
    selectedRequisitionIds: [],
    expandedRequisitionIds: [],
    isEditing: false,
};

const reducer = {
    "Pages/Requisitions/UpdateGetRequisitionsParameter": (
        draft: Draft<RequisitionsState>,
        action: { parameter: Partial<GetRequisitionsApiParameter> },
    ) => {
        draft.getRequisitionsParameter = { ...draft.getRequisitionsParameter, ...action.parameter };

        for (const key in draft.getRequisitionsParameter) {
            const value = (<any>draft.getRequisitionsParameter)[key];

            // remove empty parameters
            if (value === "" || value === undefined) {
                delete (<any>draft.getRequisitionsParameter)[key];
            }
        }

        for (const key in action.parameter) {
            // go back to page 1 if any other parameters changed
            if (draft.getRequisitionsParameter.page && draft.getRequisitionsParameter.page > 1 && key !== "page") {
                draft.getRequisitionsParameter.page = 1;
            }
        }
    },
    "Pages/Requisitions/SetRequisitionIsSelected": (
        draft: Draft<RequisitionsState>,
        action: { requisitionId: string; isSelected: boolean },
    ) => {
        if (action.isSelected) {
            draft.selectedRequisitionIds = draft.selectedRequisitionIds.concat([action.requisitionId]);
        } else {
            draft.selectedRequisitionIds = draft.selectedRequisitionIds.filter(o => o !== action.requisitionId);
        }
    },
    "Pages/Requisitions/SetAllRequisitionsIsSelected": (
        draft: Draft<RequisitionsState>,
        action: SetAllRequisitionsIsSelectedParameter,
    ) => {
        draft.selectedRequisitionIds = action.isSelected && action.requisitionIds ? action.requisitionIds : [];
    },
    "Pages/Requisitions/SetRequisitionIsExpanded": (
        draft: Draft<RequisitionsState>,
        action: { requisitionId: string; isExpanded: boolean },
    ) => {
        if (action.isExpanded) {
            draft.expandedRequisitionIds = draft.expandedRequisitionIds.concat([action.requisitionId]);
        } else {
            draft.expandedRequisitionIds = draft.expandedRequisitionIds.filter(o => o !== action.requisitionId);
        }
    },
    "Pages/Requisitions/BeginUpdateRequisitionLine": (draft: Draft<RequisitionsState>) => {
        draft.isEditing = true;
    },
    "Pages/Requisitions/CompleteUpdateRequisitionLine": (draft: Draft<RequisitionsState>) => {
        draft.isEditing = false;
    },
    "Pages/Requisitions/BeginRemoveRequisitionLine": (draft: Draft<RequisitionsState>) => {
        draft.isEditing = true;
    },
    "Pages/Requisitions/CompleteRemoveRequisitionLine": (draft: Draft<RequisitionsState>) => {
        draft.isEditing = false;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
