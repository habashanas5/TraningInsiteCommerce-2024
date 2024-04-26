import { Dictionary } from "@insite/client-framework/Common/Types";
import { DataViewState } from "@insite/client-framework/Store/Data/DataState";
import { OrderModel } from "@insite/client-framework/Types/ApiModels";

export interface OrdersState extends DataViewState<OrderModel> {
    readonly idByOrderNumber: Dictionary<string>;
}
