import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { GetOrderApiParameter } from "@insite/client-framework/Services/OrderService";
import loadOrderByOrderNumber from "@insite/client-framework/Store/Data/Orders/Handlers/LoadOrderByOrderNumber";
import { getOrderState } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import { OrderModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<{ orderNumber: string }, GetOrderApiParameter, OrderModel>;

export const DispatchSetOrderNumber: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderDetails/SetOrderNumber",
        orderNumber: props.parameter.orderNumber,
    });
};

export const DispatchLoadOrderIfNeeded: HandlerType = props => {
    const orderState = getOrderState(props.getState(), props.parameter.orderNumber);
    if ((!orderState.value && !orderState.isLoading) || !orderState.value.orderLines) {
        props.dispatch(loadOrderByOrderNumber(props.parameter));
    }
};

export const chain = [DispatchSetOrderNumber, DispatchLoadOrderIfNeeded];

const displayOrder = createHandlerChainRunner(chain, "DisplayOrder");
export default displayOrder;
