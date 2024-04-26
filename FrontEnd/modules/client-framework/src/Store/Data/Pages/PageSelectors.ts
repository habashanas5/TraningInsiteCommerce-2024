import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getById } from "@insite/client-framework/Store/Data/DataState";
import { nullPage, PagesState } from "@insite/client-framework/Store/Data/Pages/PagesState";
import PageProps, { cleanPage, PageModel } from "@insite/client-framework/Types/PageProps";

interface HasPagesState {
    data: {
        pages: PagesState;
    };
}

export function getCurrentPage(state: HasPagesState) {
    return getPageStateByPath(state, state.data.pages.location.pathname).value || nullPage;
}

export function getPageStateByPath(state: HasPagesState, path: string) {
    const indexOf = path.indexOf("?");
    const realPath = indexOf > -1 ? path.substring(0, indexOf) : path;
    return getById(state.data.pages, realPath, o => state.data.pages.idByPath[o.toLowerCase()] || "");
}

export function getRequiresAuthorization(state: HasPagesState, pageId: string) {
    return state.data.pages.requiresAuthorizationByPageId[pageId];
}

export function getAlternateLanguageUrls(state: HasPagesState, pageId: string) {
    return state.data.pages.alternateLanguageUrlsByPageId[pageId];
}

export function getFooter(state: ApplicationState) {
    return getPageStateByType(state, "Footer").value || nullPage;
}

export function getHeader(state: ApplicationState) {
    return getPageStateByType(state, "Header").value || nullPage;
}

export function getLocation(state: ApplicationState) {
    return state.data.pages.location;
}

export function getLocationPathAndQuery(state: ApplicationState) {
    const { pathname, search } = getLocation(state);
    return pathname + search;
}

export function getPageStateByType(state: ApplicationState, type: string) {
    return getById(state.data.pages, state.data.pages.idByType[type]);
}

export function getReturnUrl(state: ApplicationState) {
    const { search } = getLocation(state);
    const query = parseQueryString<{ returnUrl?: string; returnurl?: string }>(search);
    const returnUrl = query.returnUrl || query.returnurl;
    return removeAbsoluteUrl(returnUrl);
}

export function removeAbsoluteUrl(returnUrl: string | undefined) {
    if (returnUrl && (returnUrl[0] !== "/" || returnUrl[1] === "/" || returnUrl[1] === "\\")) {
        returnUrl = "";
    }

    return returnUrl;
}
