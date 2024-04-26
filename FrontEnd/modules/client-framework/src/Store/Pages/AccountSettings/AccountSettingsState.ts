import { AccountModel } from "@insite/client-framework/Types/ApiModels";

export default interface AccountSettingsState {
    editingAccount?: AccountModel;
    emailErrorMessage?: string;
    useDefaultCustomer: boolean;
    initialUseDefaultCustomer: boolean;
    showSelectDefaultCustomer: boolean;
    initialShipToId?: string;
    selectedShipToId?: string;
    selectedBillToId?: string;
}
