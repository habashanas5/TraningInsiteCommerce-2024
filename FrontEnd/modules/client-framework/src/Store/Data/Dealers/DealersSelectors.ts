import { GetDealersApiParameter } from "@insite/client-framework/Services/DealerService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getById, getDataView } from "@insite/client-framework/Store/Data/DataState";
import { DealersDataView } from "@insite/client-framework/Store/Data/Dealers/DealersState";
import { DealerModel } from "@insite/client-framework/Types/ApiModels";

import { createContext } from "react";

export function getDealersDataView(state: ApplicationState, parameter: GetDealersApiParameter | undefined) {
    return getDataView<DealerModel, DealersDataView>(state.data.dealers, parameter);
}

export function getDealersDefaultLocation(state: ApplicationState) {
    return state.data.dealers.defaultLocation;
}

export function getDealerState(state: ApplicationState, dealerId: string | undefined) {
    return getById(state.data.dealers, dealerId);
}

export const DealerStateContext = createContext<ReturnType<typeof getDealerState>>({
    value: undefined,
    isLoading: false,
    errorStatusCode: undefined,
    id: undefined,
});
