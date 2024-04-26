import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";
import { GetJobQuotesApiParameter } from "@insite/client-framework/Services/JobQuoteService";
import { UpdateSearchFieldsType } from "@insite/client-framework/Types/UpdateSearchFieldsType";

type HandlerType = Handler<GetJobQuotesApiParameter & UpdateSearchFieldsType>;

export const DispatchUpdateSearchFields: HandlerType = props => {
    props.dispatch({
        type: "Pages/RfqJobQuotes/UpdateSearchFields",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateSearchFields];

const updateSearchFields = createHandlerChainRunnerOptionalParameter(chain, {}, "UpdateSearchFields");
export default updateSearchFields;
