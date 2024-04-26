import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetQuotesApiParameter } from "@insite/client-framework/Services/QuoteService";
import { setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { QuotesDataView, QuotesState } from "@insite/client-framework/Store/Data/Quotes/QuotesState";
import { QuoteCollectionModel, QuoteModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: QuotesState = {
    isLoading: {},
    byId: {},
    dataViews: {},
    errorStatusCodeById: {},
};

const reducer = {
    "Data/Quotes/BeginLoadQuotes": (draft: Draft<QuotesState>, action: { parameter: GetQuotesApiParameter }) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/Quotes/CompleteLoadQuotes": (
        draft: Draft<QuotesState>,
        action: { parameter: GetQuotesApiParameter; collection: QuoteCollectionModel },
    ) => {
        setDataViewLoaded(
            draft,
            action.parameter,
            action.collection,
            collection => collection.quotes!,
            undefined,
            (dataView: Draft<QuotesDataView>) => {
                dataView.salespersonList = action.collection.salespersonList;
            },
        );
    },
    "Data/Quotes/BeginLoadQuote": (draft: Draft<QuotesState>, action: { quoteId: string }) => {
        draft.isLoading[action.quoteId] = true;
    },
    "Data/Quotes/CompleteLoadQuote": (draft: Draft<QuotesState>, action: { quote: QuoteModel }) => {
        delete draft.isLoading[action.quote.id];
        draft.byId[action.quote.id] = action.quote;
        if (draft.errorStatusCodeById) {
            delete draft.errorStatusCodeById[action.quote.id];
        }
    },
    "Data/Quotes/FailedToLoadQuote": (draft: Draft<QuotesState>, action: { quoteId: string; status: number }) => {
        delete draft.isLoading[action.quoteId];
        if (draft.errorStatusCodeById) {
            draft.errorStatusCodeById[action.quoteId] = action.status;
        }
    },
    "Data/Quotes/Reset": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
