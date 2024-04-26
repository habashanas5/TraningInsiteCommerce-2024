import {
    createHandlerChainRunnerOptionalParameter,
    HandlerWithResult,
    makeHandlerChainAwaitable,
} from "@insite/client-framework/HandlerCreator";
import { getQuoteState } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import validatePriceBreaks from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/ValidatePriceBreaks";
import { BreakPriceRfqModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = HandlerWithResult<{}, { updatedPriceBreaks: BreakPriceRfqModel[] }>;

export const CopyInitialPriceBreaks: HandlerType = props => {
    const state = props.getState();
    const quoteLine = state.pages.rfqQuoteDetails.quoteLineForCalculation;
    if (!quoteLine) {
        return false;
    }

    const initialQuote = getQuoteState(state, state.pages.rfqQuoteDetails.quoteId).value;
    if (!initialQuote) {
        return false;
    }

    const priceBreaks =
        initialQuote.quoteLineCollection?.find(o => o.id === quoteLine.id)?.pricingRfq?.priceBreaks?.slice() || [];
    props.result = { updatedPriceBreaks: priceBreaks };
};

export const DispatchUpdatePriceBreaks: HandlerType = ({ dispatch, result: { updatedPriceBreaks } }) => {
    dispatch({
        type: "Pages/RfqQuoteDetails/UpdatePriceBreaks",
        updatedPriceBreaks,
    });
};

export const ValidatePriceBreaks: HandlerType = async ({ dispatch, getState }) => {
    const isValid = await makeHandlerChainAwaitable(validatePriceBreaks)({})(dispatch, getState);
    if (!isValid) {
        return false;
    }
};

export const chain = [CopyInitialPriceBreaks, DispatchUpdatePriceBreaks, ValidatePriceBreaks];

const resetPriceBreaks = createHandlerChainRunnerOptionalParameter(chain, {}, "ResetPriceBreaks");
export default resetPriceBreaks;
