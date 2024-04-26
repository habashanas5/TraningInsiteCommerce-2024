import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getOrderStatusMappingDataView } from "@insite/client-framework/Store/Data/OrderStatusMappings/OrderStatusMappingsSelectors";
import { OrderModel } from "@insite/client-framework/Types/ApiModels";

export const canCancelOrder = (state: ApplicationState, order?: OrderModel) => {
    const orderStatusMappings = getOrderStatusMappingDataView(state).value;
    if (!orderStatusMappings) {
        return false;
    }

    return (
        order !== undefined &&
        orderStatusMappings.some(status => status.erpOrderStatus === order.status && status.allowCancellation)
    );
};

export const canRmaOrder = (state: ApplicationState, order?: OrderModel) => {
    const orderStatusMappings = getOrderStatusMappingDataView(state).value;
    if (!orderStatusMappings) {
        return false;
    }
    return (
        order !== undefined &&
        orderStatusMappings.some(status => status.erpOrderStatus === order.status && status.allowRma)
    );
};
