import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getDataView } from "@insite/client-framework/Store/Data/DataState";

export function getOrderStatusMappingDataView(state: ApplicationState) {
    return getDataView(state.data.orderStatusMappings, {});
}
