import AppThunkAction from "@insite/client-framework/Common/AppThunkAction";
import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";
import { trackPageChange } from "@insite/client-framework/Common/Utilities/tracking";
import { sendToShell } from "@insite/client-framework/Components/ShellHole";
import { Location } from "@insite/client-framework/Components/SpireRouter";
import { loadMobileComponents } from "@insite/client-framework/Internal";
import logger from "@insite/client-framework/Logger";
import {
    addTask,
    clearInitialPage,
    getInitialPage,
    redirectTo as performRedirectTo,
    setStatusCode,
} from "@insite/client-framework/ServerSideRendering";
import {
    BasicLanguageModel as ActualBasicLanguageModel,
    getContentByVersionPath,
    getPageByType,
    getPageByUrl,
    getPageByVersion,
    getPagesByParent,
    GetPagesByParentApiParameter,
    RetrievePageResult,
} from "@insite/client-framework/Services/ContentService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import {
    getPageStateByPath,
    getPageStateByType,
    getRequiresAuthorization,
} from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import { AnyAction } from "@insite/client-framework/Store/Reducers";
import { PageDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import { FieldType } from "@insite/client-framework/Types/FieldDefinition";
import PageProps, { PageModel } from "@insite/client-framework/Types/PageProps";
import { History } from "@insite/mobius/utilities/HistoryContext";

export const beginDraggingWidget = (id: string): AnyAction => ({
    type: "Data/Pages/BeginDraggingWidget",
    id,
});

export const endDraggingWidget = (): AnyAction => ({
    type: "Data/Pages/EndDraggingWidget",
});

export const resetPageDataViews = (): AnyAction => ({
    type: "Data/Pages/ResetDataViews",
});

export const changeContext =
    (languageId: string, personaId: string, deviceType: DeviceType): AppThunkAction =>
    (dispatch, getState) => {
        const { currentLanguageId, currentPersonaIds, currentDeviceType, defaultLanguageId, defaultPersonaId } =
            getContextData(getState());

        dispatch({
            type: "Data/Pages/CompleteChangeContext",
            languageId: languageId || currentLanguageId,
            personaId: personaId || currentPersonaIds[0],
            deviceType: deviceType || currentDeviceType,
            defaultLanguageId,
            defaultPersonaId,
        });
    };

export const loadPageByType =
    (type: string): AppThunkAction =>
    (dispatch, getState) => {
        addTask(
            (async function () {
                dispatch({
                    type: "Data/Pages/BeginLoadPage",
                    key: type,
                });

                const state = getState();
                const result = await getPageByType(type);

                dispatch({
                    type: "Data/Pages/CompleteLoadPage",
                    page: result.page,
                    pageType: type,
                    ...getContextData(state),
                });
            })(),
        );
    };

export const loadPagesForParent =
    (parameter: GetPagesByParentApiParameter): AppThunkAction =>
    (dispatch, getState) => {
        const tempParameter = { parentNodeId: parameter.parentNodeId };

        addTask(
            (async function () {
                dispatch({
                    type: "Data/Pages/BeginLoadPages",
                    parameter: tempParameter,
                });

                const pages = await getPagesByParent(tempParameter);

                dispatch({
                    type: "Data/Pages/CompleteLoadPages",
                    parameter: tempParameter,
                    collection: pages,
                    links: getState().links,
                    ...getContextData(getState()),
                });
            })(),
        );
    };

export const updatePage = (page: PageModel): AnyAction => ({
    type: "Data/Pages/UpdatePage",
    page,
});

export const loadPage =
    (location: Location, history?: History, onSuccess?: () => void): AppThunkAction =>
    (dispatch, getState) => {
        addTask(
            (async function () {
                const url = location.pathname + location.search;

                const finishedLoadingPage = (page: PageProps) => {
                    sendToShell({
                        type: "LoadPageComplete",
                        pageId: page.id,
                        parentId: page.parentId,
                        layoutPageId: page.layoutPageId,
                    });
                    dispatch({
                        type: "Data/Pages/SetLocation",
                        location,
                    });
                    onSuccess?.();

                    const state = getState();
                    if (state.pages && state.context) {
                        // product list and product details call trackPageChange when they get data
                        if (
                            page.type !== "ProductListPage" &&
                            page.type !== "ProductDetailsPage" &&
                            page.type !== "CategoryDetailsPage"
                        ) {
                            trackPageChange();
                        }
                    }
                };

                const dispatchCompleteLoadPage = (page: PageModel) => {
                    dispatch({
                        type: "Data/Pages/CompleteLoadPage",
                        page,
                        path: location.pathname,
                        ...getContextData(getState()),
                    });
                };

                const currentState = getState();
                const existingPage = getPageStateByPath(currentState, location.pathname);

                // if a page requiresAuthorization we want to reload them in case the user has signed in
                // so bypass the finished call
                if (existingPage.value && !getRequiresAuthorization(currentState, existingPage.value.id)) {
                    finishedLoadingPage(existingPage.value);
                    return;
                }

                dispatch({
                    type: "Data/Pages/BeginLoadPage",
                    key: location.pathname,
                });

                let retrievePageResult: RetrievePageResult | undefined;
                const bypassFilters = url.startsWith("/Content/Page/");

                try {
                    const initialPage = getInitialPage();

                    if (initialPage && initialPage.result && url === initialPage.url) {
                        retrievePageResult = initialPage.result;
                        clearInitialPage();
                    } else if (location.pathname === getContentByVersionPath) {
                        if (IS_SERVER_SIDE) {
                            throw new Error("Server-side rendering is supposed to be disabled for this request.");
                        }

                        const pageVersion = await getPageByVersion(
                            parseQueryString<{ pageVersionId: string }>(location.search).pageVersionId,
                        );

                        if (pageVersion.type.startsWith("Mobile/")) {
                            await loadMobileComponents();
                        }

                        dispatchCompleteLoadPage(pageVersion);
                        finishedLoadingPage(pageVersion);
                        return;
                    } else {
                        retrievePageResult = await getPageByUrl(url, bypassFilters);
                    }
                } catch (ex) {
                    logger.error(ex);
                    const pageLink = getPageLinkByPageType(getState(), "UnhandledErrorPage");
                    if (pageLink) {
                        performRedirectTo(pageLink.url);
                    }
                    return;
                }

                const {
                    statusCode,
                    redirectTo,
                    page,
                    authorizationFailed,
                    bypassedAuthorization,
                    isAuthenticatedOnServer,
                    requiresAuthorization,
                    alternateLanguageUrls,
                } = retrievePageResult;

                if (bypassedAuthorization && page) {
                    dispatch({
                        type: "Data/Pages/SetBypassedAuthorization",
                        pageId: page.id,
                    });
                }

                if (page) {
                    dispatch({
                        type: "Data/Pages/SetRequiresAuthorization",
                        pageId: page.id,
                        requiresAuthorization,
                    });
                    dispatch({
                        type: "Data/Pages/SetAlternateLanguageUrls",
                        pageId: page.id,
                        alternateLanguageUrls: alternateLanguageUrls ?? undefined,
                    });
                }

                setStatusCode(statusCode);

                const session = getState().context?.session;

                if (redirectTo) {
                    const isAuthenticated =
                        session && (session.isAuthenticated || session.rememberMe) && !session.isGuest;
                    if (IS_SERVER_SIDE) {
                        performRedirectTo(redirectTo);
                    } else if (redirectTo.startsWith("http") || (authorizationFailed && isAuthenticated)) {
                        // authorizationFailed may mean auth session timed out - do a full refresh to update the header etc
                        window.location.href = redirectTo;
                    } else if (history) {
                        history.push(redirectTo);
                    }
                } else if (page) {
                    const hasPageByType = getPageStateByType(currentState, page.type).value?.id === page.id;
                    if (!IS_SERVER_SIDE && !isAuthenticatedOnServer && session?.isAuthenticated === true) {
                        // in case user opens page that does not require authentication
                        window.location.reload();
                    } else if (hasPageByType) {
                        dispatch({
                            type: "Data/Pages/SetPageIsLoaded",
                            pageType: page.type,
                            page,
                            path: location.pathname,
                        });
                    } else {
                        dispatchCompleteLoadPage(page);
                    }

                    finishedLoadingPage(page);
                }
            })(),
        );
    };

export const setPageDefinitions = (
    pageDefinitionsByType: SafeDictionary<Pick<PageDefinition, "pageType">>,
): AnyAction => ({
    type: "Data/Pages/PageDefinitions",
    pageDefinitionsByType,
});

function getContextData(state: ApplicationState) {
    const { context } = state;
    if (context) {
        // determines if we are working in the public site
        const { website, session } = context;

        const defaultLanguages = website.languages!.languages!.filter(o => o.isDefault);
        const defaultPersonas = session.personas!.filter(o => o.isDefault);
        return {
            defaultLanguageId: defaultLanguages.length > 0 ? defaultLanguages[0].id : emptyGuid,
            currentLanguageId: session.language!.id,
            currentPersonaIds: session.personas ? session.personas.map(o => o.id) : [],
            currentDeviceType: session.deviceType as DeviceType,
            defaultPersonaId: defaultPersonas.length > 0 ? defaultPersonas[0].id : emptyGuid,
        };
    }

    // otherwise we are working in the shell so we need some hacky code
    const { defaultLanguageId, currentLanguageId, currentPersonaId, currentDeviceType, defaultPersonaId } = (
        state as any
    ).shellContext as ShellContext;
    return {
        defaultLanguageId,
        currentLanguageId,
        currentPersonaIds: [currentPersonaId],
        currentDeviceType,
        defaultPersonaId,
    };
}

interface ShellContext {
    defaultLanguageId: string;
    currentLanguageId: string;
    currentPersonaId: string;
    defaultPersonaId: string;
    currentDeviceType: DeviceType;
}

// this had to move to ContentService to avoid a circular dependency.
export interface BasicLanguageModel extends ActualBasicLanguageModel {}

export interface UpdateFieldParameter {
    id: string;
    fieldName: string;
    value: any;
    fieldType: FieldType;
    language: BasicLanguageModel;
    defaultLanguageId: string;
    personaId: string;
    defaultPersonaId: string;
    deviceType: DeviceType;
}
