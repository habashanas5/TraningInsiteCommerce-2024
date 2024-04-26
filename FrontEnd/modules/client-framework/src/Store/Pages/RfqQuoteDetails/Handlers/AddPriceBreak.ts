import {
    createHandlerChainRunnerOptionalParameter,
    HandlerWithResult,
    makeHandlerChainAwaitable,
} from "@insite/client-framework/HandlerCreator";
import validatePriceBreaks from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/ValidatePriceBreaks";
import { getPriceBreaksForCurrentQuoteLine } from "@insite/client-framework/Store/Pages/RfqQuoteDetails/RfqQuoteDetailsSelectors";
import { BreakPriceRfqModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = HandlerWithResult<{}, { updatedPriceBreaks: BreakPriceRfqModel[] }>;

export const ValidatePriceBreaks: HandlerType = async ({ dispatch, getState }) => {
    const isValid = await makeHandlerChainAwaitable(validatePriceBreaks)({})(dispatch, getState);
    if (!isValid) {
        return false;
    }
};

export const CreatePriceBreak: HandlerType = props => {
    const priceBreaks = getPriceBreaksForCurrentQuoteLine(props.getState());
    if (!priceBreaks) {
        return false;
    }

    const quoteLine = props.getState().pages.rfqQuoteDetails.quoteLineForCalculation!;
    const updatedPriceBreaks = priceBreaks.slice();
    const newPriceBreak = { price: 0 } as BreakPriceRfqModel;
    if (updatedPriceBreaks.length !== 0) {
        const lastPriceBreak = { ...updatedPriceBreaks[updatedPriceBreaks.length - 1] };
        if (lastPriceBreak.endQty === 0) {
            lastPriceBreak.endQty = lastPriceBreak.startQty;
        } else {
            lastPriceBreak.endQty = Math.round(lastPriceBreak.endQty);
        }
        updatedPriceBreaks[updatedPriceBreaks.length - 1] = lastPriceBreak;

        newPriceBreak.startQty = lastPriceBreak.endQty + 1;
        newPriceBreak.endQty = quoteLine.maxQty;
    } else {
        newPriceBreak.startQty = 1;
        newPriceBreak.endQty = quoteLine.maxQty;
    }

    updatedPriceBreaks.push(newPriceBreak);
    props.result = { updatedPriceBreaks };
};

export const DispatchUpdatePriceBreaks: HandlerType = ({ dispatch, result: { updatedPriceBreaks } }) => {
    dispatch({
        type: "Pages/RfqQuoteDetails/UpdatePriceBreaks",
        updatedPriceBreaks,
    });
};

export const chain = [ValidatePriceBreaks, CreatePriceBreak, DispatchUpdatePriceBreaks];

const addPriceBreak = createHandlerChainRunnerOptionalParameter(chain, {}, "AddPriceBreak");
export default addPriceBreak;
