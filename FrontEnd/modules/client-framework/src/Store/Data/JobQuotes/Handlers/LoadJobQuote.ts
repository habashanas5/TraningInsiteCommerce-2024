import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getJobQuote, GetJobQuoteApiParameter } from "@insite/client-framework/Services/JobQuoteService";
import { JobQuoteModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetJobQuoteApiParameter, JobQuoteModel>;

export const DispatchBeginLoadJobQuote: HandlerType = props => {
    props.dispatch({
        type: "Data/JobQuotes/BeginLoadJobQuote",
        jobQuoteId: props.parameter.jobQuoteId,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getJobQuote(props.apiParameter);
};

export const DispatchCompleteLoadJobQuote: HandlerType = props => {
    props.dispatch({
        type: "Data/JobQuotes/CompleteLoadJobQuote",
        jobQuote: props.apiResult,
    });
};

export const chain = [
    DispatchBeginLoadJobQuote,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadJobQuote,
];

const loadJobQuote = createHandlerChainRunner(chain, "LoadJobQuote");
export default loadJobQuote;
