import { AddWidgetData } from "@insite/client-framework/Common/FrameHole";
import { addTask } from "@insite/client-framework/ServerSideRendering";
import { autocompleteSearch } from "@insite/client-framework/Services/AutocompleteService";
import { loadPage } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { loadPageLinks } from "@insite/client-framework/Store/Links/LinksActionCreators";
import { sendToSite } from "@insite/shell/Components/Shell/SiteHole";
import { AdminODataApiParameter, getAdminBrands } from "@insite/shell/Services/AdminService";
import { findNodeIdNames } from "@insite/shell/Services/ContentAdminPagesService";
import {
    getBrands,
    getCategories,
    getPageStateFromDictionaries,
    savePage as savePageApi,
    SavePageResponseModel,
} from "@insite/shell/Services/ContentAdminService";
import { loadPageIfNeeded } from "@insite/shell/Store/Data/Pages/PagesActionCreators";
import { updatePageOnSite } from "@insite/shell/Store/Data/Pages/PagesHelpers";
import { showErrorModal } from "@insite/shell/Store/ErrorModal/ErrorModalActionCreator";
import { loadTreeNodes } from "@insite/shell/Store/PageTree/PageTreeActionCreators";
import { loadPublishInfo } from "@insite/shell/Store/PublishModal/PublishModalActionCreators";
import { AnyShellAction } from "@insite/shell/Store/Reducers";
import { getStorablePage } from "@insite/shell/Store/ShellSelectors";
import ShellThunkAction from "@insite/shell/Store/ShellThunkAction";
import { push } from "connected-react-router";
import cloneDeep from "lodash/cloneDeep";

export const selectProduct = (path: string): AnyShellAction => ({
    productPath: path,
    type: "PageEditor/SelectProduct",
});

export const searchProducts =
    (search: string): ShellThunkAction =>
    dispatch => {
        addTask(
            (async function () {
                const autocompleteModel = await autocompleteSearch({
                    query: search,
                });

                dispatch({
                    type: "PageEditor/CompleteProductSearch",
                    productSearchResults: autocompleteModel.products!.map(o => ({
                        path: o.url,
                        id: o.id!,
                        displayName: o.title,
                    })),
                });
            })(),
        );
    };

export const clearModelSelection = (): AnyShellAction => ({
    type: "PageEditor/ClearModelSelection",
});

export const selectBrand = (path: string): AnyShellAction => ({
    brandPath: path,
    type: "PageEditor/SelectBrand",
});

export const searchBrands =
    (search: string): ShellThunkAction =>
    dispatch => {
        addTask(
            (async function () {
                const autocompleteModel = await autocompleteSearch({
                    query: search,
                });

                dispatch({
                    type: "PageEditor/CompleteBrandSearch",
                    brandSearchResults: autocompleteModel.brands!.map(o => ({
                        path: o.url,
                        id: o.id!,
                        displayName: o.productLineName ? `${o.productLineName} in ${o.title}` : o.title,
                    })),
                });
            })(),
        );
    };

export const loadBrands = (): ShellThunkAction => dispatch => {
    addTask(
        (async function () {
            const brands = await getBrands();

            dispatch({
                brands,
                type: "PageEditor/CompleteLoadBrands",
            });
        })(),
    );
};

export const loadSelectBrands =
    (parameter?: AdminODataApiParameter): ShellThunkAction =>
    dispatch => {
        addTask(
            (async function () {
                const brands = await getAdminBrands(parameter);

                dispatch({
                    brands,
                    type: "PageEditor/CompleteLoadSelectBrands",
                });
            })(),
        );
    };

export const loadSelectedBrands =
    (parameter?: AdminODataApiParameter): ShellThunkAction =>
    dispatch => {
        addTask(
            (async function () {
                const brands = await getAdminBrands(parameter);

                dispatch({
                    brands,
                    type: "PageEditor/CompleteLoadSelectedBrands",
                });
            })(),
        );
    };

export const selectCategory = (path: string): AnyShellAction => ({
    categoryPath: path,
    type: "PageEditor/SelectCategory",
});

export const searchCategories =
    (search: string): ShellThunkAction =>
    dispatch => {
        addTask(
            (async function () {
                const autocompleteModel = await autocompleteSearch({
                    query: search,
                });

                dispatch({
                    type: "PageEditor/CompleteCategorySearch",
                    categorySearchResults: autocompleteModel.categories!.map(o => ({
                        path: o.url,
                        id: o.id!,
                        displayName: o.title,
                    })),
                });
            })(),
        );
    };

export const loadCategories = (): ShellThunkAction => dispatch => {
    addTask(
        (async function () {
            const categories = await getCategories();

            dispatch({
                categories,
                type: "PageEditor/CompleteLoadCategories",
            });
        })(),
    );
};

export const savePage =
    (isVariant?: boolean, afterSavePage?: (response: SavePageResponseModel) => void): ShellThunkAction =>
    (dispatch, getState) => {
        (async () => {
            const state = getState();
            const { shellContext } = state;
            const currentPage = getCurrentPage(state);
            const storablePage = getStorablePage(state, shellContext.websiteId);

            if (storablePage.generalFields["variantName"]) {
                storablePage.variantName = storablePage.generalFields["variantName"];
            }

            if (isVariant === undefined) {
                const pageState = getPageStateFromDictionaries(
                    storablePage.id,
                    state.pageTree.treeNodesByParentId,
                    state.pageTree.headerTreeNodesByParentId,
                    state.pageTree.footerTreeNodesByParentId,
                    state.pageTree.mobileTreeNodesByParentId,
                );

                if (pageState?.isVariant || pageState?.isRootVariant) {
                    isVariant = true;
                }
            }

            if (storablePage.layoutPageId) {
                storablePage.widgets = storablePage.widgets.filter(o => !o.isLayout);
            }
            const savePageResponse = await savePageApi(storablePage, !!isVariant);

            // just in case the siteFrame got out of sync, send the new page one last time
            updatePageOnSite(getState());

            // needed to clean out any child page collections (news list displays child pages). Ideally this would only happen when we add a new page
            // but if we do it in addPage it happens too soon and the news list will reload the old collection
            // and we don't have a way to differentiate saving a page vs saving a new page here
            sendToSite({ type: "ResetPageDataViews" });

            if (storablePage.type === "Layout") {
                dispatch({
                    type: "PageEditor/LayoutUpdated",
                    id: storablePage.id,
                });
            }

            dispatch(loadPublishInfo(currentPage.id));

            dispatch(loadPageLinks());
            sendToSite({ type: "ReloadPageLinks" });

            afterSavePage?.(savePageResponse);
        })();
    };

export const editPageOptions =
    (id: string, isVariant?: boolean, isNewPage?: boolean, afterEditLoads?: () => void): ShellThunkAction =>
    (dispatch, getState) => {
        const finished = () => {
            const page = getCurrentPage(getState());
            dispatch({
                type: "PageEditor/EditItem",
                id: page.id,
                item: page,
                isNewPage,
                isVariant,
            });

            if (afterEditLoads) {
                afterEditLoads();
            }
        };

        dispatch(loadPageIfNeeded(id, finished));
    };

export const editWidget =
    (id: string, removeIfCanceled?: boolean): ShellThunkAction =>
    (dispatch, getState) => {
        dispatch({
            type: "PageEditor/EditItem",
            id,
            removeIfCanceled,
            item: getState().data.pages.widgetsById[id],
        });
    };

export const reloadPage =
    (pageId: string): ShellThunkAction =>
    dispatch => {
        dispatch({
            type: "PageEditor/LayoutUpdatedReset",
        });

        dispatch({
            type: "Data/Pages/Reset",
        });

        dispatch(loadPage({ pathname: `/Content/Page/${pageId}`, search: "" } as Location));
    };

export const doneEditingItem = (): ShellThunkAction => (dispatch, getState) => {
    const state = getState();
    let isVariant = false;

    if (!state.pageEditor.isEditingNewPage) {
        const pageId = getCurrentPage(state).id;
        const pageState = getPageStateFromDictionaries(
            pageId,
            state.pageTree.treeNodesByParentId,
            state.pageTree.headerTreeNodesByParentId,
            state.pageTree.footerTreeNodesByParentId,
            state.pageTree.mobileTreeNodesByParentId,
        );
        isVariant = !!pageState?.isVariant;
    }

    dispatch(
        savePage(isVariant, ({ duplicatesFound }) => {
            if (duplicatesFound) {
                dispatch(
                    showErrorModal(
                        isVariant
                            ? "A variant with this name already exists."
                            : "A page with this URL already exists. Please try a different page title or position.",
                    ),
                );
                return;
            }

            dispatch({ type: "PageEditor/DoneEditingItem" });

            if (state.pageEditor.editingId === getCurrentPage(state).id) {
                dispatch(loadTreeNodes());
            }
        }),
    );
};

export const cancelEditingItem = (): ShellThunkAction => (dispatch, getState) => {
    if (getState().pageEditor.isEditingNewPage) {
        dispatch(push("/ContentAdmin/Page/"));
    }

    dispatch({
        type: "PageEditor/CancelEditingItem",
    });
};

export const openPageTemplateModal = (): ShellThunkAction => (dispatch, getState) => {
    addTask(
        (async function () {
            dispatch({
                type: "PageEditor/OpenPageTemplateModal",
                generatedPageTemplate: "Loading....",
            });

            const state = getState();
            const page = getStorablePage(state, state.shellContext.websiteId);
            // clone the page and remove any Guids we know won't be node ids to avoid extra work of trying to look them up server side
            const trimmedPage = cloneDeep(page);
            delete trimmedPage.nodeId;
            delete trimmedPage.parentId;
            delete trimmedPage.id;
            delete trimmedPage.websiteId;
            for (const widget of trimmedPage.widgets) {
                delete widget.id;
                delete widget.parentId;
            }

            const trimmedPageString = JSON.stringify(trimmedPage);
            const guidMatch = /([0-9A-F]{8}-(?:[0-9A-F]{4}-){3}[0-9A-F]{12})/gi;
            const possibleNodeIds = trimmedPageString.match(guidMatch);

            let pageString = JSON.stringify(page, null, 4);
            const replacements = await findNodeIdNames(possibleNodeIds as string[]);
            for (const replacement of replacements) {
                pageString = pageString.replace(new RegExp(replacement.id), `nodeIdFor('${replacement.name}')`);
            }

            dispatch({
                type: "PageEditor/OpenPageTemplateModal",
                generatedPageTemplate: pageString,
            });
        })(),
    );
};

export const closePageTemplateModal = (): AnyShellAction => ({
    type: "PageEditor/ClosePageTemplateModel",
});

export const displayAddWidgetModal = (data: AddWidgetData): AnyShellAction => ({
    type: "PageEditor/UpdateAddWidgetData",
    data,
});

export const hideAddWidgetModal = (): AnyShellAction => ({
    type: "PageEditor/UpdateAddWidgetData",
});
