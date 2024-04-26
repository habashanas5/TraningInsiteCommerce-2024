import { DataViewState } from "@insite/client-framework/Store/Data/DataState";
import { VmiLocationModel } from "@insite/client-framework/Types/ApiModels";

export interface VmiLocationsState extends DataViewState<VmiLocationModel> {
    isRemoving: boolean;
}
