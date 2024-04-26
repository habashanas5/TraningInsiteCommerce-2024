import { AccountPaymentProfileModel } from "@insite/client-framework/Types/ApiModels";

type SavedPaymentsState = {
    editingPaymentProfile?: AccountPaymentProfileModel;
    editModalIsOpen: boolean;
};

export default SavedPaymentsState;
