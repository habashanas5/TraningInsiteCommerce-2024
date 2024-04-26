import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
} from "@insite/client-framework/HandlerCreator";
import { updateOrder, UpdateOrderApiParameter } from "@insite/client-framework/Services/OrderService";
import loadOrderByOrderNumber from "@insite/client-framework/Store/Data/Orders/Handlers/LoadOrderByOrderNumber";
import { getOrderState } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import { OrderModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<{}, UpdateOrderApiParameter, OrderModel>;

const CANCEL_STATUS = "CancellationRequested";

export const DispatchBeginCancelOrder: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderDetails/BeginCancelOrder",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    const state = props.getState();
    const order = getOrderState(state, state.pages.orderDetails.orderNumber);
    if (!order.value) {
        throw new Error("CancelOrder was called but there was no order");
    }

    props.apiParameter = {
        order: {
            ...order.value,
            status: CANCEL_STATUS,
        },
    };
};

export const SendDataToApi: HandlerType = async props => {
    props.apiResult = await updateOrder(props.apiParameter);
};

export const DispatchCompleteCancelOrder: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderDetails/CompleteCancelOrder",
    });
    props.dispatch(
        loadOrderByOrderNumber({ orderNumber: props.apiResult.webOrderNumber || props.apiResult.erpOrderNumber }),
    );
};

export const chain = [DispatchBeginCancelOrder, PopulateApiParameter, SendDataToApi, DispatchCompleteCancelOrder];

const cancelOrder = createHandlerChainRunnerOptionalParameter(chain, {}, "CancelOrder");
export default cancelOrder;
