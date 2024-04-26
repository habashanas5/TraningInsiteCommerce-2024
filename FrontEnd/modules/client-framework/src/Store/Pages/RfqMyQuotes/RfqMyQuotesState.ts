import { GetQuotesApiParameter } from "@insite/client-framework/Services/QuoteService";

export default interface RfqMyQuotesState {
    getQuotesParameter: GetQuotesApiParameter;
    filtersOpen: boolean;
}
