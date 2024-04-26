import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getQuotes, GetQuotesApiParameter } from "@insite/client-framework/Services/QuoteService";
import { QuoteCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetQuotesApiParameter, QuoteCollectionModel>;

export const DispatchBeginLoadQuotes: HandlerType = props => {
    props.dispatch({
        type: "Data/Quotes/BeginLoadQuotes",
        parameter: props.parameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getQuotes(props.apiParameter);
};

export const DispatchCompleteLoadQuotes: HandlerType = props => {
    props.dispatch({
        type: "Data/Quotes/CompleteLoadQuotes",
        collection: props.apiResult,
        parameter: props.parameter,
    });
};

export const chain = [DispatchBeginLoadQuotes, PopulateApiParameter, RequestDataFromApi, DispatchCompleteLoadQuotes];

const loadQuotes = createHandlerChainRunner(chain, "LoadQuotes");
export default loadQuotes;
