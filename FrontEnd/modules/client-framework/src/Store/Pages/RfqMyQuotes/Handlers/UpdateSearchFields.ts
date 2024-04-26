import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";
import { GetQuotesApiParameter } from "@insite/client-framework/Services/QuoteService";
import { UpdateSearchFieldsType } from "@insite/client-framework/Types/UpdateSearchFieldsType";

type HandlerType = Handler<GetQuotesApiParameter & UpdateSearchFieldsType>;

export const DispatchUpdateSearchFields: HandlerType = props => {
    props.dispatch({
        type: "Pages/RfqMyQuotes/UpdateSearchFields",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateSearchFields];

const updateSearchFields = createHandlerChainRunnerOptionalParameter(chain, {}, "UpdateSearchFields");
export default updateSearchFields;
