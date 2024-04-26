import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { GetAccountsApiParameter } from "@insite/client-framework/Services/AccountService";
import { GetVmiLocationsApiParameter } from "@insite/client-framework/Services/VmiLocationService";

export default interface VmiUsersState {
    getVmiUsersParameter: GetAccountsApiParameter;
    getVmiLocationsParameter: GetVmiLocationsApiParameter;
    selectedVmiLocations: SafeDictionary<boolean>;
}
