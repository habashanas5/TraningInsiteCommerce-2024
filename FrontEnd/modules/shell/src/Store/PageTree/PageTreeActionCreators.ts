import sleep from "@insite/client-framework/Common/Sleep";
import { Dictionary } from "@insite/client-framework/Common/Types";
import { addTask } from "@insite/client-framework/ServerSideRendering";
import { getPageByUrl } from "@insite/client-framework/Services/ContentService";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { loadPageLinks } from "@insite/client-framework/Store/Links/LinksActionCreators";
import { PageModel } from "@insite/client-framework/Types/PageProps";
import { sendToSite } from "@insite/shell/Components/Shell/SiteHole";
import {
    addPage as addPageApi,
    deletePage as deletePageApi,
    deleteVariant as deleteVariantApi,
    getPageStates,
    getReorderingPages,
    getTreeFilters,
    makeDefaultVariant,
    PageReorderModel,
    SavePageResponseModel,
    saveReorderPages as saveReorderPagesApi,
    TreeFilterModel,
} from "@insite/shell/Services/ContentAdminService";
import { setupPageModel } from "@insite/shell/Services/PageCreation";
import { getTemplate } from "@insite/shell/Services/SpireService";
import { loadPageIfNeeded } from "@insite/shell/Store/Data/Pages/PagesActionCreators";
import { showErrorModal } from "@insite/shell/Store/ErrorModal/ErrorModalActionCreator";
import { editPageOptions, savePage } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import { AnyShellAction } from "@insite/shell/Store/Reducers";
import ShellThunkAction from "@insite/shell/Store/ShellThunkAction";
import { History } from "history";

export const loadFiltersForQuery =
    (query: string): ShellThunkAction =>
    dispatch => {
        addTask(
            (async function () {
                dispatch({
                    type: "PageTree/BeginLoadFiltersForQuery",
                    query,
                });

                if (query === "") {
                    dispatch({
                        type: "PageTree/LoadFiltersForQueryComplete",
                        treeFilters: [],
                        totalResults: 0,
                        query,
                    });
                    return;
                }

                const treeFilterCollection = await getTreeFilters(query);
                dispatch({
                    type: "PageTree/LoadFiltersForQueryComplete",
                    treeFilters: treeFilterCollection.filters,
                    totalResults: treeFilterCollection.totalResults,
                    query,
                });
            })(),
        );
    };

export const addFilter =
    (treeFilter: TreeFilterModel): ShellThunkAction =>
    dispatch => {
        dispatch({
            treeFilter,
            type: "PageTree/AddFilter",
        });

        dispatch(loadTreeNodes());
    };

export const removeFilter =
    (treeFilter: TreeFilterModel): ShellThunkAction =>
    dispatch => {
        dispatch({
            treeFilter,
            type: "PageTree/RemoveFilter",
        });

        dispatch(loadTreeNodes());
    };

export const clearFilters = (): ShellThunkAction => dispatch => {
    dispatch({
        type: "PageTree/ClearFilters",
    });

    dispatch(loadTreeNodes());
};

export const loadTreeNodes = (): ShellThunkAction => (dispatch, getState) => {
    addTask(
        (async function () {
            const pageStates = await getPageStates(getState().pageTree.appliedTreeFilters);
            dispatch({
                type: "PageTree/LoadPageStatesComplete",
                pageStates,
            });
        })(),
    );
};

export const openAddPage =
    (parentId: string, parentType: string): ShellThunkAction =>
    dispatch => {
        dispatch({
            parentId,
            parentType,
            type: "PageTree/OpenAddPage",
        });
    };

export const openAddLayout = (): ShellThunkAction => dispatch => {
    dispatch({
        isLayout: true,
        parentType: "",
        type: "PageTree/OpenAddPage",
    });
};

export const openCopyPage =
    (parentId: string, pageId: string, nodeDisplayName: string, nodePageType: string): ShellThunkAction =>
    dispatch => {
        dispatch({
            parentId,
            pageId,
            nodeDisplayName,
            nodePageType,
            type: "PageTree/OpenCopyPage",
        });
    };

export const openCreateVariant =
    (parentId: string, pageId: string, nodeDisplayName: string, nodePageType: string): ShellThunkAction =>
    dispatch => {
        dispatch({
            parentId,
            pageId,
            nodeDisplayName,
            nodePageType,
            type: "PageTree/OpenCreateVariant",
        });
    };

export const openMakeDefaultVariant =
    (parentId: string, pageId: string): ShellThunkAction =>
    dispatch => {
        dispatch({
            parentId,
            pageId,
            type: "PageTree/OpenMakeDefaultVariant",
        });
    };

export const closeMakeDefaultVariant = (): ShellThunkAction => dispatch => {
    dispatch({
        type: "PageTree/CloseMakeDefaultModal",
    });
};

export const openRulesEdit = (pageId: string, isNewVariant?: boolean): AnyShellAction => ({
    type: "PageTree/OpenRulesEdit",
    pageId,
    isNewVariant,
});

export const closeRulesEdit = (): ShellThunkAction => dispatch => {
    dispatch({
        type: "PageTree/CloseRulesEdit",
    });
};

export const updateDefaultVariantRoot =
    (parentId?: string, pageId?: string): ShellThunkAction =>
    dispatch => {
        if (pageId) {
            makeDefaultVariant(pageId).then(() => {
                if (parentId) {
                    dispatch({
                        parentId,
                        pageId,
                        type: "PageTree/UpdateDefaultVariantRoot",
                    });
                }
                dispatch({
                    type: "PageTree/CloseMakeDefaultModal",
                });
            });
        }
    };

export const setExpandedNodes =
    (expandedNodes: Dictionary<boolean>): ShellThunkAction =>
    dispatch => {
        dispatch({
            expandedNodes,
            type: "PageTree/SetExpandedNodes",
        });
    };

export interface AddPageParameter {
    pageType: string;
    pageName: string;
    parentId: string;
    copyPageId?: string;
    pageTemplate: string;
    isVariant: boolean;
    copyVariantContent: boolean;
    layoutId: string;
    allowedForPageType: string;
    layoutPageName?: string;
    afterSavePage?: (response: SavePageResponseModel) => void;
}

export const addPage =
    (parameter: AddPageParameter): ShellThunkAction =>
    (dispatch, getState) => {
        (async () => {
            let pageModel: PageModel;

            if (parameter.copyPageId) {
                const url = `/Content/Page/${parameter.copyPageId}`;
                const { page } = await getPageByUrl(url, true);
                if (!page) {
                    throw new Error(`Getting the page by the URL '${url}' unexpectedly did not return a page.`);
                }
                pageModel = page;
            } else {
                pageModel = await getTemplate(parameter.pageType, parameter.pageTemplate);
            }

            const { currentLanguageId, currentPersonaId, websiteId, languagesById, defaultPersonaId } =
                getState().shellContext;

            if ((parameter.isVariant && !parameter.copyVariantContent) || parameter.layoutId) {
                pageModel.widgets = [];
            }

            setupPageModel(
                pageModel,
                parameter.pageName,
                parameter.pageName.replace(/ /g, ""),
                parameter.parentId,
                -1,
                languagesById[currentLanguageId]!,
                currentPersonaId,
                defaultPersonaId,
                websiteId,
                parameter.isVariant,
            );

            pageModel.layoutPageId = parameter.layoutId;
            if (parameter.layoutPageName) {
                pageModel.generalFields["layoutPage"] = parameter.layoutPageName;
            }
            const isLayout = pageModel.type === "Layout";

            if (isLayout) {
                pageModel.generalFields["allowedForPageType"] = parameter.allowedForPageType;
            }

            const savePageResponse = await addPageApi(pageModel, parameter.isVariant);
            if (!savePageResponse.duplicatesFound) {
                if (parameter.isVariant || isLayout) {
                    const finished = () => {
                        dispatch(
                            savePage(parameter.isVariant, ({ duplicatesFound }) => {
                                if (duplicatesFound) {
                                    dispatch(showErrorModal("A variant with this name already exists."));
                                    return;
                                }

                                dispatch(loadTreeNodes());

                                dispatch({
                                    type: "PageTree/AddPageComplete",
                                });

                                if (parameter.isVariant) {
                                    dispatch(openRulesEdit(pageModel.id, true));
                                }
                            }),
                        );
                    };

                    dispatch(loadPageIfNeeded(pageModel.id, finished));
                } else {
                    dispatch(
                        editPageOptions(pageModel.id, false, true, () => {
                            dispatch({
                                type: "PageTree/AddPageComplete",
                            });
                        }),
                    );
                }
            } else {
                dispatch(
                    showErrorModal(
                        parameter.isVariant || isLayout
                            ? `A ${isLayout ? "layout" : "variant"} with this name already exists.`
                            : "A page with this URL already exists. Please try a different page title or position.",
                    ),
                );
            }

            parameter.afterSavePage?.(savePageResponse);
        })();
    };

export const cancelAddPage = (): AnyShellAction => ({
    type: "PageTree/CancelAddPage",
});

export const deletePage =
    (nodeId: string, history: History, pageId?: string): ShellThunkAction =>
    (dispatch, getState) => {
        addTask(
            (async function () {
                if (pageId) {
                    await deleteVariantApi(nodeId, pageId);
                } else {
                    const response = await deletePageApi(nodeId);
                    if (response.layoutInUse) {
                        dispatch(
                            showErrorModal("This layout is currently being used by a page and may not be deleted."),
                        );
                    }
                }

                dispatch({
                    type: "PageTree/DeletePageComplete",
                });

                dispatch(loadPageLinks());
                sendToSite({ type: "ReloadPageLinks" });
                sendToSite({ type: "ResetPageDataViews" });

                dispatch(loadTreeNodes());

                if (nodeId === getCurrentPage(getState()).nodeId) {
                    history.push(`/ContentAdmin/Page/${getState().shellContext.homePageId}`);
                }
            })(),
        );
    };

export const openReorderPages =
    (nodeId?: string): ShellThunkAction =>
    dispatch => {
        addTask(
            (async function () {
                dispatch({
                    type: "PageTree/OpenReorderPages",
                });

                const result = await getReorderingPages(nodeId);

                dispatch({
                    ...result,
                    nodeId,
                    type: "PageTree/LoadReorderPagesComplete",
                });
            })(),
        );
    };

export const cancelReorderPages = (): AnyShellAction => ({
    type: "PageTree/CancelReorderPages",
});

export const toggleFilterToMobile = (): AnyShellAction => ({
    type: "PageTree/ToggleFilterToMobile",
});

export const saveReorderPages =
    (pages: PageReorderModel[]): ShellThunkAction =>
    dispatch => {
        (async () => {
            dispatch({
                type: "PageTree/BeginSaveReorderPages",
            });

            const { duplicatesFound } = await saveReorderPagesApi(pages);
            if (duplicatesFound) {
                dispatch({
                    type: "PageTree/FailedSaveReorderPages",
                });

                dispatch(
                    showErrorModal(
                        "A page with this URL already exists. Please try a different page title or position.",
                    ),
                );
                return;
            }

            dispatch({
                type: "PageTree/CompleteSaveReorderPages",
            });

            dispatch(loadPageLinks());
            sendToSite({ type: "ReloadPageLinks" });

            dispatch(loadTreeNodes());
        })();
    };
