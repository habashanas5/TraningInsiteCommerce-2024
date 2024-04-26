import {
    createHandlerChainRunner,
    HandlerWithResult,
    makeHandlerChainAwaitable,
} from "@insite/client-framework/HandlerCreator";
import validatePriceBreaks from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/ValidatePriceBreaks";
import { getPriceBreaksForCurrentQuoteLine } from "@insite/client-framework/Store/Pages/RfqQuoteDetails/RfqQuoteDetailsSelectors";
import { BreakPriceRfqModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = HandlerWithResult<{ index: number; startQty: number }, { updatedPriceBreaks: BreakPriceRfqModel[] }>;

export const UpdateStartQty: HandlerType = props => {
    const priceBreaks = getPriceBreaksForCurrentQuoteLine(props.getState());
    if (!priceBreaks) {
        return false;
    }

    const { index, startQty } = props.parameter;
    const updatedPriceBreaks = priceBreaks.slice();

    if (index > 0 && startQty > 0) {
        updatedPriceBreaks[index - 1] = {
            ...updatedPriceBreaks[index - 1],
            endQty: startQty - 1,
        };
    }

    updatedPriceBreaks[index] = {
        ...updatedPriceBreaks[index],
        startQty,
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

export const chain = [UpdateStartQty, DispatchUpdatePriceBreaks, ValidatePriceBreaks];

const updateStartQty = createHandlerChainRunner(chain, "UpdateStartQty");
export default updateStartQty;
