import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { dataViewNotFound, getDataViewKey } from "@insite/client-framework/Store/Data/DataState";

export function getAddressFieldsDataView(state: ApplicationState) {
    const dataView = state.data.addressFields.dataViews[getDataViewKey({})];
    if (!dataView) {
        return dataViewNotFound;
    }

    return dataView;
}
