import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import ErrorModalState from "@insite/shell/Store/ErrorModal/ErrorModalState";
import { Draft } from "immer";

const reducer = {
    "ErrorModal/ShowModal": (
        draft: Draft<ErrorModalState>,
        {
            message,
            error,
            onCloseAction,
            title,
        }: Pick<ErrorModalState, "onCloseAction" | "message" | "error" | "title">,
    ) => {
        draft.isOpen = true;
        draft.message = message;
        draft.error = error;
        draft.onCloseAction = onCloseAction;
        draft.title = title;
    },

    "ErrorModal/HideModal": (draft: Draft<ErrorModalState>) => {
        delete draft.isOpen;
    },
};

export default createTypedReducerWithImmer({}, reducer);
