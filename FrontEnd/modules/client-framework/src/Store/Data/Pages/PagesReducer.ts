import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { Location } from "@insite/client-framework/Components/SpireRouter";
import { GetPagesByParentApiParameter, PagesCollectionModel } from "@insite/client-framework/Services/ContentService";
import { setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { nullPage, PagesState } from "@insite/client-framework/Store/Data/Pages/PagesState";
import { createContextualIds, prepareFields } from "@insite/client-framework/Store/Data/Pages/PrepareFields";
import LinksState from "@insite/client-framework/Store/Links/LinksState";
import { PageDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";
import { DeviceType } from "@insite/client-framework/Types/ContentItemModel";
import PageProps, { PageModel } from "@insite/client-framework/Types/PageProps";
import { Draft } from "immer";

export const initialState: PagesState = {
    isLoading: {},
    byId: {
        [emptyGuid]: nullPage,
    },
    widgetIdsByPageId: {},
    widgetIdsByPageIdParentIdAndZone: {},
    widgetsById: {},
    idByType: {},
    idByPath: {},
    location: {
        pathname: "",
        search: "",
        state: "",
    },
    dataViews: {},
    bypassedAuthorization: {},
    requiresAuthorizationByPageId: {},
    alternateLanguageUrlsByPageId: {},
};

interface SetPageIsLoaded {
    path?: string;
    pageType?: string;
    page: PageModel;
}

type LoadPageCompleteAction = SetPageIsLoaded & HasContext;

interface HasContext {
    currentLanguageId: string;
    defaultLanguageId: string;
    currentPersonaIds: string[];
    defaultPersonaId: string;
    currentDeviceType: DeviceType;
}

export const reducer = {
    "Data/Pages/BeginLoadPages": (draft: Draft<PagesState>, action: { parameter: GetPagesByParentApiParameter }) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/Pages/CompleteLoadPages": (
        draft: Draft<PagesState>,
        action: {
            parameter: GetPagesByParentApiParameter;
            collection: PagesCollectionModel;
            links: LinksState;
        } & HasContext,
    ) => {
        const {
            parameter,
            collection,
            currentLanguageId,
            defaultLanguageId,
            currentPersonaIds,
            defaultPersonaId,
            currentDeviceType,
        } = action;

        const contextualIds = createContextualIds(
            currentLanguageId,
            defaultLanguageId,
            currentDeviceType,
            currentPersonaIds,
            defaultPersonaId,
        );

        for (const page of collection.pages) {
            finishLoadPage(draft, page, undefined, action, contextualIds);
        }

        setDataViewLoaded(draft, parameter, collection, collection => collection.pages as PageProps[]);
    },

    "Data/Pages/BeginLoadPage": (draft: Draft<PagesState>, action: { key: string }) => {
        draft.isLoading[action.key] = true;
    },

    "Data/Pages/UpdatePage": (draft: Draft<PagesState>, action: { page: PageModel }) => {
        finishLoadPage(draft, action.page, undefined, undefined, []);
    },

    "Data/Pages/CompleteLoadPage": (draft: Draft<PagesState>, action: LoadPageCompleteAction) => {
        const {
            page,
            currentLanguageId,
            defaultLanguageId,
            currentPersonaIds,
            defaultPersonaId,
            currentDeviceType,
            path,
            pageType,
        } = action;

        if (path) {
            draft.isLoading[path] = false;
        }
        if (pageType) {
            draft.isLoading[pageType] = false;
        }

        if (!page) {
            if (path) {
                draft.idByPath[path.toLowerCase()] = emptyGuid;
            }
            if (pageType) {
                draft.idByType[pageType] = emptyGuid;
            }

            return;
        }

        const contextualIds = createContextualIds(
            currentLanguageId,
            defaultLanguageId,
            currentDeviceType,
            currentPersonaIds,
            defaultPersonaId,
        );

        finishLoadPage(draft, page, path, action, contextualIds);
    },

    "Data/Pages/SetPageIsLoaded": (draft: Draft<PagesState>, { path, pageType, page }: SetPageIsLoaded) => {
        if (path) {
            draft.isLoading[path] = false;
            draft.idByPath[path.toLowerCase()] = page.id;
        }
        if (pageType) {
            draft.isLoading[pageType] = false;
        }
    },

    "Data/Pages/SetBypassedAuthorization": (draft: Draft<PagesState>, { pageId }: { pageId: string }) => {
        draft.bypassedAuthorization[pageId] = true;
    },

    "Data/Pages/SetRequiresAuthorization": (
        draft: Draft<PagesState>,
        { pageId, requiresAuthorization }: { pageId: string; requiresAuthorization: boolean },
    ) => {
        draft.requiresAuthorizationByPageId[pageId] = requiresAuthorization;
    },

    "Data/Pages/SetLocation": (draft: Draft<PagesState>, action: { location: Location }) => {
        draft.location = action.location;
    },

    "Data/Pages/Reset": (draft: Draft<PagesState>) => {
        return {
            ...initialState,
            location: draft.location,
        };
    },

    "Data/Pages/ResetDataViews": (draft: Draft<PagesState>) => {
        draft.dataViews = {};
    },

    "Data/Pages/BeginDraggingWidget": (draft: Draft<PagesState>, action: { id: string }) => {
        draft.draggingWidgetId = action.id;
    },

    "Data/Pages/EndDraggingWidget": (draft: Draft<PagesState>) => {
        draft.draggingWidgetId = undefined;
    },

    "Data/Pages/CompleteChangeContext": (
        draft: Draft<PagesState>,
        action: {
            languageId: string;
            personaId: string;
            deviceType: DeviceType;
            defaultLanguageId: string;
            defaultPersonaId: string;
        },
    ) => {
        const { languageId, defaultLanguageId, personaId, deviceType, defaultPersonaId } = action;

        const contextualIds = createContextualIds(
            languageId,
            defaultLanguageId,
            deviceType,
            [personaId],
            defaultPersonaId,
        );

        for (const pageId in draft.byId) {
            prepareFields(draft.byId[pageId], languageId, defaultLanguageId, contextualIds);
        }
        for (const widgetId in draft.widgetsById) {
            prepareFields(draft.widgetsById[widgetId], languageId, defaultLanguageId, contextualIds);
        }
    },

    "Data/Pages/PageDefinitions": (
        draft: Draft<PagesState>,
        action: { pageDefinitionsByType: SafeDictionary<Pick<PageDefinition, "pageType">> },
    ) => {
        draft.pageDefinitionsByType = action.pageDefinitionsByType;
    },

    "Data/Pages/SetAlternateLanguageUrls": (
        draft: Draft<PagesState>,
        { pageId, alternateLanguageUrls }: { pageId: string; alternateLanguageUrls: SafeDictionary<string> },
    ) => {
        draft.alternateLanguageUrlsByPageId[pageId] = alternateLanguageUrls;
    },
};

function finishLoadPage(
    draft: Draft<PagesState>,
    page: PageModel,
    path: string | undefined,
    action: HasContext | undefined,
    contextualIds: string[],
) {
    const { currentLanguageId, defaultLanguageId } = action ?? {};

    if (currentLanguageId && defaultLanguageId) {
        prepareFields(page, currentLanguageId, defaultLanguageId, contextualIds);
    }

    const { fields, generalFields } = page;
    if (fields) {
        fields["variantName"] = page.variantName;
        generalFields["variantName"] = page.variantName;
    }

    draft.widgetIdsByPageId[page.id] = [];
    draft.widgetIdsByPageIdParentIdAndZone[page.id] = {};
    const pageContent = draft.widgetIdsByPageIdParentIdAndZone[page.id];
    pageContent[page.id] = {};

    draft.byId[page.id] = page;
    draft.idByType[page.type] = page.id;
    if (path) {
        draft.idByPath[path.toLowerCase()] = page.id;
    }

    const { widgets } = page;
    delete page.widgets;

    if (!widgets) {
        return;
    }

    for (const widgetItem of widgets) {
        if (currentLanguageId && defaultLanguageId) {
            prepareFields(widgetItem, currentLanguageId, defaultLanguageId, contextualIds);
        }
        pageContent[widgetItem.id] = {};
    }

    for (const widgetItem of widgets) {
        draft.widgetsById[widgetItem.id] = widgetItem;
        draft.widgetIdsByPageId[page.id].push(widgetItem.id);
        const parentId = widgetItem.parentId;
        const zone = widgetItem.zone;

        if (typeof pageContent[parentId] === "undefined") {
            pageContent[parentId] = {};
        }

        if (typeof pageContent[parentId][zone] === "undefined") {
            pageContent[parentId][zone] = [];
        }

        pageContent[parentId][zone].push(widgetItem.id);
    }
}

export default createTypedReducerWithImmer(initialState, reducer);
