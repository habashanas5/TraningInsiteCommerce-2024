import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import SavedPaymentsState from "@insite/client-framework/Store/Pages/SavedPayments/SavedPaymentsState";
import { AccountPaymentProfileModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: SavedPaymentsState = {
    editModalIsOpen: false,
};

const reducer = {
    "Pages/SavedPayments/UpdateEditModal": (
        draft: Draft<SavedPaymentsState>,
        action: { paymentProfile?: AccountPaymentProfileModel; modalIsOpen: boolean },
    ) => {
        draft.editModalIsOpen = action.modalIsOpen;
        draft.editingPaymentProfile = action.paymentProfile;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
