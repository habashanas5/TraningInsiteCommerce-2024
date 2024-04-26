import {
    createHandlerChainRunner,
    HandlerWithResult,
    HasOnError,
    HasOnSuccess,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { updateQuote as updateQuoteApi, UpdateQuoteApiParameter } from "@insite/client-framework/Services/QuoteService";
import { QuoteModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = HandlerWithResult<
    {
        apiParameter: UpdateQuoteApiParameter;
    } & HasOnSuccess &
        HasOnError<string>,
    {
        quote?: QuoteModel;
        errorMessage?: string;
    }
>;

export const SendDataToApi: HandlerType = async props => {
    const result = await updateQuoteApi(props.parameter.apiParameter);
    if (result.successful) {
        props.result = { quote: result.result };
    } else {
        props.parameter.onError?.(result.errorMessage);
        return false;
    }
};

export const ResetQuotesData: HandlerType = props => {
    props.dispatch({
        type: "Data/Quotes/Reset",
    });
};

export const DispatchCompleteLoadQuote: HandlerType = props => {
    if (props.result.quote) {
        props.dispatch({
            type: "Data/Quotes/CompleteLoadQuote",
            quote: props.result.quote,
        });
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.();
};

export const chain = [SendDataToApi, ResetQuotesData, DispatchCompleteLoadQuote, ExecuteOnSuccessCallback];

const updateQuote = createHandlerChainRunner(chain, "UpdateQuote");
export default updateQuote;
