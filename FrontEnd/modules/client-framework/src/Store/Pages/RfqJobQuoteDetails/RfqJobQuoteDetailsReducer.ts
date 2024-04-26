import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import RfqJobQuoteDetailsState from "@insite/client-framework/Store/Pages/RfqJobQuoteDetails/RfqJobQuoteDetailsState";
import { Draft } from "immer";

const initialState: RfqJobQuoteDetailsState = {
    qtyOrderedByJobQuoteLineId: {},
};

const reducer = {
    "Pages/RfqJobQuoteDetails/SetJobQuoteId": (
        draft: Draft<RfqJobQuoteDetailsState>,
        action: { jobQuoteId: string },
    ) => {
        draft.jobQuoteId = action.jobQuoteId;
        draft.qtyOrderedByJobQuoteLineId = {};
    },
    "Pages/RfqJobQuoteDetails/SetQtyOrdered": (
        draft: Draft<RfqJobQuoteDetailsState>,
        action: { jobQuoteLineId: string; qtyOrdered: number },
    ) => {
        draft.qtyOrderedByJobQuoteLineId[action.jobQuoteLineId] = action.qtyOrdered;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
