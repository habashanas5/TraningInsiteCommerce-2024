import { GetOrdersApiParameter } from "@insite/client-framework/Services/OrderService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getById, getDataView } from "@insite/client-framework/Store/Data/DataState";
import { createContext } from "react";

export function getOrderState(state: ApplicationState, orderNumber: string | undefined) {
    return getById(state.data.orders, orderNumber, id => state.data.orders.idByOrderNumber[id]);
}

export function getOrdersDataView(state: ApplicationState, getOrdersParameter: GetOrdersApiParameter) {
    return getDataView(state.data.orders, getOrdersParameter);
}

export const OrdersDataViewContext = createContext<ReturnType<typeof getOrdersDataView>>({
    value: undefined,
    isLoading: false,
});

export const OrderStateContext = createContext<ReturnType<typeof getOrderState>>({
    value: undefined,
    isLoading: false,
    errorStatusCode: undefined,
    id: undefined,
});
