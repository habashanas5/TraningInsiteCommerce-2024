import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import RfqConfirmationState from "@insite/client-framework/Store/Pages/RfqConfirmation/RfqConfirmationState";
import { Draft } from "immer";

const initialState: RfqConfirmationState = {};

const reducer = {
    "Pages/RfqConfirmation/SetQuoteId": (draft: Draft<RfqConfirmationState>, action: { quoteId: string }) => {
        draft.quoteId = action.quoteId;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
