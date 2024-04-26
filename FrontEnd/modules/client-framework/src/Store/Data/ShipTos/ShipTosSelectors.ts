import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { GetShipTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getById, getDataView } from "@insite/client-framework/Store/Data/DataState";
import { currentShipTosApiParameter } from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadCurrentShipTos";

export function getShipTosDataView(state: ApplicationState, parameter: GetShipTosApiParameter) {
    return getDataView(state.data.shipTos, parameter);
}

export function getCurrentShipTosDataView(state: ApplicationState) {
    return getShipTosDataView(state, currentShipTosApiParameter);
}

export function getShipToState(state: ApplicationState, id: string | undefined) {
    return getById(state.data.shipTos, id);
}

export function getCurrentShipToState(state: ApplicationState) {
    return getById(state.data.shipTos, API_URL_CURRENT_FRAGMENT, o => state.data.shipTos.currentId || o);
}
