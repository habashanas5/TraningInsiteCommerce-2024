import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getAccountState } from "@insite/client-framework/Store/Data/Accounts/AccountsSelector";

export function hasChanges(state: ApplicationState) {
    const {
        userSetup: { userId, editingUser },
    } = state.pages;
    const user = getAccountState(state, userId).value;
    if (!user || !editingUser) {
        return false;
    }

    return (
        user.email !== editingUser.email ||
        user.firstName !== editingUser.firstName ||
        user.lastName !== editingUser.lastName ||
        user.role !== editingUser.role ||
        user.approver !== editingUser.approver ||
        user.isApproved !== editingUser.isApproved
    );
}

export const getCurrentEditingUser = (state: ApplicationState) => state.pages.userSetup.editingUser;
