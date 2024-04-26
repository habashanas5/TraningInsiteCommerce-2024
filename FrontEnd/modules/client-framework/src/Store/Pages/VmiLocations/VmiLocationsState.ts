import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { GetVmiLocationsApiParameter } from "@insite/client-framework/Services/VmiLocationService";

export default interface VmiLocationsState {
    getVmiLocationsParameter: GetVmiLocationsApiParameter;
    selectedVmiLocations: SafeDictionary<boolean>;
}
