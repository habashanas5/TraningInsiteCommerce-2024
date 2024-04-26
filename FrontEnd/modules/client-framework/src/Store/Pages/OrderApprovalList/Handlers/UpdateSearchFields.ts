import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { GetOrderApprovalsApiParameter } from "@insite/client-framework/Services/OrderApprovalService";
import { UpdateSearchFieldsType } from "@insite/client-framework/Types/UpdateSearchFieldsType";

type HandlerType = Handler<GetOrderApprovalsApiParameter & UpdateSearchFieldsType>;

export const DispatchUpdateLoadParameter: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderApprovalList/UpdateSearchFields",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateLoadParameter];

const updateSearchFields = createHandlerChainRunner(chain, "UpdateSearchFields");
export default updateSearchFields;
