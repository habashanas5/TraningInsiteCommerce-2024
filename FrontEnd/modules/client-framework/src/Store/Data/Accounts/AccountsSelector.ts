import { GetAccountsApiParameter } from "@insite/client-framework/Services/AccountService";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getById, getDataView } from "@insite/client-framework/Store/Data/DataState";

export function getCurrentAccountState(state: ApplicationState) {
    return getById(state.data.accounts, API_URL_CURRENT_FRAGMENT);
}

export function getAccountState(state: ApplicationState, accountId: string | undefined) {
    return getById(state.data.accounts, accountId);
}

export function getAccountsDataView(state: ApplicationState, parameter?: GetAccountsApiParameter) {
    return getDataView(state.data.accounts, parameter);
}
