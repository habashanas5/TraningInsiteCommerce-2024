import {
    createHandlerChainRunnerOptionalParameter,
    HandlerWithResult,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import { getQuoteState } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import { getPriceBreaksForCurrentQuoteLine } from "@insite/client-framework/Store/Pages/RfqQuoteDetails/RfqQuoteDetailsSelectors";
import { BreakPriceRfqModel, QuoteLineModel } from "@insite/client-framework/Types/ApiModels";

export interface PriceBreakValidation {
    index: number;
    priceRequired: boolean;
    invalidPrice: boolean;
    invalidQty: boolean;
}

type HandlerType = HandlerWithResult<
    HasOnSuccess<boolean>,
    {
        validations: PriceBreakValidation[];
    },
    {
        isJobQuote: boolean;
    }
>;

export const InitResult: HandlerType = props => {
    const quote = getQuoteState(props.getState(), props.getState().pages.rfqQuoteDetails.quoteId).value;
    if (!quote) {
        return false;
    }

    props.isJobQuote = quote.isJobQuote;
    props.result = { validations: [] };
};

export const ValidatePriceBreaks: HandlerType = props => {
    const priceBreaks = getPriceBreaksForCurrentQuoteLine(props.getState());
    if (!priceBreaks) {
        return false;
    }

    const quoteLine = props.getState().pages.rfqQuoteDetails.quoteLineForCalculation!;
    const maxQty = priceBreaks[priceBreaks.length - 1].endQty;
    for (let i = 0; i < priceBreaks.length; i++) {
        if (!shouldValidatePriceBreak(props.isJobQuote, quoteLine, priceBreaks[i])) {
            continue;
        }

        const validation: PriceBreakValidation = {
            index: i,
            priceRequired: false,
            invalidPrice: false,
            invalidQty: false,
        };
        validatePrice(validation, quoteLine, priceBreaks[i]);
        if (!props.isJobQuote) {
            validateStartQty(validation, priceBreaks, maxQty);
            validateEndQty(validation, priceBreaks, maxQty);
        }

        props.result.validations.push(validation);
    }
};

function shouldValidatePriceBreak(
    isJobQuote: boolean,
    quoteLine: QuoteLineModel,
    priceBreak: BreakPriceRfqModel,
): boolean {
    if (!isJobQuote) {
        return true;
    }

    return (
        quoteLine!
            .pricingRfq!.priceBreaks!.slice()
            .sort((a, b) => b.startQty - a.startQty)
            .filter(x => x.startQty <= quoteLine!.qtyOrdered!)[0].startQty === priceBreak.startQty
    );
}

function validatePrice(result: PriceBreakValidation, quoteLine: QuoteLineModel, priceBreak: BreakPriceRfqModel) {
    if (priceBreak.price === undefined || priceBreak.price.toString() === "" || Number.isNaN(priceBreak.price)) {
        result.priceRequired = true;
    }
    if (
        (quoteLine!.pricingRfq!.minimumPriceAllowed > 0 &&
            priceBreak.price < quoteLine!.pricingRfq!.minimumPriceAllowed) ||
        priceBreak.price < 0
    ) {
        result.invalidPrice = true;
    }
}

function validateStartQty(result: PriceBreakValidation, priceBreaks: BreakPriceRfqModel[], maxQty: number) {
    const { index } = result;
    if (index === 0) {
        if (priceBreaks[0].startQty !== 1) {
            result.invalidQty = true;
        }
    } else {
        if (
            priceBreaks[index].startQty <= priceBreaks[index - 1].startQty ||
            priceBreaks[index].startQty < priceBreaks[index - 1].endQty
        ) {
            result.invalidQty = true;
        }

        if (
            index === priceBreaks.length - 1 &&
            priceBreaks[priceBreaks.length - 1].startQty &&
            maxQty > 0 &&
            maxQty < priceBreaks[priceBreaks.length - 1].startQty
        ) {
            result.invalidQty = true;
        }
    }
}

function validateEndQty(result: PriceBreakValidation, priceBreaks: BreakPriceRfqModel[], maxQty: number) {
    const { index } = result;
    if (index === priceBreaks.length - 1 && maxQty > 0 && maxQty < priceBreaks[priceBreaks.length - 1].startQty) {
        result.invalidQty = true;
    }
}

export const DispatchCompleteValidatePriceBreaks: HandlerType = ({ dispatch, result: { validations } }) => {
    dispatch({
        type: "Pages/RfqQuoteDetails/CompleteValidatePriceBreaks",
        validations,
    });
};

export const ExecuteOnSuccessCallback: HandlerType = ({ parameter, result: { validations } }) => {
    parameter.onSuccess?.(validations.every(o => !o.priceRequired && !o.invalidPrice && !o.invalidQty));
};

export const chain = [InitResult, ValidatePriceBreaks, DispatchCompleteValidatePriceBreaks, ExecuteOnSuccessCallback];

const validatePriceBreaks = createHandlerChainRunnerOptionalParameter(chain, {}, "ValidatePriceBreaks");
export default validatePriceBreaks;
