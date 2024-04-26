import isApiError from "@insite/client-framework/Common/isApiError";
import { ApiParameter, get, HasPagingParameters, ServiceResult } from "@insite/client-framework/Services/ApiService";
import { CartModel, OrderApprovalCollectionModel } from "@insite/client-framework/Types/ApiModels";

export interface GetOrderApprovalsApiParameter extends ApiParameter, HasPagingParameters {
    shipToId?: string;
    orderNumber?: string;
    fromDate?: string;
    toDate?: string;
    orderTotalOperator?: string;
    orderTotal?: string;
}

export interface GetOrderApprovalApiParameter extends ApiParameter {
    cartId: string;
}

const orderApprovalsUrl = "/api/v1/orderapprovals";

export async function getOrderApprovals(
    parameter: GetOrderApprovalsApiParameter,
): Promise<ServiceResult<OrderApprovalCollectionModel>> {
    try {
        const orderApprovals = await get<OrderApprovalCollectionModel>(orderApprovalsUrl, parameter);
        return {
            successful: true,
            result: orderApprovals,
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

export async function getOrderApproval(parameter: GetOrderApprovalApiParameter): Promise<ServiceResult<CartModel>> {
    try {
        const cart = await get<CartModel>(`${orderApprovalsUrl}/${parameter.cartId}`);

        return {
            successful: true,
            result: cleanOrderApproval(cart),
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

function cleanOrderApproval(cartModel: CartModel) {
    cartModel.orderDate = cartModel.orderDate! && new Date(cartModel.orderDate!);
    cartModel.requestedPickupDateDisplay =
        cartModel.requestedPickupDateDisplay && new Date(cartModel.requestedPickupDateDisplay);
    cartModel.requestedDeliveryDateDisplay =
        cartModel.requestedDeliveryDateDisplay && new Date(cartModel.requestedDeliveryDateDisplay);

    return cartModel;
}
