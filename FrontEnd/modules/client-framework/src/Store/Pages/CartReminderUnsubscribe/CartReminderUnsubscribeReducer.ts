import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import CartReminderUnsubscribeState from "@insite/client-framework/Store/Pages/CartReminderUnsubscribe/CartReminderUnsubscribeState";
import { Draft } from "immer";

const initialState: CartReminderUnsubscribeState = {};

const reducer = {
    "Pages/CartReminderUnsubscribe/CompleteUnsubscribeFromCartReminders": (
        draft: Draft<CartReminderUnsubscribeState>,
        action: { userEmail?: string; unsubscribeError?: string },
    ) => {
        draft.userEmail = action.userEmail;
        draft.unsubscribeError = action.unsubscribeError;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
