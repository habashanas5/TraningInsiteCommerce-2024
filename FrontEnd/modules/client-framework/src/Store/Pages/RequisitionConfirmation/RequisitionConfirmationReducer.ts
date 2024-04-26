import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import RequisitionConfirmationState from "@insite/client-framework/Store/Pages/RequisitionConfirmation/RequisitionConfirmationState";
import { Draft } from "immer";

const initialState: RequisitionConfirmationState = {};

const reducer = {
    "Pages/RequisitionConfirmation/SetCartId": (
        draft: Draft<RequisitionConfirmationState>,
        action: { cartId: string },
    ) => {
        draft.cartId = action.cartId;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
