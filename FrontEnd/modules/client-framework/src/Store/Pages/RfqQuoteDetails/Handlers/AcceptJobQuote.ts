import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnError,
    HasOnSuccess,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { updateQuote as updateQuoteApi, UpdateQuoteApiParameter } from "@insite/client-framework/Services/QuoteService";
import { QuoteModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    {
        quote: QuoteModel;
    } & HasOnSuccess &
        HasOnError<string>,
    UpdateQuoteApiParameter,
    QuoteModel
>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        quoteId: props.parameter.quote.id,
        status: "JobAccepted",
        expirationDate: props.parameter.quote.expirationDate || undefined,
    };
};

export const SendDataToApi: HandlerType = async props => {
    const result = await updateQuoteApi(props.apiParameter);
    if (result.successful) {
        props.apiResult = result.result;
    } else {
        props.parameter.onError?.(result.errorMessage);
        return false;
    }
};

export const ResetQuotesData: HandlerType = props => {
    props.dispatch({
        type: "Data/Quotes/Reset",
    });
    props.dispatch({
        type: "Data/JobQuotes/Reset",
    });
};

export const DispatchCompleteLoadQuote: HandlerType = props => {
    props.dispatch({
        type: "Data/Quotes/CompleteLoadQuote",
        quote: props.apiResult,
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.();
};

export const chain = [
    PopulateApiParameter,
    SendDataToApi,
    ResetQuotesData,
    DispatchCompleteLoadQuote,
    ExecuteOnSuccessCallback,
];

const acceptJobQuote = createHandlerChainRunner(chain, "AcceptJobQuote");
export default acceptJobQuote;
