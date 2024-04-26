export default interface ErrorModalState {
    isOpen?: true;
    /** Optional; a user-friendly error message to show the user. */
    message?: string;
    /** Optional, the raw error object; development users will see a JSON-formatted version of this object. */
    error?: any;
    onCloseAction?: "RedirectToAdmin";
    title?: string;
}
