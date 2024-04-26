import ErrorModalState from "@insite/shell/Store/ErrorModal/ErrorModalState";
import { AnyShellAction } from "@insite/shell/Store/Reducers";

export const showErrorModal = (
    message?: ErrorModalState["message"],
    onCloseAction?: ErrorModalState["onCloseAction"],
    error?: ErrorModalState["error"],
    title?: ErrorModalState["title"],
): AnyShellAction => ({
    type: "ErrorModal/ShowModal",
    message,
    onCloseAction,
    error,
    title,
});
