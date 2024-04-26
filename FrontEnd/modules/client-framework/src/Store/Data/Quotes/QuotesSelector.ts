import { GetQuotesApiParameter } from "@insite/client-framework/Services/QuoteService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getById, getDataView } from "@insite/client-framework/Store/Data/DataState";
import { QuotesDataView } from "@insite/client-framework/Store/Data/Quotes/QuotesState";
import { QuoteModel } from "@insite/client-framework/Types/ApiModels";

export function getQuotesDataView(state: ApplicationState, getQuotesApiParameter: GetQuotesApiParameter) {
    return getDataView<QuoteModel, QuotesDataView>(state.data.quotes, getQuotesApiParameter);
}

export function getQuoteState(state: ApplicationState, quoteId: string | undefined) {
    return getById(state.data.quotes, quoteId);
}
