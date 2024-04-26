export interface ImportExportModalState {
    showModal?: boolean;
    task: "Import" | "Export";
    onlyExportPublishedContent: boolean;
    taskInProgress?: true;
    confirmingImport?: true;
    errorMessage?: string;
    showRestoreModal?: boolean;
}
