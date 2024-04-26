import { ApiParameter, get, HasPagingParameters } from "@insite/client-framework/Services/ApiService";
import { WarehouseCollectionModel } from "@insite/client-framework/Types/ApiModels";

export interface GetWarehousesApiParameter extends ApiParameter, HasPagingParameters {
    search: string;
    latitude: number;
    longitude: number;
    radius?: number;
    onlyPickupWarehouses?: boolean;
    excludeCurrentPickupWarehouse?: boolean;
}

const warehousesAlphabetUrl = "/api/v1/warehouses";

export function getWarehouses(parameter: GetWarehousesApiParameter) {
    return get<WarehouseCollectionModel>(`${warehousesAlphabetUrl}/`, parameter);
}
