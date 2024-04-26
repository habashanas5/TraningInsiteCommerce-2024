import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnError,
    HasOnSuccess,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { updateJobQuote, UpdateJobQuoteApiParameter } from "@insite/client-framework/Services/JobQuoteService";
import { getQtyOrderedByJobQuoteLineId } from "@insite/client-framework/Store/Data/JobQuotes/JobQuotesSelector";
import { JobQuoteLineModel, JobQuoteModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    {
        jobQuote: JobQuoteModel;
    } & HasOnSuccess<JobQuoteModel> &
        HasOnError<string>,
    UpdateJobQuoteApiParameter,
    JobQuoteModel
>;

export const PopulateApiParameter: HandlerType = props => {
    if (!props.parameter.jobQuote.jobQuoteLineCollection) {
        return false;
    }

    const qtyOrderedByJobQuoteLineId = getQtyOrderedByJobQuoteLineId(props.getState());
    props.apiParameter = {
        jobQuoteId: props.parameter.jobQuote.id,
        jobQuoteLineCollection: props.parameter.jobQuote.jobQuoteLineCollection
            .map(
                line =>
                    ({
                        id: line.id,
                        qtyOrdered: qtyOrderedByJobQuoteLineId[line.id] || 0,
                    } as JobQuoteLineModel),
            )
            .filter(o => o.qtyOrdered! > 0),
    };
};

export const SendDataToApi: HandlerType = async props => {
    const result = await updateJobQuote(props.apiParameter);
    if (result.successful) {
        props.apiResult = result.result;
    } else {
        props.parameter.onError?.(result.errorMessage);
        return false;
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.(props.apiResult);
};

export const chain = [PopulateApiParameter, SendDataToApi, ExecuteOnSuccessCallback];

const generateOrder = createHandlerChainRunner(chain, "GenerateOrder");
export default generateOrder;
