import { getValueCaseInsensitive, SafeDictionary } from "@insite/client-framework/Common/Types";
import { PreparedMetadata } from "@insite/client-framework/Common/Utilities/setPageMetadata";
import logger from "@insite/client-framework/Logger";
import { RetrievePageResult } from "@insite/client-framework/Services/ContentService";
import "isomorphic-fetch";
import { URL } from "url";
// 'isomorphic-fetch' makes node and client-side have a similar 'fetch', but causes an 'iconv-loader' warning...

/**
 * A reference to the `domain` module of Node.
 * It's been deprecated for several years, but (at the time of writing) no replacement has been announced.
 */
let domain:
    | undefined
    | {
          /** The active context--this will switch when there are multiple users with async I/O, such as with API calls. */
          readonly active: {
              /**
               * Insite-specific extensions to the `domain.active` feature.
               * Using `domain.active` this way is not explicitly supported, but seems to work the way we need.
               */
              insiteSession: InsiteSession;
          };
      };

interface InsiteSession {
    /** Ensures that we have the url available when needed for server side rendering. */
    url?: URL;
    redirectTo?: string;
    trackedPromises: Promise<any>[];
    /** Callback for tracking added promises. */
    promiseAddedCallback?: (stack: string) => void;
    headers?: SafeDictionary<string | string[]>;
    /**
     * @deprecated Use headers["cookie"] instead
     */
    cookies?: string | undefined;
    cookiesDictionary?: SafeDictionary<string>;
    /**
     * @deprecated Use headers["user-agent"] instead
     */
    userAgent?: string | undefined;
    statusCode?: number;
    messagesByName: SafeDictionary<string>;
    translationsByKeyword: SafeDictionary<string>;
    displayErrorPage?: true | undefined;
    errorStatusCode?: number;
    isWebCrawler: boolean;
    isShareEntity: boolean;
    pageMetadata?: PreparedMetadata;
    initialPage?:
        | {
              result: RetrievePageResult;
              url: string;
          }
        | undefined;
}

export const throwIfClientSide = () => {
    if (!IS_SERVER_SIDE) {
        throw new Error("This API can only be used server-side.");
    }
};

export const serverSiteMessageResolver = (messageName: string) => {
    throwIfClientSide();

    if (!domain) {
        return undefined;
    }

    return getValueCaseInsensitive(domain.active.insiteSession.messagesByName, messageName);
};

export const setServerSiteMessages = (messagesByName: SafeDictionary<string>) => {
    throwIfClientSide();

    if (!domain) {
        throw new Error("Domain not set.");
    }

    domain.active.insiteSession.messagesByName = messagesByName;
};

export const serverTranslationResolver = (keyword: string) => {
    throwIfClientSide();

    if (!domain) {
        return undefined;
    }

    return getValueCaseInsensitive(domain.active.insiteSession.translationsByKeyword, keyword);
};

export const setServerTranslations = (translationsByKeyword: SafeDictionary<string>) => {
    throwIfClientSide();

    if (!domain) {
        throw new Error("Domain not set.");
    }

    domain.active.insiteSession.translationsByKeyword = translationsByKeyword;
};

/** Sets the `domain` module reference for use with session data storage. */
export const setDomain = (newDomain: typeof domain) => {
    throwIfClientSide();

    if (!newDomain) {
        throw new Error("newDomain parameter must be an object.");
    }

    if (domain && domain !== newDomain) {
        // This should never happen, but in theory if it did, we wouldn't be able to ensure all requests will work.
        logger.error("Fatal error: The domain module reference has changed, breaking server-side session tracking.");
        process.exit(1);
    }

    newDomain.active.insiteSession = {
        trackedPromises: [],
        messagesByName: {},
        translationsByKeyword: {},
        isWebCrawler: false,
        isShareEntity: false,
    };

    domain = newDomain;
};

class MissingDomainError extends Error {}

/** Gets the server-side session, throws an error if used client-side. */
const getSession = () => {
    throwIfClientSide();

    const data = domain?.active?.insiteSession;
    if (!data) {
        throw new MissingDomainError("`setDomain` must be called before server-side session data can be accessed.");
    }

    return data;
};

export function setDisplayErrorPage(error: any) {
    throwIfClientSide();

    const session = getSession();
    session.errorStatusCode = (error && "status" in error && error.status) || -1;
    session.displayErrorPage = true;
}

export function getDisplayErrorPage() {
    return getSessionValue("displayErrorPage");
}

export function getErrorStatusCode() {
    return getSessionValue("errorStatusCode");
}

export function getInitialPage() {
    return getSessionValue("initialPage");
}

export function setInitialPage(result: RetrievePageResult, url: string) {
    setSessionValue("initialPage", {
        result,
        url,
    });
}

export function clearInitialPage() {
    setSessionValue("initialPage", undefined);
}

export function setStatusCode(statusCode: number) {
    setSessionValue("statusCode", statusCode);
}

export function getStatusCode() {
    return getSessionValue("statusCode");
}

export function setSSRIsWebCrawler(value: boolean) {
    setSessionValue("isWebCrawler", value);
}

export function getSSRIsWebCrawler() {
    return getSessionValue("isWebCrawler") ?? false;
}

export function setIsShareEntity(value: boolean) {
    setSessionValue("isShareEntity", value);
}

export function getIsShareEntity() {
    return getSessionValue("isShareEntity") ?? false;
}

export function setSessionCookies(cookies: SafeDictionary<string> | string | undefined) {
    const cookiesString = typeof cookies === "object" ? convertCookiesToString(cookies) : cookies;

    setSessionValue("cookies", cookiesString);
    if (typeof cookies === "object") {
        setSessionValue("cookiesDictionary", cookies);
    } else if (typeof cookies === "string") {
        const cookiesDictionary: SafeDictionary<string> = {};
        cookies.split(";").forEach(cookie => {
            const splitIndex = cookie.indexOf("=");
            const cookieName = cookie.substring(0, splitIndex).trim();
            const cookieValue = cookie.substring(splitIndex + 1);
            cookiesDictionary[cookieName] = cookieValue;
        });
        setSessionValue("cookiesDictionary", cookiesDictionary);
    }

    const { headers } = getSession();
    if (!headers) {
        return;
    }
    headers["cookie"] = cookiesString;
}

function convertCookiesToString(cookies: SafeDictionary<string>) {
    let cookiesString = "";
    Object.keys(cookies).forEach(cookieName => {
        cookiesString += `${cookieName}=${cookies[cookieName]}; `;
    });

    return cookiesString;
}

export function getSessionCookies() {
    if (IS_SERVER_SIDE === false) {
        return;
    }

    try {
        return getSession().cookiesDictionary;
    } catch (error) {
        if (error instanceof MissingDomainError) {
            logger.warn(
                "getCookie was called during Server Side Rendering before setDomain. Cookies are not currently available.",
            );
        } else {
            throw error;
        }
    }
}

/** Ensures that we have the url available when needed for server side rendering */
export function setUrl(url: string) {
    if (IS_SERVER_SIDE === false) {
        return;
    }

    const session = getSession();

    if (session.url) {
        // Indicates a program flow problem.
        throw new Error(`URL can only be set once, already set to ${session.url}`);
    }

    session.url = new URL(url);
    session.trackedPromises = [];
}

export function getUrl() {
    return getSessionValue("url");
}

/** The list of tracked promises that are blocking SSR completion. */
export function getTrackedPromises() {
    return getSessionValue("trackedPromises");
}

/** Sets a calback that receives notifications when promises are added. */
export function setPromiseAddedCallback(promiseAddedCallback: (stack: string) => void) {
    setSessionValue("promiseAddedCallback", promiseAddedCallback);
}

export function setHeaders(headers: SafeDictionary<string | string[]>) {
    setSessionValue("headers", headers);
}

export function setServerPageMetadata(metadata: PreparedMetadata) {
    setSessionValue("pageMetadata", metadata);
}

export function getPageMetadata() {
    return getSessionValue("pageMetadata");
}

/**
 * @deprecated Use setHeaders to store all headers instead
 */
export function setUserAgent(userAgent?: string) {
    setSessionValue("userAgent", userAgent);
    const { headers } = getSession();
    if (!headers) {
        return;
    }
    headers["user-agent"] = userAgent;
}

function getSessionValue<P extends keyof InsiteSession>(property: P) {
    if (!IS_SERVER_SIDE) {
        return;
    }

    return getSession()[property];
}

function setSessionValue<P extends keyof InsiteSession, V extends InsiteSession[P]>(property: P, value: V) {
    if (!IS_SERVER_SIDE) {
        return;
    }

    getSession()[property] = value;
}

/** Used in place of `history.push` when server-side rendering. */
export function redirectTo(location: string) {
    getSession().redirectTo = location;
}

/** Retrieves a redirect destination previously received via `redirectTo`. */
export const getRedirectTo = () => getSession().redirectTo;

/** Adds a promise to the tracking list, blocking SSR return until completion. */
export function addTask(promise: Promise<any>) {
    if (IS_SERVER_SIDE === false) {
        return;
    }

    const promiseAddedCallback = getSession().promiseAddedCallback;
    if (promiseAddedCallback) {
        let stack = new Error().stack;

        if (stack) {
            stack = stack.substring(5).split("    at ").slice(2).join(" ").trim();
            promiseAddedCallback(stack);
        }
    }

    getSession().trackedPromises.push(promise);
}

/** An implementation of the popular `fetch` API with accommodations  for Node-based server-side rendering. */
export const fetch: typeof window.fetch = (input, init) => {
    if (IS_SERVER_SIDE === false) {
        return window.fetch(input, init);
    }

    const { url, headers } = getSession();
    if (!url) {
        throw new Error("`setUrl` must be called before server-side fetch can be used.");
    }

    let preparedInput: typeof input = input;
    let requestUrl: string;
    let sendCookies = false;
    if (typeof preparedInput === "string") {
        if (!preparedInput.toLowerCase().startsWith("http")) {
            preparedInput =
                process.env.ISC_API_URL + (preparedInput.startsWith("/") ? preparedInput : `/${preparedInput}`);
        }
        requestUrl = preparedInput;
    } else {
        if (!preparedInput.url.toLowerCase().startsWith("http")) {
            preparedInput = { ...preparedInput, url: process.env.ISC_API_URL + preparedInput.url };
        }
        requestUrl = preparedInput.url;
    }

    if (requestUrl.toLowerCase().startsWith(process.env.ISC_API_URL!.toLowerCase())) {
        sendCookies = true;
    }

    let preparedInit = init;
    if (!preparedInit) {
        preparedInit = {};
    }
    if (!preparedInit.headers) {
        preparedInit.headers = {};
    }

    const preparedHeaders = preparedInit.headers as any;

    for (const key in headers) {
        // Naively forwarding all headers can conflict with Node/Express behavior.
        switch (key) {
            case "host":
            case "origin":
            case "referer":
            case "accept": // Crawlers have been found sending problematic Accept headers, breaking API calls.
                continue;
        }

        if (key === "cookie" && !sendCookies) {
            continue;
        }

        if (typeof preparedHeaders[key] !== "undefined") {
            continue;
        }

        preparedHeaders[key] = headers[key];
    }

    preparedInit.referrer = url.href;
    // node-fetch does not currently support setting referrer, we should fall back to looking for this if we can't find a referrer
    preparedHeaders["x-referer"] = url.href;
    preparedHeaders["x-forwarded-host"] = url.host;

    logger.debug(`making request ${JSON.stringify(preparedInput)}`);

    return (global as any).fetch(preparedInput, preparedInit);
};
