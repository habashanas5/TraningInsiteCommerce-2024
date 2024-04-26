/* eslint-disable spire/export-chain */
import { GetCurrentCountriesApiParameter } from "@insite/client-framework/Services/WebsiteService";
import loadCountries from "@insite/client-framework/Store/Data/Countries/Handlers/LoadCountries";

export const loadCurrentCountriesParameter: GetCurrentCountriesApiParameter = { expand: ["states"] };

const loadCurrentCountries = () => loadCountries(loadCurrentCountriesParameter);
export default loadCurrentCountries;
