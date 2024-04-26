import {
    createHandlerChainRunner,
    HandlerWithResult,
    HasOnSuccess,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { updateQuoteLine as updateQuoteLineApi } from "@insite/client-framework/Services/QuoteService";
import loadQuoteIfNeeded from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/LoadQuoteIfNeeded";
import { QuoteLineModel } from "@insite/client-framework/Types/ApiModels";

interface UpdateQuoteLineResult {
    quoteLine?: QuoteLineModel;
    errorMessage?: string;
}

type HandlerType = HandlerWithResult<
    {
        quoteId: string;
        quoteLineId: string;
        quoteLine: QuoteLineModel;
    } & HasOnSuccess,
    UpdateQuoteLineResult
>;

export const RequestUpdateQuoteLine: HandlerType = async props => {
    await updateQuoteLineApi({
        quoteId: props.parameter.quoteId,
        quoteLineId: props.parameter.quoteLineId,
        quoteLine: props.parameter.quoteLine,
    });
};

export const ResetQuotesData: HandlerType = props => {
    props.dispatch({
        type: "Data/Quotes/Reset",
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.();
};

export const chain = [RequestUpdateQuoteLine, ResetQuotesData, ExecuteOnSuccessCallback];

const updateQuoteLine = createHandlerChainRunner(chain, "UpdateQuoteLine");
export default updateQuoteLine;
