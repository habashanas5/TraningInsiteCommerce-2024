import { DataViewState } from "@insite/client-framework/Store/Data/DataState";
import { VmiBinModel } from "@insite/client-framework/Types/ApiModels";

export interface VmiBinsState extends DataViewState<VmiBinModel> {
    isRemoving: boolean;
}
