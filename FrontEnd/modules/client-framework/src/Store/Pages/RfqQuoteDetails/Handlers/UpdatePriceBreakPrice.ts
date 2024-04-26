import {
    createHandlerChainRunner,
    HandlerWithResult,
    makeHandlerChainAwaitable,
} from "@insite/client-framework/HandlerCreator";
import validatePriceBreaks from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/ValidatePriceBreaks";
import { getPriceBreaksForCurrentQuoteLine } from "@insite/client-framework/Store/Pages/RfqQuoteDetails/RfqQuoteDetailsSelectors";
import { BreakPriceRfqModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = HandlerWithResult<{ index: number; price: number }, { updatedPriceBreaks: BreakPriceRfqModel[] }>;

export const UpdatePrice: HandlerType = props => {
    const priceBreaks = getPriceBreaksForCurrentQuoteLine(props.getState());
    if (!priceBreaks) {
        return false;
    }

    const { index, price } = props.parameter;
    const updatedPriceBreaks = priceBreaks.slice();

    updatedPriceBreaks[index] = {
        ...updatedPriceBreaks[index],
        price,
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

export const chain = [UpdatePrice, DispatchUpdatePriceBreaks, ValidatePriceBreaks];

const updatePrice = createHandlerChainRunner(chain, "UpdatePrice");
export default updatePrice;
