import { ApiParameter, get, post } from "@insite/client-framework/Services/ApiService";
import {
    AccountSettingsModel,
    BaseModel,
    CartSettingsModel,
    CustomerSettingsModel,
    InvoiceSettingsModel,
    OrderSettingsModel,
    ProductSettingsModel,
    QuoteSettingsModel,
    WebsiteSettingsModel,
    WishListSettingsModel,
} from "@insite/client-framework/Types/ApiModels";

export interface GetTokenExConfigApiParameter extends ApiParameter {
    token?: string;
    origin?: string;
    isEcheck?: boolean;
}

export interface GetSettingsApiParameter extends ApiParameter {}

export interface TokenExConfig {
    tokenExId: string;
    origin: string;
    timestamp: string;
    token: string;
    tokenScheme: string;
    authenticationKey: string;
}

export interface PaymetricConfig {
    success: boolean;
    message: string;
    accessToken: string;
    javaScriptUrl: string;
}

export const enum StorefrontAccess {
    NoSignInRequired = "NoSignInRequired",
    SignInRequiredToBrowse = "SignInRequiredToBrowse",
    SignInRequiredToAddToCart = "SignInRequiredToAddToCart",
    SignInRequiredToAddToCartOrSeePrices = "SignInRequiredToAddToCartOrSeePrices",
}

export function getSettings(parameter: GetSettingsApiParameter) {
    return get<SettingsModel>("/api/v1/settings/", parameter);
}

export function getTokenExConfig(parameter: GetTokenExConfigApiParameter = {}) {
    parameter.origin = parameter.origin ?? window.location.origin;
    return get<TokenExConfig>("/api/v1/tokenexconfig", parameter);
}

export function getPaymetricConfig() {
    return post<PaymetricConfig>("/api/v1/paymetric/config");
}

export interface SettingsModel extends BaseModel {
    settingsCollection: SettingsCollectionModel;
}

export interface SettingsCollectionModel {
    accountSettings: AccountSettingsModel;
    cartSettings: CartSettingsModel;
    customerSettings: CustomerSettingsModel;
    invoiceSettings: InvoiceSettingsModel;
    orderSettings: OrderSettingsModel;
    productSettings: ProductSettingsModel;
    quoteSettings: QuoteSettingsModel;
    searchSettings: SearchSettingsModel;
    websiteSettings: WebsiteSettingsModel;
    wishListSettings: WishListSettingsModel;
    /** Settings can be extended, but the type isn't knowable to base code. */
    [key: string]: unknown | undefined;
}

export interface SearchSettingsModel extends BaseModel {
    autocompleteEnabled: boolean;
    searchHistoryEnabled: boolean;
    searchHistoryLimit: number;
    enableBoostingByPurchaseHistory: boolean;
    allowFilteringForPreviouslyPurchasedProducts: boolean;
    searchPath: string;
}
