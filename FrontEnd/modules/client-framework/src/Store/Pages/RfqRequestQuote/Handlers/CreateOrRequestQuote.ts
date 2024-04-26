import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
    HasOnError,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import { createQuote, CreateQuoteApiParameter } from "@insite/client-framework/Services/QuoteService";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { QuoteModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    HasOnSuccess<QuoteModel> & HasOnError<string>,
    CreateQuoteApiParameter,
    QuoteModel
>;

export const PopulateApiParameter: HandlerType = props => {
    const quoteParameter = props.getState().pages.rfqRequestQuote.quoteParameter;
    const { quoteId, jobName, quoteType, accountId, note } = quoteParameter;
    props.apiParameter = {
        quoteId,
        jobName,
        isJobQuote: quoteType === "job",
        userId: accountId,
        note,
    };
};

export const CreateOrRequestQuote: HandlerType = async props => {
    const { parameter, apiParameter } = props;
    const result = await createQuote(apiParameter);
    if (result.successful) {
        props.apiResult = result.result;
    } else {
        parameter.onError?.(result.errorMessage);
        return false;
    }
};

export const DispatchQuotesReset: HandlerType = props => {
    props.dispatch({
        type: "Data/Quotes/Reset",
    });
};

export const LoadCart: HandlerType = props => {
    // the cart lines will be gone so we must reload
    props.dispatch(loadCurrentCart());
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.(props.apiResult);
};

export const chain = [
    PopulateApiParameter,
    CreateOrRequestQuote,
    DispatchQuotesReset,
    LoadCart,
    ExecuteOnSuccessCallback,
];

const createOrRequestQuote = createHandlerChainRunnerOptionalParameter(chain, {}, "CreateOrRequestQuote");
export default createOrRequestQuote;
