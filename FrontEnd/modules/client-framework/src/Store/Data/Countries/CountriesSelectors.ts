import { GetCurrentCountriesApiParameter } from "@insite/client-framework/Services/WebsiteService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { loadCurrentCountriesParameter } from "@insite/client-framework/Store/Data/Countries/Handlers/LoadCurrentCountries";
import { getDataView } from "@insite/client-framework/Store/Data/DataState";

export function getCurrentCountries(state: ApplicationState) {
    return getCountriesDataView(state, loadCurrentCountriesParameter).value;
}

export function getCountriesDataView(state: ApplicationState, parameter: GetCurrentCountriesApiParameter) {
    return getDataView(state.data.countries, parameter);
}
