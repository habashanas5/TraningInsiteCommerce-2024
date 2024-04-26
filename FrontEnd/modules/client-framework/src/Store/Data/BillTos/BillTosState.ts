import { DataViewState } from "@insite/client-framework/Store/Data/DataState";
import { BillToModel } from "@insite/client-framework/Types/ApiModels";

export interface BillTosState extends DataViewState<BillToModel> {
    readonly currentId?: string;
}
