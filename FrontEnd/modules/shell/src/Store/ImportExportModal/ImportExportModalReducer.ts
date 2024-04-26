import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { ImportExportModalState } from "@insite/shell/Store/ImportExportModal/ImportExportModalState";
import { Draft } from "immer";

const initialState: ImportExportModalState = {
    task: "Import",
    onlyExportPublishedContent: false,
};

const reducer = {
    "ImportExportModal/SetShowModal": (draft: Draft<ImportExportModalState>, action: { showModal: boolean }) => {
        return {
            ...initialState,
            showModal: action.showModal,
        };
    },
    "RestoreContentModal/SetShowModal": (
        draft: Draft<ImportExportModalState>,
        action: { showRestoreModal: boolean },
    ) => {
        delete draft.errorMessage;
        delete draft.taskInProgress;
        draft.showRestoreModal = action.showRestoreModal;
    },
    "RestoreContentModal/BeginTask": (draft: Draft<ImportExportModalState>) => {
        draft.taskInProgress = true;
    },
    "ImportExportModal/SetTask": (
        draft: Draft<ImportExportModalState>,
        action: Pick<ImportExportModalState, "task">,
    ) => {
        draft.task = action.task;
    },
    "ImportExportModal/SetOnlyExportPublishedContent": (
        draft: Draft<ImportExportModalState>,
        action: { value: boolean },
    ) => {
        draft.onlyExportPublishedContent = action.value;
    },
    "ImportExportModal/BeginTask": (draft: Draft<ImportExportModalState>) => {
        draft.taskInProgress = true;
        draft.confirmingImport = undefined;
    },
    "ImportExportModal/ConfirmImport": (draft: Draft<ImportExportModalState>) => {
        draft.confirmingImport = true;
    },
    "ImportExportModal/SetErrorMessage": (draft: Draft<ImportExportModalState>, action: { errorMessage: string }) => {
        draft.errorMessage = action.errorMessage;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
