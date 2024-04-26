import { GetAccountShipToCollectionApiParameter } from "@insite/client-framework/Services/AccountService";
import { AccountModel } from "@insite/client-framework/Types/ApiModels";

export default interface UserSetupState {
    userId?: string;
    editingUser?: AccountModel;
    initialUserEmail?: string;
    emailErrorMessage?: React.ReactNode;
    firstNameErrorMessage?: React.ReactNode;
    lastNameErrorMessage?: React.ReactNode;
    getAccountShipToCollectionParameter: GetAccountShipToCollectionApiParameter;
}
