import {
    ApiParameter,
    get,
    HasPagingParameters,
    post,
    requestVoid,
    ServiceResult,
} from "@insite/client-framework/Services/ApiService";
import { VmiBinCollectionModel, VmiBinModel } from "@insite/client-framework/Types/ApiModels";

const vmiLocationBinsUrl = "api/v1/vmiLocations/{vmiLocationId}/bins";

export interface AddVmiBinApiParameter extends ApiParameter {
    vmiLocationId: string;
    vmiBin: Partial<VmiBinModel>;
}

export interface GetVmiBinsApiParameter extends ApiParameter, HasPagingParameters {
    vmiLocationId?: string;
    filter?: string;
    expand?: "product"[];
}

export interface DeleteVmiBinsApiParameter extends ApiParameter {
    vmiLocationId: string;
    ids: string[];
}

export async function createVmiBin(parameter: AddVmiBinApiParameter): Promise<ServiceResult<VmiBinModel>> {
    try {
        const vmiBinModel = await post<VmiBinModel>(
            vmiLocationBinsUrl.replace("{vmiLocationId}", parameter.vmiLocationId),
            parameter.vmiBin as VmiBinModel,
        );
        return {
            result: vmiBinModel,
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

export async function getVmiBins(parameter: GetVmiBinsApiParameter) {
    if (!parameter.vmiLocationId) {
        throw Error("vmiLocationId is required");
    }

    const vmiBins = await get<VmiBinCollectionModel>(
        vmiLocationBinsUrl.replace("{vmiLocationId}", parameter.vmiLocationId),
        parameter,
    );
    return vmiBins;
}

export function deleteVmiBins(parameter: DeleteVmiBinsApiParameter) {
    const query = parameter.ids.map(o => `ids=${o}`).join("&");
    return requestVoid(
        `${vmiLocationBinsUrl.replace("{vmiLocationId}", parameter.vmiLocationId)}/batch?${query}`,
        "DELETE",
        {
            "Content-Type": "application/json",
        },
    );
}
