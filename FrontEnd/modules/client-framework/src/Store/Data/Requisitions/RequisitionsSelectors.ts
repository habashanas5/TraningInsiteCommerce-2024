import { GetRequisitionsApiParameter } from "@insite/client-framework/Services/RequisitionService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getById, getDataView } from "@insite/client-framework/Store/Data/DataState";

export function getRequisitionsDataView(
    state: ApplicationState,
    getRequisitionsParameter: GetRequisitionsApiParameter,
) {
    return getDataView(state.data.requisitions, getRequisitionsParameter);
}

export function getRequisitionState(state: ApplicationState, requisitionId: string | undefined) {
    return getById(state.data.requisitions, requisitionId);
}
