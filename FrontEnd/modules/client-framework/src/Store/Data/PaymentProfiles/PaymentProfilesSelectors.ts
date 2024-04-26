import { GetPaymentProfilesApiParameter } from "@insite/client-framework/Services/AccountService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getDataView } from "@insite/client-framework/Store/Data/DataState";

export function getPaymentProfilesDataView(state: ApplicationState, parameter: GetPaymentProfilesApiParameter) {
    return getDataView(state.data.paymentProfiles, parameter);
}
