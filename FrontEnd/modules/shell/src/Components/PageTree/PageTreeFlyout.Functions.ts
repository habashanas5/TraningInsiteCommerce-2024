import { Dictionary } from "@insite/client-framework/Common/Types";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";
import { LoadedPageDefinition } from "@insite/shell/DefinitionTypes";
import { TreeNodeModel } from "@insite/shell/Store/PageTree/PageTreeState";

export function canDeletePage(
    futurePublishNodeIds: Dictionary<Date>,
    pageDefinition: LoadedPageDefinition,
    permissions: PermissionsModel,
    treeNode: TreeNodeModel,
) {
    const key = treeNode.isVariant ? `${treeNode.nodeId}_${treeNode.pageId}` : treeNode.nodeId;
    return (
        (!futurePublishNodeIds[key] || futurePublishNodeIds[key] <= new Date()) &&
        permissions.canDeletePage &&
        (pageDefinition?.pageType === "Content" ||
            !!treeNode.isVariant ||
            !!treeNode.isRootVariant ||
            !pageDefinition) &&
        (treeNode.isVariant ? !treeNode.isDefaultVariant : true)
    );
}

export function canEditPage(
    futurePublishNodeIds: Dictionary<Date>,
    pageDefinition: LoadedPageDefinition,
    permissions: PermissionsModel,
    treeNode: TreeNodeModel,
) {
    const key = treeNode.isVariant ? `${treeNode.nodeId}_${treeNode.pageId}` : treeNode.nodeId;
    return (
        (!futurePublishNodeIds[key] || futurePublishNodeIds[key] <= new Date()) &&
        ((permissions.canEditWidget && pageDefinition?.pageType === "Content") ||
            (permissions.canEditSystemWidget && pageDefinition?.pageType === "System"))
    );
}

export function canAddChildPage(
    pageDefinition: LoadedPageDefinition,
    permissions: PermissionsModel,
    treeNode: TreeNodeModel,
) {
    return (
        pageDefinition &&
        permissions.canCreatePage &&
        treeNode.displayName !== "Header" &&
        treeNode.displayName !== "Footer" &&
        !treeNode.isVariant
    );
}

export function canAddVariant(pageDefinition: LoadedPageDefinition, permissions: PermissionsModel) {
    return pageDefinition && permissions.canCreateVariant;
}

export function canCopyPage(
    pageDefinition: LoadedPageDefinition,
    permissions: PermissionsModel,
    treeNode: TreeNodeModel,
) {
    return (
        permissions.canCopyPage &&
        !treeNode.isVariant &&
        !treeNode.isRootVariant &&
        treeNode.displayName !== "Header" &&
        treeNode.displayName !== "Footer" &&
        pageDefinition?.pageType === "Content"
    );
}

export function canEditLayout(permissions: PermissionsModel): boolean {
    return permissions.canEditWidget;
}

export function canDeleteLayout(permissions: PermissionsModel): boolean {
    return permissions.canDeletePage;
}
