import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import LogoutWarningModalState from "@insite/shell/Store/LogoutWarningModal/LogoutWarningModalState";
import { Draft } from "immer";

const reducer = {
    "LogoutWarningModal/ShowModal": (draft: Draft<LogoutWarningModalState>) => {
        draft.isOpen = true;
    },

    "LogoutWarningModal/HideModal": (draft: Draft<LogoutWarningModalState>) => {
        delete draft.isOpen;
    },
};

export default createTypedReducerWithImmer({}, reducer);
