import { ApiParameter, get, HasPagingParameters } from "@insite/client-framework/Services/ApiService";
import { DealerCollectionModel, DealerModel } from "@insite/client-framework/Types/ApiModels";

export interface GetDealersApiParameter extends ApiParameter, HasPagingParameters {
    name: string;
    radius?: number;
    latitude: number;
    longitude: number;
}

export interface GetDealerApiParameter extends ApiParameter {
    id: string;
}

const dealersUrl = "/api/v1/dealers";

export function getDealers(parameter: GetDealersApiParameter) {
    return get<DealerCollectionModel>(`${dealersUrl}/`, parameter);
}

export function getDealer(parameter: GetDealerApiParameter) {
    return get<DealerModel>(`${dealersUrl}/${parameter.id}`);
}
