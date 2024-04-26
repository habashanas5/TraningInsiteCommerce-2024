import isApiError from "@insite/client-framework/Common/isApiError";
import {
    ApiParameter,
    API_URL_CURRENT_FRAGMENT,
    del,
    doesNotHaveExpand,
    get,
    HasPagingParameters,
    patch,
    post,
    ServiceResult,
} from "@insite/client-framework/Services/ApiService";
import {
    AccountCollectionModel,
    AccountModel,
    AccountPaymentProfileCollectionModel,
    AccountPaymentProfileModel,
    AccountShipToCollectionModel,
    AccountShipToModel,
    VmiUserModel,
} from "@insite/client-framework/Types/ApiModels";

export interface GetAccountsApiParameter extends ApiParameter, HasPagingParameters {
    searchText?: string;
    expand?: "administration"[];
    additionalExpands?: string[];
    roles?: string[];
    excludeRoles?: string[];
}

export interface GetAccountApiParameter extends ApiParameter {
    accountId: string;
    expand?: ("approvers" | "roles")[];
}

export interface UpdateAccountApiParameter extends ApiParameter {
    account: AccountModel;
}

export interface AddAccountApiParameter extends ApiParameter {
    account: Partial<AccountModel>;
}

export interface GetPaymentProfilesApiParameter extends ApiParameter, HasPagingParameters {
    expand?: "properties"[];
    additionalExpands?: string[];
}

export interface AddPaymentProfileApiParameter extends ApiParameter {
    paymentProfile: AccountPaymentProfileModel;
}

export interface UpdatePaymentProfileApiParameter extends ApiParameter {
    paymentProfile: AccountPaymentProfileModel;
}

export interface DeletePaymentProfileApiParameter extends ApiParameter {
    paymentProfileId: string;
}

export interface GetAccountShipToCollectionApiParameter extends ApiParameter, HasPagingParameters {
    accountId?: string;
}

export interface ApplyAccountShipToCollectionApiParameter extends ApiParameter {
    accountId: string;
    shipToCollection: AccountShipToModel[];
}

export interface UpdateVmiUserApiParameter extends ApiParameter {
    vmiUser: Partial<VmiUserModel>;
}

const accountsUrl = "/api/v1/accounts";
const paymentProfilesUrl = `${accountsUrl}/current/paymentprofiles`;

export async function getAccounts(parameter: GetAccountsApiParameter) {
    const accountCollection = await get<AccountCollectionModel>(accountsUrl, parameter);
    accountCollection.accounts?.forEach(o => cleanAccount(o));
    return accountCollection;
}

export async function getAccount(parameter: GetAccountApiParameter) {
    const accountId = parameter.accountId || API_URL_CURRENT_FRAGMENT;
    const account = await get<AccountModel>(`${accountsUrl}/${accountId}`, {
        expand: parameter.expand,
    } as ApiParameter);
    cleanAccount(account, parameter);
    return account;
}

export async function updateAccount(parameter: UpdateAccountApiParameter) {
    const account = parameter.account;
    const accountId = account.id || API_URL_CURRENT_FRAGMENT;
    const updatedAccount = await patch<AccountModel>(`${accountsUrl}/${accountId}`, account);
    cleanAccount(updatedAccount);
    return updatedAccount;
}

export async function updateAccountWithResult(
    parameter: UpdateAccountApiParameter,
): Promise<ServiceResult<AccountModel>> {
    try {
        const updatedAccount = await updateAccount(parameter);
        return {
            successful: true,
            result: updatedAccount,
        };
    } catch (error) {
        if (isApiError(error) && error.status === 400) {
            return {
                successful: false,
                errorMessage: error.errorJson.message,
            };
        }
        throw error;
    }
}

export async function addAccount(parameter: AddAccountApiParameter): Promise<ServiceResult<AccountModel>> {
    try {
        const accountModel = await post<AccountModel>(`${accountsUrl}`, parameter.account as AccountModel);
        return {
            result: accountModel,
            successful: true,
        };
    } catch (error) {
        if ("status" in error && error.status === 400 && error.errorJson && error.errorJson.message) {
            return {
                successful: false,
                errorMessage: error.errorJson.message,
            };
        }
        throw error;
    }
}

export function getPaymentProfiles(parameter: GetPaymentProfilesApiParameter) {
    return get<AccountPaymentProfileCollectionModel>(paymentProfilesUrl, parameter, {}, "no-store");
}

export function addPaymentProfile(parameter: AddPaymentProfileApiParameter) {
    return post<AccountPaymentProfileModel>(paymentProfilesUrl, parameter.paymentProfile);
}

export function updatePaymentProfile(parameter: UpdatePaymentProfileApiParameter) {
    return patch<AccountPaymentProfileModel>(
        `${paymentProfilesUrl}/${parameter.paymentProfile.id}`,
        parameter.paymentProfile,
    );
}

export function deletePaymentProfile(parameter: DeletePaymentProfileApiParameter) {
    return del(`${accountsUrl}/current/paymentprofiles/${parameter.paymentProfileId}`);
}

export function getAccountShipToCollection(parameter: GetAccountShipToCollectionApiParameter) {
    return get<AccountShipToCollectionModel>(`${accountsUrl}/${parameter.accountId}/shiptos`, parameter);
}

export async function applyAccountShipToCollection(
    parameter: ApplyAccountShipToCollectionApiParameter,
): Promise<ServiceResult<AccountShipToCollectionModel>> {
    try {
        const shipToCollection = await patch<AccountShipToCollectionModel>(
            `${accountsUrl}/${parameter.accountId}/shiptos`,
            { userShipToCollection: parameter.shipToCollection },
        );
        return {
            successful: true,
            result: shipToCollection,
        };
    } catch (error) {
        if (isApiError(error) && error.status === 400) {
            return {
                successful: false,
                errorMessage: error.errorJson.message,
            };
        }
        throw error;
    }
}

export async function updateVmiUser(parameter: UpdateVmiUserApiParameter): Promise<ServiceResult<VmiUserModel>> {
    try {
        const vmiUserModel = await patch<VmiUserModel>(
            `${accountsUrl}/vmi/${parameter.vmiUser.userId}`,
            parameter.vmiUser as VmiUserModel,
        );
        return {
            result: vmiUserModel,
            successful: true,
        };
    } catch (error) {
        if ("status" in error && error.status === 400 && error.errorJson && error.errorJson.message) {
            return {
                successful: false,
                errorMessage: error.errorJson.message,
            };
        }
        if ("status" in error && error.status === 404) {
            return {
                successful: false,
                errorMessage: error.errorMessage,
            };
        }
        throw error;
    }
}

function cleanAccount(accountModel: AccountModel, parameter?: { expand?: string[]; additionalExpands?: string[] }) {
    accountModel.lastLoginOn = accountModel.lastLoginOn && new Date(accountModel.lastLoginOn);
    if (doesNotHaveExpand(parameter, "roles")) {
        delete accountModel.availableRoles;
    }

    if (doesNotHaveExpand(parameter, "approvers")) {
        delete accountModel.availableApprovers;
    }
}
