import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { GetBillTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getById, getDataView } from "@insite/client-framework/Store/Data/DataState";

export function getBillTosDataView(state: ApplicationState, parameter: GetBillTosApiParameter) {
    return getDataView(state.data.billTos, parameter);
}

export function getBillToState(state: ApplicationState, id: string | undefined) {
    return getById(state.data.billTos, id);
}

export function getCurrentBillToState(state: ApplicationState) {
    return getById(state.data.billTos, API_URL_CURRENT_FRAGMENT, o => state.data.billTos.currentId || o);
}
