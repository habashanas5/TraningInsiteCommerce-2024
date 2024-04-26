import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getJobQuotes, GetJobQuotesApiParameter } from "@insite/client-framework/Services/JobQuoteService";
import { JobQuoteCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetJobQuotesApiParameter, JobQuoteCollectionModel>;

export const DispatchBeginLoadJobQuotes: HandlerType = props => {
    props.dispatch({
        type: "Data/JobQuotes/BeginLoadJobQuotes",
        parameter: props.parameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getJobQuotes(props.apiParameter);
};

export const DispatchCompleteLoadJobQuotes: HandlerType = props => {
    props.dispatch({
        type: "Data/JobQuotes/CompleteLoadJobQuotes",
        collection: props.apiResult,
        parameter: props.parameter,
    });
};

export const chain = [
    DispatchBeginLoadJobQuotes,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadJobQuotes,
];

const loadJobQuotes = createHandlerChainRunner(chain, "LoadJobQuotes");
export default loadJobQuotes;
