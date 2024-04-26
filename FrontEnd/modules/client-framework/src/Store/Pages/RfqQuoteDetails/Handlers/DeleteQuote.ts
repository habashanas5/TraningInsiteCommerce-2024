import {
    createHandlerChainRunner,
    Handler,
    HasOnError,
    HasOnSuccess,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { deleteQuote as deleteQuoteApi } from "@insite/client-framework/Services/QuoteService";

type HandlerType = Handler<
    {
        quoteId: string;
    } & HasOnSuccess &
        HasOnError<string>
>;

export const SendDataToApi: HandlerType = async props => {
    const result = await deleteQuoteApi({ quoteId: props.parameter.quoteId });
    if (!result.successful) {
        props.parameter.onError?.(result.errorMessage);
        return false;
    }
};

export const DispatchQuotesReset: HandlerType = props => {
    props.dispatch({
        type: "Data/Quotes/Reset",
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.();
};

export const chain = [SendDataToApi, ExecuteOnSuccessCallback, DispatchQuotesReset];

const deleteQuote = createHandlerChainRunner(chain, "DeleteQuote");
export default deleteQuote;
