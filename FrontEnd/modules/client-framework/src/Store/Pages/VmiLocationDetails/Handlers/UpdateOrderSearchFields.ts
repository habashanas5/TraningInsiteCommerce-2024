import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { GetCartsApiParameter } from "@insite/client-framework/Services/CartService";

type HandlerType = Handler<GetCartsApiParameter>;

export const DispatchUpdateSearchFields: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiLocationDetails/UpdateOrderSearchFields",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateSearchFields];

const updateOrderSearchFields = createHandlerChainRunner(chain, "UpdateOrderSearchFields");
export default updateOrderSearchFields;
