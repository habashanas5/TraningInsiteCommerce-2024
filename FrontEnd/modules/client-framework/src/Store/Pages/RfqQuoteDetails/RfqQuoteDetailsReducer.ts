import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import siteMessage from "@insite/client-framework/SiteMessage";
import { PriceBreakValidation } from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/ValidatePriceBreaks";
import RfqQuoteDetailsState from "@insite/client-framework/Store/Pages/RfqQuoteDetails/RfqQuoteDetailsState";
import { BreakPriceRfqModel, QuoteLineModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: RfqQuoteDetailsState = {
    priceBreakValidations: [],
};

const reducer = {
    "Pages/RfqQuoteDetails/SetQuoteId": (draft: Draft<RfqQuoteDetailsState>, action: { quoteId: string }) => {
        draft.quoteId = action.quoteId;
    },
    "Pages/RfqQuoteDetails/SetExpirationDate": (
        draft: Draft<RfqQuoteDetailsState>,
        action: { expirationDate?: Date; forceValidation?: boolean },
    ) => {
        if (draft.expirationDate === undefined && action.expirationDate === undefined && !action.forceValidation) {
            return;
        }

        draft.expirationDate = action.expirationDate;
        draft.expirationDateError = action.expirationDate ? "" : siteMessage("Rfq_NoExpirationDate");
    },
    "Pages/RfqQuoteDetails/SetQuoteLineForCalculation": (
        draft: Draft<RfqQuoteDetailsState>,
        action: { quoteLine?: QuoteLineModel },
    ) => {
        draft.quoteLineForCalculation = action.quoteLine;
        draft.priceBreakValidations = [];
    },
    "Pages/RfqQuoteDetails/UpdatePriceBreaks": (
        draft: Draft<RfqQuoteDetailsState>,
        action: { updatedPriceBreaks: BreakPriceRfqModel[] },
    ) => {
        draft.quoteLineForCalculation!.pricingRfq!.priceBreaks = action.updatedPriceBreaks;
    },
    "Pages/RfqQuoteDetails/CompleteValidatePriceBreaks": (
        draft: Draft<RfqQuoteDetailsState>,
        action: { validations: PriceBreakValidation[] },
    ) => {
        draft.priceBreakValidations = action.validations;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
