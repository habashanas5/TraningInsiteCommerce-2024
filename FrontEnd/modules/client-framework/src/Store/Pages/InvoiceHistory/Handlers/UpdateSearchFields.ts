import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { GetInvoicesApiParameter } from "@insite/client-framework/Services/InvoiceService";
import { UpdateSearchFieldsType } from "@insite/client-framework/Types/UpdateSearchFieldsType";

type HandlerType = Handler<GetInvoicesApiParameter & UpdateSearchFieldsType>;

export const DispatchUpdateLoadParameter: HandlerType = props => {
    props.dispatch({
        type: "Pages/InvoiceHistory/UpdateSearchFields",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateLoadParameter];

const updateSearchFields = createHandlerChainRunner(chain, "UpdateSearchFields");
export default updateSearchFields;
