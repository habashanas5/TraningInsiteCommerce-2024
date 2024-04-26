import {
    ApiParameter,
    get,
    HasPagingParameters,
    patch,
    post,
    requestVoid,
    ServiceResult,
} from "@insite/client-framework/Services/ApiService";
import { VmiLocationCollectionModel, VmiLocationModel } from "@insite/client-framework/Types/ApiModels";

const vmiLocationsUrl = "/api/v1/vmiLocations";

export interface GetVmiLocationsApiParameter extends ApiParameter, HasPagingParameters {
    userId?: string;
    billToId?: string;
    filter?: string;
    expand?: ("customerlabel" | "customer")[];
}

export interface GetVmiLocationApiParameter extends ApiParameter {
    id?: string;
    expand?: ("customerlabel" | "customer")[];
}

export interface AddVmiLocationApiParameter extends ApiParameter {
    vmiLocation: Partial<VmiLocationModel>;
}

export interface UpdateVmiLocationApiParameter extends ApiParameter {
    vmiLocation: Partial<VmiLocationModel>;
}

export interface DeleteVmiLocationsApiParameter extends ApiParameter {
    ids: string[];
}

export async function getVmiLocations(parameter: GetVmiLocationsApiParameter) {
    const vmiLocations = await get<VmiLocationCollectionModel>(`${vmiLocationsUrl}`, parameter, {}, "no-store");
    return vmiLocations;
}

export async function getVmiLocation(parameter: GetVmiLocationApiParameter) {
    const id = parameter.id;
    delete parameter.id;
    const vmiLocations = await get<VmiLocationModel>(`${vmiLocationsUrl}/${id}`, parameter);
    return vmiLocations;
}

export async function createVmiLocation(
    parameter: AddVmiLocationApiParameter,
): Promise<ServiceResult<VmiLocationModel>> {
    try {
        const vmiLocationModel = await post<VmiLocationModel>(
            `${vmiLocationsUrl}`,
            parameter.vmiLocation as VmiLocationModel,
        );
        return {
            result: vmiLocationModel,
            successful: true,
        };
    } catch (error) {
        if ("status" in error && error.status === 400 && error.errorJson && error.errorJson.message) {
            return {
                successful: false,
                errorMessage: error.errorJson.message,
            };
        }
        throw error;
    }
}

export async function updateVmiLocation(
    parameter: UpdateVmiLocationApiParameter,
): Promise<ServiceResult<VmiLocationModel>> {
    try {
        const vmiLocationModel = await patch<VmiLocationModel>(
            `${vmiLocationsUrl}/${parameter.vmiLocation.id}`,
            parameter.vmiLocation as VmiLocationModel,
        );
        return {
            result: vmiLocationModel,
            successful: true,
        };
    } catch (error) {
        if ("status" in error && error.status === 400 && error.errorJson && error.errorJson.message) {
            return {
                successful: false,
                errorMessage: error.errorJson.message,
            };
        }
        throw error;
    }
}

export function deleteVmiLocations(parameter: DeleteVmiLocationsApiParameter) {
    const query = parameter.ids.map(o => `ids=${o}`).join("&");
    return requestVoid(`${vmiLocationsUrl}/batch?${query}`, "DELETE", {
        "Content-Type": "application/json",
    });
}
