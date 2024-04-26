import { GetVmiBinsApiParameter } from "@insite/client-framework/Services/VmiBinsService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getById, getDataView } from "@insite/client-framework/Store/Data/DataState";

export function getVmiBinState(state: ApplicationState, id: string | undefined) {
    return getById(state.data.vmiBins, id);
}

export function getVmiBinsDataView(state: ApplicationState, getVmiBinsParameter: GetVmiBinsApiParameter) {
    return getDataView(state.data.vmiBins, getVmiBinsParameter);
}
