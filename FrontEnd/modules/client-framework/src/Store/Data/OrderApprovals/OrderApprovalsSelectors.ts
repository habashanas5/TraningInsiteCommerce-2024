import { GetOrderApprovalsApiParameter } from "@insite/client-framework/Services/OrderApprovalService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getById, getDataView } from "@insite/client-framework/Store/Data/DataState";
import { createContext } from "react";

export function getOrderApprovalsState(state: ApplicationState, cartId: string | undefined) {
    return getById(state.data.orderApprovals, cartId);
}

export function getOrderApprovalsDataView(
    state: ApplicationState,
    getOrderApprovalsApiParameter: GetOrderApprovalsApiParameter,
) {
    return getDataView(state.data.orderApprovals, getOrderApprovalsApiParameter);
}

export const OrderApprovalsDataViewContext = createContext<ReturnType<typeof getOrderApprovalsDataView>>({
    value: undefined,
    isLoading: false,
});

export const OrderApprovalsStateContext = createContext<ReturnType<typeof getOrderApprovalsState>>({
    value: undefined,
    isLoading: false,
    errorStatusCode: undefined,
    id: undefined,
});
