import { get } from "@insite/client-framework/Services/ApiService";

export interface ExternalProviderLinkCollectionModel {
    externalProviders: ExternalProviderLinkModel[];
}

export interface ExternalProviderLinkModel {
    caption: string;
    url: string;
}

export function getExternalProviders() {
    return get<ExternalProviderLinkCollectionModel>(`/identity/externalproviders${window.location.search}`);
}
