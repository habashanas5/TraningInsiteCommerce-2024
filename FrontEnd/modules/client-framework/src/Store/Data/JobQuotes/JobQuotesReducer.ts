import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetJobQuotesApiParameter } from "@insite/client-framework/Services/JobQuoteService";
import { assignById, setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { JobQuotesState } from "@insite/client-framework/Store/Data/JobQuotes/JobQuotesState";
import { JobQuoteCollectionModel, JobQuoteModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: JobQuotesState = {
    isLoading: {},
    byId: {},
    dataViews: {},
};

const reducer = {
    "Data/JobQuotes/BeginLoadJobQuotes": (
        draft: Draft<JobQuotesState>,
        action: { parameter: GetJobQuotesApiParameter },
    ) => {
        setDataViewLoading(draft, action.parameter);
    },
    "Data/JobQuotes/CompleteLoadJobQuotes": (
        draft: Draft<JobQuotesState>,
        action: { parameter: GetJobQuotesApiParameter; collection: JobQuoteCollectionModel },
    ) => {
        setDataViewLoaded(draft, action.parameter, action.collection, collection => collection.jobQuotes!);
    },
    "Data/JobQuotes/BeginLoadJobQuote": (draft: Draft<JobQuotesState>, action: { jobQuoteId: string }) => {
        draft.isLoading[action.jobQuoteId] = true;
    },
    "Data/JobQuotes/CompleteLoadJobQuote": (draft: Draft<JobQuotesState>, action: { jobQuote: JobQuoteModel }) => {
        delete draft.isLoading[action.jobQuote.id];
        assignById(draft, action.jobQuote);
    },
    "Data/JobQuotes/Reset": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
