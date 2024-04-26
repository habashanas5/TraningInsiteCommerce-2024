import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { BreakPriceRfqModel } from "@insite/client-framework/Types/ApiModels";

export const getPriceBreaksForCurrentQuoteLine = (state: ApplicationState): BreakPriceRfqModel[] | null | undefined => {
    return state.pages.rfqQuoteDetails.quoteLineForCalculation?.pricingRfq?.priceBreaks;
};
