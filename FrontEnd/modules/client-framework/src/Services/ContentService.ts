import { Dictionary, SafeDictionary } from "@insite/client-framework/Common/Types";
import { request } from "@insite/client-framework/Services/ApiService";
import { PaginationModel } from "@insite/client-framework/Types/ApiModels";
import { PageModel } from "@insite/client-framework/Types/PageProps";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";

/** The URL path for the internal GetContentByVersion feature, used for the publish compare functionality.  */
export const getContentByVersionPath = "/.spire/GetContentByVersion";

export const getPageByType = (type: string) =>
    get<{ page: PageModel; statusCode: number; redirectTo: string }>("pageByType", { type });

export const getPageByUrl = (url: string, bypassFilters?: boolean) =>
    get<RetrievePageResult>("pageByUrl", { url, bypassFilters });

/** @internal Gets page content for a specific version, used by the content management shell. */
export const getPageByVersion = (pageVersionId: string) =>
    request<PageModel>(`/api/internal/contentadmin/getPageByVersion?pageVersionId=${pageVersionId}`, "GET");

export const getPageLinks = () => get<PageLinkModel[]>("pageLinks");

export const getNodeIdForPageName = (pageName: string) => get<string>("getNodeIdForPageName", { pageName });

export const getTheme = () => get<BaseTheme>("theme");

export const getPageUrlByType = (type: string) => get<string>("pageUrlByType", { type });

export interface GetPagesByParentApiParameter {
    page?: number;
    pageSize?: number;
    parentNodeId: string;
}

export interface PagesCollectionModel {
    pages: PageModel[];
    pagination: PaginationModel;
}

export const getPagesByParent = (parameter: { parentNodeId: string }) =>
    get<PagesCollectionModel>("pagesByParent", parameter);

const contentUrl = "/api/v2/content/";

function get<T>(endpoint: string, parameter?: Dictionary<any>) {
    let queryString = "";
    for (const key in parameter) {
        queryString += `${key}=${parameter[key]}&`;
    }

    if (queryString !== "") {
        queryString = (endpoint.indexOf("?") < 0 ? "?" : "&") + queryString.substr(0, queryString.length - 1);
    }

    return request<T>(contentUrl + endpoint + queryString, "GET");
}

function post<T>(endpoint: string, model?: T) {
    return request<T>(
        contentUrl + endpoint,
        "POST",
        { "Content-Type": "application/json" },
        model ? JSON.stringify(model) : undefined,
    );
}

export interface PageLinkModel {
    title: string;
    url: string;
    type?: string;
    id: string;
    parentId?: string;
    excludeFromNavigation?: boolean;
    children?: PageLinkModel[];
}

export interface RetrievePageResult {
    page?: PageModel;
    statusCode: number;
    redirectTo?: string;
    authorizationFailed?: boolean;
    bypassedAuthorization?: boolean;
    isAuthenticatedOnServer: boolean;
    requiresAuthorization: boolean;
    alternateLanguageUrls: SafeDictionary<string>;
}

export interface BasicLanguageModel {
    id: string;
    hasPersonaSpecificContent: boolean;
    hasDeviceSpecificContent: boolean;
}
