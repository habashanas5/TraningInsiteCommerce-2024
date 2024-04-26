import isApiError from "@insite/client-framework/Common/isApiError";
import {
    ApiParameter,
    del,
    doesNotHaveExpand,
    get,
    HasPagingParameters,
    patch,
    ServiceResult,
} from "@insite/client-framework/Services/ApiService";
import {
    RequisitionCollectionModel,
    RequisitionLineModel,
    RequisitionModel,
} from "@insite/client-framework/Types/ApiModels";

const requisitionsUrl = "/api/v1/requisitions";

export interface GetRequisitionsApiParameter extends ApiParameter, HasPagingParameters {
    recalculatePrice?: boolean;
}

export interface GetRequisitionApiParameter extends ApiParameter {
    requisitionId: string;
    expand?: "requisitionLines"[];
}

export async function getRequisitions(parameter: GetRequisitionsApiParameter) {
    const requisitionCollection = await get<RequisitionCollectionModel>(requisitionsUrl, parameter);
    requisitionCollection.requisitions?.forEach(o => cleanRequisition(o));
    return requisitionCollection;
}

export async function getRequisition(parameter: GetRequisitionApiParameter) {
    const { requisitionId, ...newParameter } = parameter;
    const requisition = await get<RequisitionModel>(`${requisitionsUrl}/${requisitionId}`, newParameter);
    cleanRequisition(requisition, parameter.expand);
    return requisition;
}

export interface UpdateRequisitionApiParameter extends ApiParameter {
    requisitionId: string;
}

export async function updateRequisition(
    parameter: UpdateRequisitionApiParameter,
): Promise<ServiceResult<RequisitionModel>> {
    try {
        const requisition = await patch<RequisitionModel>(`${requisitionsUrl}/${parameter.requisitionId}`, parameter);
        return {
            successful: true,
            result: requisition,
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

export interface UpdateRequisitionLineApiParameter extends ApiParameter {
    requisitionId: string;
    requisitionLineId: string;
    requisitionLine: RequisitionLineModel;
}

export async function updateRequisitionLine(
    parameter: UpdateRequisitionLineApiParameter,
): Promise<ServiceResult<RequisitionLineModel>> {
    try {
        const requisitionLine = await patch<RequisitionLineModel>(
            `${requisitionsUrl}/${parameter.requisitionId}/requisitionlines/${parameter.requisitionLineId}`,
            parameter.requisitionLine,
        );
        return {
            successful: true,
            result: requisitionLine,
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

export interface DeleteRequisitionLineApiParameter extends ApiParameter {
    requisitionId: string;
    requisitionLineId: string;
}

export async function deleteRequisitionLine(
    parameter: DeleteRequisitionLineApiParameter,
): Promise<ServiceResult<void>> {
    try {
        const result = await del(
            `${requisitionsUrl}/${parameter.requisitionId}/requisitionlines/${parameter.requisitionLineId}`,
        );
        return {
            successful: true,
            result,
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

function cleanRequisition(requisition: RequisitionModel, expand?: string[]) {
    if (doesNotHaveExpand({ expand }, "requisitionLines")) {
        requisition.requisitionLineCollection = null;
    } else {
        requisition.requisitionLineCollection?.requisitionLines?.forEach(cleanRequisitionLine);
    }
}

function cleanRequisitionLine(requisitionLine: RequisitionLineModel) {
    requisitionLine.orderDate = new Date(requisitionLine.orderDate);
}
