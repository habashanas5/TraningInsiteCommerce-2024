import { ApiParameter, get } from "@insite/client-framework/Services/ApiService";
import {
    AddressFieldCollectionModel,
    CountryCollectionModel,
    SiteMessageCollectionModel,
    TranslationDictionaryCollectionModel,
    WebsiteModel,
} from "@insite/client-framework/Types/ApiModels";

export interface GetCurrentCountriesApiParameter extends ApiParameter {
    expand?: "states"[];
    additionalExpands?: string[];
}

export interface GetAddressFieldsApiParameter extends ApiParameter {
    additionalExpands?: string[];
}

export interface GetCurrentWebsiteApiParameter extends ApiParameter {
    expand?: ("languages" | "currencies" | "countries" | "states")[];
    additionalExpands?: string[];
}

export function getAddressFields(parameter: GetAddressFieldsApiParameter) {
    return get<AddressFieldCollectionModel>("/api/v1/websites/current/addressfields", {});
}

export function getCurrentCountries(parameter: GetCurrentCountriesApiParameter) {
    return get<CountryCollectionModel>("/api/v1/websites/current/countries", parameter);
}

export type Website = Omit<WebsiteModel, "states" | "countries">;

export async function getCurrentWebsite(parameter: GetCurrentWebsiteApiParameter): Promise<Website> {
    const websiteModel = await get<WebsiteModel>("/api/v1/websites/current", parameter);
    delete websiteModel.countries;
    delete websiteModel.states;
    return websiteModel;
}

export type GetSiteMessageParameter = ApiParameter & {
    languageCode?: string;
};

export const getSiteMessages = (parameter?: GetSiteMessageParameter) =>
    get<SiteMessageCollectionModel>("/api/v1/websites/current/sitemessages", parameter);

export type GetTranslationDictionariesParameter = ApiParameter & {
    languageCode?: string;
    pageSize: number;
    source?: string | string[];
};

export const getTranslationDictionaries = (parameter?: GetTranslationDictionariesParameter) =>
    get<TranslationDictionaryCollectionModel>("/api/v1/translationdictionaries", parameter);
