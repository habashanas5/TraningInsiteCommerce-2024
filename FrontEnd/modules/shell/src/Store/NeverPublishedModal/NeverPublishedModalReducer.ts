import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import NeverPublishedModalState from "@insite/shell/Store/NeverPublishedModal/NeverPublishedModalState";
import { Draft } from "immer";

const initialState: NeverPublishedModalState = {
    fieldName: "",
    nodeId: "",
};

const reducer = {
    "NeverPublishedModal/ShowModal": (
        draft: Draft<NeverPublishedModalState>,
        action: { fieldName: string; nodeId: string },
    ) => {
        draft.isOpen = true;
        draft.fieldName = action.fieldName;
        draft.nodeId = action.nodeId;
    },

    "NeverPublishedModal/HideModal": (draft: Draft<NeverPublishedModalState>) => {
        delete draft.isOpen;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
