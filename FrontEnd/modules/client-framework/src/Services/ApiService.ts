import { Dictionary } from "@insite/client-framework/Common/Types";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import logger from "@insite/client-framework/Logger";
import { fetch } from "@insite/client-framework/ServerSideRendering";
import { BaseModel } from "@insite/client-framework/Types/ApiModels";

/** The API URL fragment used to reference the current resource, relative to the session. */
export const API_URL_CURRENT_FRAGMENT = "current";

export interface ApiParameter {
    additionalQueryStringParameters?: Dictionary<any>;
}

export type ServiceResult<T> =
    | {
          successful: true;
          result: T;
      }
    | {
          successful: false;
          errorMessage: string;
          statusCode?: number;
      };

export interface HasPagingParameters {
    page?: number;
    pageSize?: number;
    defaultPageSize?: number;
    sort?: string;
}

export function get<T>(
    endpoint: string,
    parameter: ApiParameter = {},
    queryStringParameters: Dictionary<any> = {},
    cache: RequestInit["cache"] = "no-cache",
) {
    let queryString = "";
    const combinedQueryString: Dictionary<any> = {
        ...parameter,
        ...parameter.additionalQueryStringParameters,
        ...queryStringParameters,
    };

    const additionalExpands = combinedQueryString["additionalExpands"];
    if (additionalExpands) {
        if (!combinedQueryString["expand"]) {
            combinedQueryString["expand"] = [];
        }
        combinedQueryString["expand"] = combinedQueryString["expand"].concat(additionalExpands);
        delete combinedQueryString["additionalExpands"];
    }

    for (const key in combinedQueryString) {
        if (key !== "additionalQueryStringParameters" && combinedQueryString[key] !== undefined) {
            if (key !== "expand" && key !== "exclude" && Array.isArray(combinedQueryString[key])) {
                // WebApi requires arrays to be split into individual query string values
                combinedQueryString[key].forEach((p: string) => {
                    queryString += `${key}=${encodeURIComponent(p)}&`;
                });
            } else {
                queryString += `${key}=${encodeURIComponent(combinedQueryString[key])}&`;
            }
        }
    }

    if (queryString !== "") {
        queryString = (endpoint.indexOf("?") < 0 ? "?" : "&") + queryString.substr(0, queryString.length - 1);
    }

    return request<T>(endpoint + queryString, "GET", undefined, undefined, undefined, cache);
}

export function post<Parameter, Result = Parameter>(endpoint: string, model?: Parameter) {
    return request<Result>(
        endpoint,
        "POST",
        { "Content-Type": "application/json" },
        model ? JSON.stringify(model) : undefined,
    );
}

export function patch<T extends BaseModel>(endpoint: string, model: Partial<T> | T) {
    return request<T>(endpoint, "PATCH", { "Content-Type": "application/json" }, JSON.stringify(model));
}

export function del(endpoint: string, isStatusOkay?: (status: number) => boolean) {
    return requestVoid(endpoint, "DELETE", { "Content-Type": "application/json" }, undefined, isStatusOkay);
}

export class ApiError extends Error {
    url: string;
    errorMessage: string;
    status: number;
    errorJson: any;

    constructor(url: string, response: Response, errorMessage: string, errorJson: any) {
        /** Node adds additional data to the `Response` type from `fetch`. */
        type PossibleNodeResponse = Response & {
            _raw?: unknown;
        };

        const { body, _raw, ...responseToLog } = response as PossibleNodeResponse;

        const t = "";
        super(
            `Request to ${url} resulted in a error status ${response.status}. \n` +
                `${errorMessage !== "" ? `errorMessage: ${errorMessage} \n` : ""}` +
                `${errorJson ? `errorJson: ${JSON.stringify(errorJson, null, 1)} \n` : ""}` +
                `response: ${JSON.stringify(responseToLog, null, 1)}`,
        );

        this.url = url;
        this.errorMessage = errorMessage;
        this.status = response.status;
        this.errorJson = errorJson;
    }
}

const adminEndpoints = ["api/v1/admin", "api/internal/contentadmin", ".spire/"] as const;
const excludeFromAdminEndpoints = [".spire/shareEntity"] as const;
const isAdminEndpoint = (endpoint: string) =>
    adminEndpoints.filter(a => endpoint.toLowerCase().includes(a)).length > 0 &&
    excludeFromAdminEndpoints.filter(a => endpoint.toLowerCase().includes(a.toLowerCase())).length === 0;

export const rawRequest = async (
    endpoint: string,
    method = "GET",
    headers: Dictionary<string> = {},
    body?: string | FormData,
    isStatusOkay: (status: number) => boolean = status => status >= 200 && status < 300,
    cache: RequestInit["cache"] = "no-cache",
) => {
    if (isAdminEndpoint(endpoint)) {
        if (IS_SERVER_SIDE) {
            logger.warn(
                `There was an attempt to make a request to the endpoint ${endpoint} during SSR. The shell doesn't currently support SSR.`,
            );
        } else {
            const accessToken = window.localStorage.getItem("admin-accessToken");
            if (accessToken) {
                headers["Authorization"] = `Bearer ${accessToken}`;
            }
        }
    } else if (!IS_SERVER_SIDE && window.location.search.indexOf("access_token=") > -1) {
        const parsedQuery = parseQueryString<{ access_token: string }>(window.location.search);
        headers["Authorization"] = `Bearer ${parsedQuery.access_token}`;
    }

    const requestInit: RequestInit = {
        method,
        headers,
        cache,
    };

    if (body) {
        requestInit.body = body;
    }

    const response = await fetch(endpoint, requestInit);
    if (!isStatusOkay(response.status)) {
        let message: string;
        let errorJson: any;
        if (response.headers.get("Content-Type")?.startsWith("application/json")) {
            errorJson = (await response.json()) as { message: string; exceptionMessage?: string };
            message = errorJson.exceptionMessage ?? errorJson.message;
        } else {
            message = await response.text();
        }
        throw new ApiError(endpoint, response, message, errorJson);
    }

    return response;
};

export async function request<T>(
    endpoint: string,
    method: string,
    headers: Dictionary<string> = { "X-Requested-With": "XMLHttpRequest" },
    body?: string | FormData,
    isStatusOkay?: (status: number) => boolean,
    cache: RequestInit["cache"] = "no-cache",
) {
    const response = await rawRequest(endpoint, method, headers, body, isStatusOkay, cache);

    try {
        return (await response.json()) as Promise<T>;
    } catch {
        return {} as Promise<T>;
    }
}

export async function requestVoid(
    endpoint: string,
    method: string,
    headers: Dictionary<string> = {},
    body?: string,
    isStatusOkay?: (status: number) => boolean,
) {
    await rawRequest(endpoint, method, headers, body, isStatusOkay ?? (status => status === 204));
}

export function doesNotHaveExpand(
    parameter: { expand?: string[]; additionalExpands?: string[] } | undefined,
    value: string,
) {
    return (
        !parameter ||
        ((!parameter.expand || parameter.expand.filter(o => o.toLowerCase() === value.toLowerCase()).length === 0) &&
            (!parameter.additionalExpands ||
                parameter.additionalExpands.filter(o => o.toLowerCase() === value.toLowerCase()).length === 0))
    );
}
