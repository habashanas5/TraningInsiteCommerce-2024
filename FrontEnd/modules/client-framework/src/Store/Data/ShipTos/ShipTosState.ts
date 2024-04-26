import { DataViewState } from "@insite/client-framework/Store/Data/DataState";
import { ShipToModel } from "@insite/client-framework/Types/ApiModels";

export interface ShipTosState extends DataViewState<ShipToModel> {
    readonly currentId?: string;
}
