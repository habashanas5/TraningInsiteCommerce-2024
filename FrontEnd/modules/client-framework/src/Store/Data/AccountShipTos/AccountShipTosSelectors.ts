import { GetAccountShipToCollectionApiParameter } from "@insite/client-framework/Services/AccountService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";

export function getAccountShipTosDataView(state: ApplicationState, parameter?: GetAccountShipToCollectionApiParameter) {
    const dataView = state.data.accountShipTos.dataViews[getDataViewKey(parameter)];
    if (!dataView) {
        return {
            isLoading: false,
            pagination: null,
            value: undefined,
        };
    }

    return dataView;
}
