import { PriceBreakValidation } from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/ValidatePriceBreaks";
import { QuoteLineModel } from "@insite/client-framework/Types/ApiModels";

export default interface RfqQuoteDetailsState {
    quoteId?: string;
    expirationDate?: Date;
    expirationDateError?: React.ReactNode;
    quoteLineForCalculation?: QuoteLineModel;
    priceBreakValidations: PriceBreakValidation[];
}
