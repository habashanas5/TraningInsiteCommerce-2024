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

export const CheckExpirationDate: HandlerType = props => {
    if (!props.parameter.quote.isSalesperson) {
        return;
    }

    if (props.getState().pages.rfqQuoteDetails.expirationDate) {
        return;
    }

    props.dispatch({
        type: "Pages/RfqQuoteDetails/SetExpirationDate",
        expirationDate: undefined,
        forceValidation: true,
    });

    return false;
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        quoteId: props.parameter.quote.id,
        status: "QuoteProposed",
        expirationDate: props.getState().pages.rfqQuoteDetails.expirationDate,
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
    CheckExpirationDate,
    PopulateApiParameter,
    SendDataToApi,
    ResetQuotesData,
    DispatchCompleteLoadQuote,
    ExecuteOnSuccessCallback,
];

const submitQuote = createHandlerChainRunner(chain, "SubmitQuote");
export default submitQuote;
