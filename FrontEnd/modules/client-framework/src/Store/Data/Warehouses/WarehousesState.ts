import { DataView, DataViewState } from "@insite/client-framework/Store/Data/DataState";
import { WarehouseModel } from "@insite/client-framework/Types/ApiModels";

export interface WarehousesDataView extends DataView {
    readonly defaultLatitude: number;
    readonly defaultLongitude: number;
    readonly defaultRadius: number;
    readonly distanceUnitOfMeasure: string;
}

export interface WarehousesState extends DataViewState<WarehouseModel, WarehousesDataView> {}
