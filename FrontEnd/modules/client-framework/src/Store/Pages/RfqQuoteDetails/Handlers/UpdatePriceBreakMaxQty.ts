import {
    createHandlerChainRunner,
    HandlerWithResult,
    makeHandlerChainAwaitable,
} from "@insite/client-framework/HandlerCreator";
import validatePriceBreaks from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/ValidatePriceBreaks";
import { getPriceBreaksForCurrentQuoteLine } from "@insite/client-framework/Store/Pages/RfqQuoteDetails/RfqQuoteDetailsSelectors";
import { BreakPriceRfqModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = HandlerWithResult<{ index: number; maxQty: string }, { updatedPriceBreaks: BreakPriceRfqModel[] }>;

export const UpdateMaxQty: HandlerType = props => {
    const priceBreaks = getPriceBreaksForCurrentQuoteLine(props.getState());
    if (!priceBreaks) {
        return false;
    }

    const { index, maxQty } = props.parameter;
    const updatedPriceBreaks = priceBreaks.slice();

    let numValue = Math.round(Number(maxQty));
    if (Number.isNaN(numValue)) {
        numValue = 0;
    }

    updatedPriceBreaks[index] = {
        ...updatedPriceBreaks[index],
        endQty: numValue,
    };

    props.result = { updatedPriceBreaks };
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

export const chain = [UpdateMaxQty, DispatchUpdatePriceBreaks, ValidatePriceBreaks];

const updateMaxQty = createHandlerChainRunner(chain, "UpdateMaxQty");
export default updateMaxQty;
