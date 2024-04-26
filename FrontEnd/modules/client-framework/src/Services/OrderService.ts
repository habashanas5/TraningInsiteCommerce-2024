import isApiError from "@insite/client-framework/Common/isApiError";
import {
    ApiParameter,
    doesNotHaveExpand,
    get,
    HasPagingParameters,
    patch,
    post,
    ServiceResult,
} from "@insite/client-framework/Services/ApiService";
import {
    OrderCollectionModel,
    OrderModel,
    OrderStatusMappingCollectionModel,
    RmaModel,
} from "@insite/client-framework/Types/ApiModels";

export interface GetOrdersApiParameter extends ApiParameter, HasPagingParameters {
    orderNumber?: string;
    poNumber?: string;
    search?: string;
    status?: string[];
    customerSequence?: string;
    fromDate?: string;
    toDate?: string;
    orderTotalOperator?: string;
    orderTotal?: number;
    productErpNumber?: string;
    sort?: string;
}

export interface GetOrderApiParameter extends ApiParameter {
    orderNumber: string;
    expand?: ("orderLines" | "shipments")[];
    additionalExpands?: string[];
    sTEmail?: string;
    sTPostalCode?: string;
}

export interface GetOrderStatusMappingsApiParameter extends ApiParameter {}

export interface UpdateOrderApiParameter extends ApiParameter {
    order: OrderModel;
}

export interface AddRmaApiParameter extends ApiParameter {
    rmaModel: RmaModel;
}

const ordersUrl = "/api/v1/orders";

export async function getOrders(parameter: GetOrdersApiParameter): Promise<OrderCollectionModel> {
    // can't send empty status array to API
    if (parameter.status && parameter.status.length === 0) {
        delete parameter.status;
    }

    const orders = await get<OrderCollectionModel>(ordersUrl, parameter);
    orders.orders?.forEach(o => {
        cleanOrder(o);
    });
    return orders;
}

export function getOrderStatusMappings(parameter: GetOrderStatusMappingsApiParameter) {
    return get<OrderStatusMappingCollectionModel>("/api/v1/orderstatusmappings", parameter);
}

export async function getOrder(parameter: GetOrderApiParameter): Promise<OrderModel> {
    const orderNumber = parameter.orderNumber;
    delete parameter.orderNumber;

    const order = await get<OrderModel>(`${ordersUrl}/${orderNumber}`, parameter);
    cleanOrder(order, parameter);
    return order;
}

export async function updateOrder(parameter: UpdateOrderApiParameter) {
    const order = parameter.order;
    const orderNumber = order.erpOrderNumber || order.webOrderNumber;
    const orderModel = await patch<OrderModel>(`${ordersUrl}/${orderNumber}`, order);
    cleanOrder(orderModel);
    return orderModel;
}

export async function addRma(parameter: AddRmaApiParameter): Promise<ServiceResult<RmaModel>> {
    try {
        const rmaModel = await post<RmaModel>(
            `${ordersUrl}/${parameter.rmaModel.orderNumber}/returns`,
            parameter.rmaModel,
        );
        return {
            successful: true,
            result: rmaModel,
        };
    } catch (error) {
        if (isApiError(error) && error.status === 400) {
            return {
                successful: false,
                errorMessage: error.errorJson.message,
            };
        }
        throw error;
    }
}

function cleanOrder(orderModel: OrderModel, parameter?: { expand?: string[]; additionalExpands?: string[] }) {
    orderModel.orderDate = new Date(orderModel.orderDate);
    orderModel.id = orderModel.erpOrderNumber || orderModel.webOrderNumber;
    if (doesNotHaveExpand(parameter, "orderLines")) {
        delete orderModel.orderLines;
    }
}
