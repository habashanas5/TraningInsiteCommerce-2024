import { Dictionary } from "@insite/client-framework/Common/Types";
import { PageReorderModel, TreeFilterModel } from "@insite/shell/Services/ContentAdminService";

export interface TreeNodeModel {
    key: string;
    parentId: string;
    displayName: string;
    pageId: string;
    nodeId: string;
    isMatchingPage: boolean;
    type: string;
    isWaitingForApproval: boolean;
    variantName: string;
    isDefaultVariant: boolean;
    isVariant?: boolean;
    isRootVariant?: boolean;
    isShared?: boolean;
    allowedForPageType: string;
}

export interface PageTreeState {
    displayReorderPages: boolean;
    reorderPagesByParentId?: Dictionary<PageReorderModel[]>;
    rootNodeId: string;
    isVariantReorder: boolean;
    extraTreeFilterCount: number;
    isLoadingFilters: boolean;
    treeFiltersQuery: string;
    potentialTreeFilters: TreeFilterModel[];
    treeNodesByParentId: Dictionary<TreeNodeModel[]>;
    headerTreeNodesByParentId: Dictionary<TreeNodeModel[]>;
    footerTreeNodesByParentId: Dictionary<TreeNodeModel[]>;
    mobileTreeNodesByParentId: Dictionary<TreeNodeModel[]>;
    layoutTreeNodesByParentId: Dictionary<TreeNodeModel[]>;
    neverPublishedNodeIds: Dictionary<boolean>;
    futurePublishNodeIds: Dictionary<Date>;
    draftNodeIds: Dictionary<boolean>;
    addingPageUnderId?: string;
    addingPageUnderType?: string;
    appliedTreeFilters: TreeFilterModel[];
    savingReorderPages: boolean;
    expandedNodes: Dictionary<boolean>;
    copyPageId?: string;
    copyPageDisplayName?: string;
    copyPageType?: string;
    filterToMobile?: true;
    variantPageId?: string;
    variantPageType?: string;
    variantPageName?: string;
    makingDefaultPageUnderId?: string;
    variantRulesForPageId?: string;
    isNewVariant?: boolean;
    isLayout?: boolean;
}
