import {
    createHandlerChainRunner,
    HandlerWithResult,
    makeHandlerChainAwaitable,
} from "@insite/client-framework/HandlerCreator";
import validatePriceBreaks from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/ValidatePriceBreaks";
import { getPriceBreaksForCurrentQuoteLine } from "@insite/client-framework/Store/Pages/RfqQuoteDetails/RfqQuoteDetailsSelectors";
import { BreakPriceRfqModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = HandlerWithResult<{ index: number }, { updatedPriceBreaks: BreakPriceRfqModel[] }>;

export const RemovePriceBreak: HandlerType = props => {
    const priceBreaks = getPriceBreaksForCurrentQuoteLine(props.getState());
    if (!priceBreaks) {
        return false;
    }

    const updatedPriceBreaks = priceBreaks.slice();

    if (props.parameter.index === 0) {
        updatedPriceBreaks[props.parameter.index + 1] = {
            ...updatedPriceBreaks[props.parameter.index + 1],
            startQty: updatedPriceBreaks[props.parameter.index].startQty,
        };
    }

    if (props.parameter.index !== 0) {
        updatedPriceBreaks[props.parameter.index - 1] = {
            ...updatedPriceBreaks[props.parameter.index - 1],
            endQty: updatedPriceBreaks[props.parameter.index].endQty,
        };
    }

    updatedPriceBreaks.splice(props.parameter.index, 1);

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

export const chain = [RemovePriceBreak, DispatchUpdatePriceBreaks, ValidatePriceBreaks];

const removePriceBreak = createHandlerChainRunner(chain, "RemovePriceBreak");
export default removePriceBreak;
