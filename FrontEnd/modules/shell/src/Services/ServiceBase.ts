import { Dictionary } from "@insite/client-framework/Common/Types";
import { request, requestVoid } from "@insite/client-framework/Services/ApiService";
import { showErrorModal } from "@insite/shell/Store/ErrorModal/ErrorModalActionCreator";
import ErrorModalState from "@insite/shell/Store/ErrorModal/ErrorModalState";
import { AnyShellAction } from "@insite/shell/Store/Reducers";
import { stringify } from "qs";
import { Dispatch } from "redux";

export function get<T>(endpoint: string, parameter?: Dictionary<any>) {
    let queryString = stringify(parameter || {}, { encode: false });

    if (queryString !== "") {
        queryString = (endpoint.indexOf("?") < 0 ? "?" : "&") + queryString;
    }

    return requestJson<T>(endpoint + queryString, "GET");
}

export function post<T = void>(endpoint: string, model?: Parameters<typeof JSON["stringify"]>[0]) {
    return requestJson<T>(
        endpoint,
        "POST",
        { "Content-Type": "application/json" },
        model ? JSON.stringify(model) : undefined,
    );
}

export const postVoid = (endpoint: string, model?: any) =>
    requestVoid(endpoint, "POST", { "Content-Type": "application/json" }, model ? JSON.stringify(model) : undefined);

export function requestJson<T>(
    endpoint: string,
    method: string,
    headers: Dictionary<string> = {},
    body?: string | FormData,
) {
    return new Promise<T>(resolve => {
        request<T>(`${endpoint}`, method, headers, body).then(resolve).catch(displayErrorModal);
    });
}

let dispatch: Dispatch<AnyShellAction> | undefined;

export const setReduxDispatcher = (storeDispatch: typeof dispatch) => {
    if (IS_SERVER_SIDE) {
        throw new Error("setReduxDispatcher should never be called server side.");
    }
    dispatch = storeDispatch;
};

function displayErrorModal(error: any) {
    if (!dispatch) {
        return; // Can't do anything without a connection to Redux.
    }

    if (!error || Object.keys(error).length === 0) {
        // an empty error indicates a canceled request. There is nothing to display in that case
        return;
    }

    let message: string | undefined;
    let onCloseAction: ErrorModalState["onCloseAction"];
    if (typeof error.status === "number" && error.status === 403) {
        message =
            "You need additional permissions to access the CMS. Please contact your system administrator to change your permissions.";
        onCloseAction = "RedirectToAdmin";
    }

    dispatch(showErrorModal(message, error, onCloseAction));
}
