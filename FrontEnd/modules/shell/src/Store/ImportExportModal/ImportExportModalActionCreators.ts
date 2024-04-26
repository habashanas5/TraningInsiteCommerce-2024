import { getAccessTokenFromLocalStorage } from "@insite/shell/Services/AccessTokenService";
import { exportContent as apiExportContent } from "@insite/shell/Services/ContentAdminService";
import {
    importContent as apiImportContent,
    restoreContent as apiRestoreContent,
} from "@insite/shell/Services/WebsitesService";
import { ImportExportModalState } from "@insite/shell/Store/ImportExportModal/ImportExportModalState";
import { AnyShellAction } from "@insite/shell/Store/Reducers";
import ShellThunkAction from "@insite/shell/Store/ShellThunkAction";

export const showImportExportModal = (): AnyShellAction => ({
    type: "ImportExportModal/SetShowModal",
    showModal: true,
});

export const closeImportExportModal = (): AnyShellAction => ({
    type: "ImportExportModal/SetShowModal",
    showModal: false,
});

export const showRestoreContentModal = (): AnyShellAction => ({
    type: "RestoreContentModal/SetShowModal",
    showRestoreModal: true,
});

export const closeRestoreContentModal = (): AnyShellAction => ({
    type: "RestoreContentModal/SetShowModal",
    showRestoreModal: false,
});

export const setTask = (task: ImportExportModalState["task"]): AnyShellAction => ({
    type: "ImportExportModal/SetTask",
    task,
});

export const setOnlyExportPublishedContent = (value: boolean): AnyShellAction => ({
    type: "ImportExportModal/SetOnlyExportPublishedContent",
    value,
});

export const exportContent = (): ShellThunkAction => async (dispatch, getState) => {
    dispatch({
        type: "ImportExportModal/BeginTask",
    });

    const onlyPublished = getState().importExportModal.onlyExportPublishedContent;

    const filePath = await apiExportContent(onlyPublished);

    window.open(`/admin/export/getFile?file=${filePath}&access_token=${getAccessTokenFromLocalStorage()}`);

    dispatch({
        type: "ImportExportModal/SetShowModal",
        showModal: false,
    });
};

export const importContent =
    (file: File): ShellThunkAction =>
    async (dispatch, getState) => {
        dispatch({
            type: "ImportExportModal/BeginTask",
        });

        const { success, errorMessage } = await apiImportContent(file);

        if (success) {
            window.location.href = "/ContentAdmin/Page";
        } else {
            dispatch({
                type: "ImportExportModal/SetErrorMessage",
                errorMessage,
            });
        }
    };

export const confirmImport = (): AnyShellAction => ({
    type: "ImportExportModal/ConfirmImport",
});

export const restoreContent = (): ShellThunkAction => async dispatch => {
    dispatch({
        type: "RestoreContentModal/BeginTask",
    });

    const { success, errorMessage } = await apiRestoreContent();

    if (success) {
        window.location.href = "/ContentAdmin/Page";
    } else {
        dispatch({
            type: "ImportExportModal/SetErrorMessage",
            errorMessage,
        });
    }
};
