import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";
import { GetOrdersApiParameter } from "@insite/client-framework/Services/OrderService";
import { UpdateSearchFieldsType } from "@insite/client-framework/Types/UpdateSearchFieldsType";

type HandlerType = Handler<GetOrdersApiParameter & UpdateSearchFieldsType>;

export const DispatchUpdateSearchFields: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderHistory/UpdateSearchFields",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateSearchFields];

const updateSearchFields = createHandlerChainRunnerOptionalParameter(chain, {}, "UpdateSearchFields");
export default updateSearchFields;
