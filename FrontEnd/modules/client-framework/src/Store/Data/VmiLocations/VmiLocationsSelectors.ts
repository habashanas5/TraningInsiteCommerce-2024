import { Session } from "@insite/client-framework/Services/SessionService";
import { GetVmiLocationsApiParameter } from "@insite/client-framework/Services/VmiLocationService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getById, getDataView } from "@insite/client-framework/Store/Data/DataState";
import { OrderSettingsModel } from "@insite/client-framework/Types/ApiModels";
import { createContext } from "react";

export function getVmiLocationState(state: ApplicationState, id: string | undefined) {
    return getById(state.data.vmiLocations, id);
}

export function getVmiLocationsDataView(
    state: ApplicationState,
    getVmiLocationsParameter: GetVmiLocationsApiParameter,
) {
    return getDataView(state.data.vmiLocations, getVmiLocationsParameter);
}

export const VmiLocationStateContext = createContext<ReturnType<typeof getVmiLocationState>>({
    value: undefined,
    isLoading: false,
    errorStatusCode: undefined,
    id: undefined,
});

export const VmiLocationsDataViewContext = createContext<ReturnType<typeof getVmiLocationsDataView>>({
    value: undefined,
    isLoading: false,
});

export function isVmiAdmin(orderSettings: OrderSettingsModel, session: Session) {
    return orderSettings.vmiEnabled && (session.userRoles || "").indexOf("VMI_Admin") !== -1;
}
