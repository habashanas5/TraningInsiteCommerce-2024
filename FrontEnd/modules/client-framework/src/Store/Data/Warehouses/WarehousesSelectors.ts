import { GetWarehousesApiParameter } from "@insite/client-framework/Services/WarehouseService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getDataView } from "@insite/client-framework/Store/Data/DataState";
import { WarehousesDataView } from "@insite/client-framework/Store/Data/Warehouses/WarehousesState";
import { WarehouseModel } from "@insite/client-framework/Types/ApiModels";

export function getWarehousesDataView(state: ApplicationState, parameter: GetWarehousesApiParameter | undefined) {
    return getDataView<WarehouseModel, WarehousesDataView>(state.data.warehouses, parameter);
}
