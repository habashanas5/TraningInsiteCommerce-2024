import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { GetCartsApiParameter } from "@insite/client-framework/Services/CartService";
import { UpdateSearchFieldsType } from "@insite/client-framework/Types/UpdateSearchFieldsType";

type HandlerType = Handler<GetCartsApiParameter & UpdateSearchFieldsType>;

export const DispatchUpdateLoadParameter: HandlerType = props => {
    props.dispatch({
        type: "Pages/SavedOrderList/UpdateSearchFields",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateLoadParameter];

const updateSearchFields = createHandlerChainRunner(chain, "UpdateSearchFields");
export default updateSearchFields;
