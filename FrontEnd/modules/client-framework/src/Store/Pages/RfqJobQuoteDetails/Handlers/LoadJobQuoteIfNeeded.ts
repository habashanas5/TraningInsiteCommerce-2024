import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { GetJobQuoteApiParameter } from "@insite/client-framework/Services/JobQuoteService";
import loadJobQuote from "@insite/client-framework/Store/Data/JobQuotes/Handlers/LoadJobQuote";
import { getJobQuoteState } from "@insite/client-framework/Store/Data/JobQuotes/JobQuotesSelector";
import { JobQuoteModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetJobQuoteApiParameter, JobQuoteModel>;

export const DispatchSetJobQuoteId: HandlerType = props => {
    props.dispatch({
        type: "Pages/RfqJobQuoteDetails/SetJobQuoteId",
        jobQuoteId: props.parameter.jobQuoteId,
    });
};

export const DispatchLoadJobQuoteIfNeeded: HandlerType = props => {
    const {
        parameter: { jobQuoteId },
    } = props;
    const jobQuoteState = getJobQuoteState(props.getState(), jobQuoteId);
    if (!jobQuoteState.value || !jobQuoteState.value.jobQuoteLineCollection) {
        props.dispatch(loadJobQuote({ jobQuoteId }));
    }
};

export const chain = [DispatchSetJobQuoteId, DispatchLoadJobQuoteIfNeeded];

const loadJobQuoteIfNeeded = createHandlerChainRunner(chain, "LoadJobQuoteIfNeeded");
export default loadJobQuoteIfNeeded;
