import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentAccountState } from "@insite/client-framework/Store/Data/Accounts/AccountsSelector";

export function hasChanges(state: ApplicationState) {
    const {
        accountSettings: {
            editingAccount,
            initialUseDefaultCustomer,
            useDefaultCustomer,
            initialShipToId,
            selectedShipToId,
        },
    } = state.pages;
    const account = getCurrentAccountState(state).value;
    if (!account || !editingAccount) {
        return false;
    }

    return (
        account.email !== editingAccount.email ||
        account.setDefaultCustomer !== editingAccount.setDefaultCustomer ||
        account.isSubscribed !== editingAccount.isSubscribed ||
        account.defaultFulfillmentMethod !== editingAccount.defaultFulfillmentMethod ||
        account.defaultWarehouseId !== editingAccount.defaultWarehouseId ||
        useDefaultCustomer !== initialUseDefaultCustomer ||
        initialShipToId !== selectedShipToId
    );
}
