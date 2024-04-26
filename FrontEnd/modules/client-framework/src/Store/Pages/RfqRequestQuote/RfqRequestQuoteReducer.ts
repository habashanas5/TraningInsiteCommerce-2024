import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import RfqRequestQuoteState, {
    QuoteParameter,
} from "@insite/client-framework/Store/Pages/RfqRequestQuote/RfqRequestQuoteState";
import { AccountModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: RfqRequestQuoteState = {
    accounts: [],
    quoteParameter: {
        quoteId: "",
        quoteType: "quote",
        accountId: undefined,
        jobName: "",
        note: "",
    },
};

const reducer = {
    "Pages/RfqRequestQuote/CompleteLoadAccounts": (
        draft: Draft<RfqRequestQuoteState>,
        action: { collection: AccountModel[] },
    ) => {
        draft.accounts = action.collection;
    },

    "Pages/RfqRequestQuote/UpdateQuoteParameter": (
        draft: Draft<RfqRequestQuoteState>,
        action: { parameter: QuoteParameter },
    ) => {
        draft.quoteParameter = action.parameter;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
