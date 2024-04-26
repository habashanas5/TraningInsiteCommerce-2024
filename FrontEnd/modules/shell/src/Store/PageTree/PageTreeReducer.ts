import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { Dictionary } from "@insite/client-framework/Common/Types";
import {
    getPageState,
    getPageStateFromDictionaries,
    PageReorderModel,
    PageStateModel,
    TreeFilterModel,
} from "@insite/shell/Services/ContentAdminService";
import { PageTreeState, TreeNodeModel } from "@insite/shell/Store/PageTree/PageTreeState";
import { Draft } from "immer";

const initialState: PageTreeState = {
    potentialTreeFilters: [],
    appliedTreeFilters: [],
    extraTreeFilterCount: 0,
    treeFiltersQuery: "",
    isLoadingFilters: false,
    treeNodesByParentId: {},
    headerTreeNodesByParentId: {},
    footerTreeNodesByParentId: {},
    mobileTreeNodesByParentId: {},
    layoutTreeNodesByParentId: {},
    neverPublishedNodeIds: {},
    futurePublishNodeIds: {},
    draftNodeIds: {},
    displayReorderPages: false,
    rootNodeId: emptyGuid,
    isVariantReorder: false,
    savingReorderPages: false,
    expandedNodes: {},
};

const reducer = {
    "PageTree/LoadPageStatesComplete": (
        draft: Draft<PageTreeState>,
        action: {
            pageStates: PageStateModel[];
        },
    ) => {
        draft.treeNodesByParentId = {};
        draft.headerTreeNodesByParentId = {};
        draft.footerTreeNodesByParentId = {};
        draft.mobileTreeNodesByParentId = {};
        draft.layoutTreeNodesByParentId = {};
        draft.neverPublishedNodeIds = {};
        draft.futurePublishNodeIds = {};
        draft.draftNodeIds = {};

        if (draft.appliedTreeFilters.length > 0) {
            draft.expandedNodes = {};
        }

        const insertNode = (treeNode: TreeNodeModel, toTheEnd = true) => {
            let targetNodes: TreeNodeModel[];
            if (treeNode.displayName === "Header") {
                if (!draft.headerTreeNodesByParentId[treeNode.parentId]) {
                    draft.headerTreeNodesByParentId[treeNode.parentId] = [];
                }

                targetNodes = draft.headerTreeNodesByParentId[treeNode.parentId];
            } else if (treeNode.displayName === "Footer") {
                if (!draft.footerTreeNodesByParentId[treeNode.parentId]) {
                    draft.footerTreeNodesByParentId[treeNode.parentId] = [];
                }

                targetNodes = draft.footerTreeNodesByParentId[treeNode.parentId];
            } else if (treeNode.type.startsWith("Mobile/")) {
                if (!draft.mobileTreeNodesByParentId[treeNode.parentId]) {
                    draft.mobileTreeNodesByParentId[treeNode.parentId] = [];
                }

                targetNodes = draft.mobileTreeNodesByParentId[treeNode.parentId];
            } else if (treeNode.type === "Layout") {
                if (!draft.layoutTreeNodesByParentId[treeNode.parentId]) {
                    draft.layoutTreeNodesByParentId[treeNode.parentId] = [];
                }

                targetNodes = draft.layoutTreeNodesByParentId[treeNode.parentId];
            } else {
                if (!draft.treeNodesByParentId[treeNode.parentId]) {
                    draft.treeNodesByParentId[treeNode.parentId] = [];
                }

                targetNodes = draft.treeNodesByParentId[treeNode.parentId];
            }

            if (toTheEnd) {
                targetNodes.push(treeNode);
            } else {
                targetNodes.unshift(treeNode);
            }
        };

        const draftPageIds: Dictionary<boolean> = {};
        const futurePublishPageIds: Dictionary<Date> = {};
        const neverPublishedPageIds: Dictionary<boolean> = {};
        const treeNodesByNodeId: Dictionary<TreeNodeModel[]> = {};
        const sharedNeverPublished = new Set();
        const sharedIsDraftPage = new Set();
        const sharedFuturePublishOn = new Set();

        for (const pageState of action.pageStates) {
            if (pageState.displayName === "Home" && pageState.pageId) {
                draft.expandedNodes[pageState.pageId] = true;
            }

            const treeNode: TreeNodeModel = {
                key: !pageState.pageId ? pageState.nodeId : pageState.pageId,
                displayName: pageState.displayName,
                nodeId: pageState.nodeId,
                pageId: !pageState.pageId ? "" : pageState.pageId,
                parentId: pageState.parentNodeId ? pageState.parentNodeId : "",
                isMatchingPage: pageState.attributes.indexOf("NonMatching") < 0,
                type: pageState.type,
                isWaitingForApproval: pageState.isWaitingForApproval,
                variantName: pageState.variantName,
                isDefaultVariant: pageState.isDefaultVariant,
                isShared: pageState.isShared,
                allowedForPageType: pageState.allowedForPageType,
            };

            if (pageState.neverPublished) {
                neverPublishedPageIds[pageState.pageId || "empty"] = draft.neverPublishedNodeIds[pageState.nodeId] =
                    true;
                if (pageState.isShared) {
                    sharedNeverPublished.add(pageState.nodeId);
                }
            }

            if (pageState.isDraftPage) {
                draftPageIds[pageState.pageId || "empty"] = draft.draftNodeIds[pageState.nodeId] = true;
                if (pageState.isShared) {
                    sharedIsDraftPage.add(pageState.nodeId);
                }
            }

            if (pageState.futurePublishOn) {
                futurePublishPageIds[pageState.pageId || "empty"] = draft.futurePublishNodeIds[pageState.nodeId] =
                    new Date(pageState.futurePublishOn);
                if (pageState.isShared) {
                    sharedFuturePublishOn.add(pageState.nodeId);
                }
            }

            const nodes = treeNodesByNodeId[treeNode.nodeId];
            if (nodes) {
                nodes.push(treeNode);
            } else {
                treeNodesByNodeId[treeNode.nodeId] = [treeNode];
                insertNode(treeNode);
            }

            if (draft.appliedTreeFilters.length > 0) {
                draft.expandedNodes[treeNode.pageId] = true;
            }
        }

        for (const nodeId in treeNodesByNodeId) {
            const nodes = treeNodesByNodeId[nodeId];
            if (nodes.length < 2) {
                continue;
            }

            if (!sharedNeverPublished.has(nodeId)) {
                delete draft.neverPublishedNodeIds[nodeId];
            }
            if (!sharedFuturePublishOn.has(nodeId)) {
                delete draft.futurePublishNodeIds[nodeId];
            }
            if (!sharedIsDraftPage.has(nodeId)) {
                delete draft.draftNodeIds[nodeId];
            }

            let sharedIndex = -1;
            for (let i = 0; i < nodes.length; ++i) {
                if (nodes[i].isShared) {
                    sharedIndex = i;
                    break;
                }
            }

            if (sharedIndex > -1) {
                const clone = { ...nodes[0] };
                Object.assign(nodes[0], nodes[sharedIndex]);
                nodes[0].isRootVariant = true;
                Object.assign(nodes[sharedIndex], clone);
                nodes.shift();

                if (draft.appliedTreeFilters.length > 0 || clone.displayName === "Home") {
                    draft.expandedNodes[clone.key] = true;
                }

                for (const node of nodes.reverse()) {
                    node.isVariant = true;
                    node.parentId = nodeId;

                    if (neverPublishedPageIds[node.pageId]) {
                        draft.neverPublishedNodeIds[`${node.nodeId}_${node.pageId}`] = true;
                    }

                    if (futurePublishPageIds[node.pageId]) {
                        draft.futurePublishNodeIds[`${node.nodeId}_${node.pageId}`] = futurePublishPageIds[node.pageId];
                    }

                    if (draftPageIds[node.pageId]) {
                        draft.draftNodeIds[`${node.nodeId}_${node.pageId}`] = true;
                    }

                    insertNode(node, false);
                }
            }
        }
    },

    "PageTree/UpdatePageState": (
        draft: Draft<PageTreeState>,
        action: {
            pageId: string;
            parentId: string | null;
            publishOn?: Date;
            isWaitingForApproval: boolean;
            publishInTheFuture: boolean;
        },
    ) => {
        const pageState =
            (action.parentId &&
                getPageState(
                    action.pageId,
                    draft.treeNodesByParentId[action.parentId],
                    draft.headerTreeNodesByParentId[action.parentId],
                    draft.footerTreeNodesByParentId[action.parentId],
                    draft.mobileTreeNodesByParentId[action.parentId],
                )) ||
            getPageStateFromDictionaries(
                action.pageId,
                draft.treeNodesByParentId,
                draft.headerTreeNodesByParentId,
                draft.footerTreeNodesByParentId,
                draft.mobileTreeNodesByParentId,
            );
        if (!pageState) {
            return;
        }

        const key = pageState.isVariant ? `${pageState.nodeId}_${pageState.pageId}` : pageState.nodeId;

        if (
            (!action.publishInTheFuture || (action.publishInTheFuture && action.publishOn)) &&
            draft.neverPublishedNodeIds[key]
        ) {
            delete draft.neverPublishedNodeIds[key];
        }

        if (action.publishInTheFuture && !action.publishOn) {
            draft.draftNodeIds[key] = true;
        } else {
            delete draft.draftNodeIds[key];
        }

        if (action.publishOn && action.publishOn > new Date()) {
            draft.futurePublishNodeIds[key] = action.publishOn;
        } else {
            delete draft.futurePublishNodeIds[key];
        }

        pageState.isWaitingForApproval = action.isWaitingForApproval;
    },

    "PageTree/UpdatePageStateisDraftPage": (
        draft: Draft<PageTreeState>,
        action: {
            pageId: string;
            isDraftPage: boolean;
        },
    ) => {
        const pageState = getPageStateFromDictionaries(
            action.pageId,
            draft.treeNodesByParentId,
            draft.headerTreeNodesByParentId,
            draft.footerTreeNodesByParentId,
            draft.mobileTreeNodesByParentId,
        );

        if (!pageState) {
            return;
        }

        const key = pageState.isVariant ? `${pageState.nodeId}_${pageState.pageId}` : pageState.nodeId;

        if (action.isDraftPage) {
            draft.draftNodeIds[key] = true;
        } else {
            delete draft.draftNodeIds[key];
        }
    },

    "PageTree/SetExpandedNodes": (draft: Draft<PageTreeState>, action: { expandedNodes: Dictionary<boolean> }) => {
        draft.expandedNodes = { ...action.expandedNodes };
    },

    "PageTree/OpenAddPage": (
        draft: Draft<PageTreeState>,
        action: { parentId?: string; isLayout?: true; parentType: string },
    ) => {
        draft.addingPageUnderId = action.parentId || emptyGuid;
        draft.isLayout = action.isLayout;
        draft.addingPageUnderType = action.parentType;
    },

    "PageTree/OpenCopyPage": (
        draft: Draft<PageTreeState>,
        action: { parentId: string; pageId: string; nodeDisplayName: string; nodePageType: string },
    ) => {
        draft.addingPageUnderId = action.parentId;
        draft.copyPageId = action.pageId;
        draft.copyPageDisplayName = action.nodeDisplayName;
        draft.copyPageType = action.nodePageType;
    },

    "PageTree/OpenCreateVariant": (
        draft: Draft<PageTreeState>,
        action: { parentId: string; pageId: string; nodeDisplayName: string; nodePageType: string },
    ) => {
        draft.addingPageUnderId = action.parentId;
        draft.variantPageId = action.pageId;
        draft.variantPageName = action.nodeDisplayName;
        draft.variantPageType = action.nodePageType;
    },

    "PageTree/OpenMakeDefaultVariant": (draft: Draft<PageTreeState>, action: { parentId: string; pageId: string }) => {
        draft.makingDefaultPageUnderId = action.parentId;
        draft.variantPageId = action.pageId;
    },

    "PageTree/CloseMakeDefaultModal": (draft: Draft<PageTreeState>) => {
        draft.makingDefaultPageUnderId = "";
        draft.variantPageId = "";
    },

    "PageTree/OpenRulesEdit": (
        draft: Draft<PageTreeState>,
        action: { pageId: string; isNewVariant: boolean | undefined },
    ) => {
        draft.variantRulesForPageId = action.pageId;
        draft.isNewVariant = action.isNewVariant;
    },

    "PageTree/CloseRulesEdit": (draft: Draft<PageTreeState>) => {
        draft.variantRulesForPageId = "";
        delete draft.isNewVariant;
    },

    "PageTree/UpdateDefaultVariantRoot": (
        draft: Draft<PageTreeState>,
        action: { parentId: string; pageId: string },
    ) => {
        const nodes =
            draft.treeNodesByParentId[action.parentId] ||
            draft.headerTreeNodesByParentId[action.parentId] ||
            draft.footerTreeNodesByParentId[action.parentId] ||
            draft.mobileTreeNodesByParentId[action.parentId];
        if (nodes) {
            for (const node of nodes) {
                node.isDefaultVariant = node.pageId === action.pageId;
            }
        }
    },

    "PageTree/CancelAddPage": (draft: Draft<PageTreeState>) => {
        draft.addingPageUnderId = "";
        draft.copyPageId = "";
        draft.copyPageDisplayName = "";
        draft.copyPageType = "";
        draft.variantPageId = "";
        draft.variantPageType = "";
        draft.variantPageName = "";
        draft.isLayout = false;
    },

    "PageTree/AddPageComplete": (draft: Draft<PageTreeState>) => {
        draft.addingPageUnderId = "";
        draft.copyPageId = "";
        draft.copyPageDisplayName = "";
        draft.copyPageType = "";
        draft.variantPageId = "";
        draft.variantPageType = "";
        draft.variantPageName = "";
        draft.isLayout = false;
    },

    "PageTree/DeletePageComplete": (draft: Draft<PageTreeState>) => {},

    "PageTree/BeginLoadFiltersForQuery": (draft: Draft<PageTreeState>, action: { query: string }) => {
        draft.isLoadingFilters = true;
        draft.treeFiltersQuery = action.query;
    },

    "PageTree/LoadFiltersForQueryComplete": (
        draft: Draft<PageTreeState>,
        action: {
            treeFilters: TreeFilterModel[];
            totalResults: number;
            query: string;
        },
    ) => {
        const state = draft; // Duplicating the variable for accurate history on the next line.
        if (action.query === state.treeFiltersQuery) {
            draft.isLoadingFilters = false;
            draft.potentialTreeFilters = action.treeFilters;
            draft.extraTreeFilterCount = action.totalResults - action.treeFilters.length;
        }
    },

    "PageTree/AddFilter": (draft: Draft<PageTreeState>, action: { treeFilter: TreeFilterModel }) => {
        const {
            treeFilter: { key, type },
        } = action;
        if (draft.appliedTreeFilters.filter(o => o.key === key && o.type === type).length === 0) {
            draft.appliedTreeFilters.push(action.treeFilter);
        }

        draft.potentialTreeFilters = [];
        draft.extraTreeFilterCount = 0;
        draft.treeFiltersQuery = "";
    },

    "PageTree/RemoveFilter": (draft: Draft<PageTreeState>, action: { treeFilter: TreeFilterModel }) => {
        const {
            treeFilter: { key, type },
        } = action;
        draft.appliedTreeFilters.forEach((item, index) => {
            if (item.key === key && item.type === type) {
                draft.appliedTreeFilters.splice(index, 1);
            }
        });
    },

    "PageTree/ClearFilters": (draft: Draft<PageTreeState>) => {
        draft.appliedTreeFilters = [];
    },

    "PageTree/OpenReorderPages": (draft: Draft<PageTreeState>) => {
        draft.displayReorderPages = true;
        draft.reorderPagesByParentId = undefined;
    },

    "PageTree/CancelReorderPages": (draft: Draft<PageTreeState>) => {
        draft.displayReorderPages = false;
        draft.reorderPagesByParentId = undefined;
    },

    "PageTree/LoadReorderPagesComplete": (
        draft: Draft<PageTreeState>,
        action: { rootNodeId: string; pageReorderingModels: PageReorderModel[]; nodeId?: string },
    ) => {
        draft.reorderPagesByParentId = {};
        draft.rootNodeId = action.rootNodeId;
        draft.isVariantReorder = !!action.nodeId;
        action.pageReorderingModels.sort((a, b) => a.sortOrder - b.sortOrder);

        const pages: Dictionary<TreeNodeModel> = {};
        if (action.nodeId) {
            const treeNodes =
                draft.treeNodesByParentId[action.nodeId] ||
                draft.headerTreeNodesByParentId[action.nodeId] ||
                draft.footerTreeNodesByParentId[action.nodeId] ||
                draft.mobileTreeNodesByParentId[action.nodeId];
            if (treeNodes) {
                for (const treeNode of treeNodes) {
                    pages[treeNode.pageId] = treeNode;
                }
            }
        }

        for (const page of action.pageReorderingModels) {
            if (!draft.reorderPagesByParentId[page.parentId]) {
                draft.reorderPagesByParentId[page.parentId] = [];
            }

            if (action.nodeId && page.pageId) {
                if (!pages[page.pageId]) {
                    continue;
                } else {
                    page.variantName = pages[page.pageId].variantName;
                }
            }

            page.sortOrder = draft.reorderPagesByParentId[page.parentId].length;
            draft.reorderPagesByParentId[page.parentId].push(page);
        }

        draft.displayReorderPages = true;
    },

    "PageTree/BeginSaveReorderPages": (draft: Draft<PageTreeState>) => {
        draft.savingReorderPages = true;
    },

    "PageTree/FailedSaveReorderPages": (draft: Draft<PageTreeState>) => {
        draft.savingReorderPages = false;
    },

    "PageTree/CompleteSaveReorderPages": (draft: Draft<PageTreeState>) => {
        draft.displayReorderPages = false;
        draft.savingReorderPages = false;
        draft.reorderPagesByParentId = undefined;
    },

    "PageTree/ToggleFilterToMobile": (draft: Draft<PageTreeState>) => {
        if (!draft.filterToMobile) {
            delete draft.filterToMobile;
        } else {
            draft.filterToMobile = true;
        }
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
