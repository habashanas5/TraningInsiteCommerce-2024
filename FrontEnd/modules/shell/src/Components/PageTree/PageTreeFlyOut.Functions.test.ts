import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";
import { canCopyPage, canDeletePage } from "@insite/shell/Components/PageTree/PageTreeFlyout.Functions";
import { TreeNodeModel } from "@insite/shell/Store/PageTree/PageTreeState";

test("canDeletePage returns true for Content page", () => {
    const result = callCanDeletePage("Content");

    expect(result).toBeTruthy();
});

test("canDeletePage returns false when permissions are false", () => {
    const result = callCanDeletePage("Content", withTreeNode({}), false);

    expect(result).toBeFalsy();
});

test("canDeletePage returns false when System Page", () => {
    const result = callCanDeletePage("System");

    expect(result).toBeFalsy();
});

test("canDeletePage (delete variants) returns true when System Page and isRootVariant", () => {
    const result = callCanDeletePage("System", withTreeNode({ isRootVariant: true }));

    expect(result).toBeTruthy();
});

test("canDeletePage returns true when System Page and isVariant", () => {
    const result = callCanDeletePage("System", withTreeNode({ isVariant: true }));

    expect(result).toBeTruthy();
});

test("canDeletePage returns false when System Page and isVariant and isDefaultVariant", () => {
    const result = callCanDeletePage("System", withTreeNode({ isDefaultVariant: true, isVariant: true }));

    expect(result).toBeFalsy();
});

test("canDeletePage returns false when System Page and isVariant and not isDefaultVariant", () => {
    const result = callCanDeletePage("System", withTreeNode({ isDefaultVariant: false, isVariant: true }));

    expect(result).toBeTruthy();
});

test("canCopyPage returns false when canCopyPage is false", () => {
    const result = callCanDeletePage("Content", withTreeNode({}), false);

    expect(result).toBeFalsy();
});

test("canCopyPage returns false when canCopyPage is true", () => {
    const result = callCanDeletePage("Content");

    expect(result).toBeTruthy();
});

test("canCopyPage returns false when page type is System", () => {
    const result = callCanDeletePage("System");

    expect(result).toBeFalsy();
});

test("canCopyPage returns false when isVariant", () => {
    const result = callCanCopyPage("System", withTreeNode({ isVariant: true }));

    expect(result).toBeFalsy();
});

test("canCopyPage returns false when isRootVariant", () => {
    const result = callCanCopyPage("System", withTreeNode({ isRootVariant: true }));

    expect(result).toBeFalsy();
});

function callCanDeletePage(
    pageType: "System" | "Content",
    treeNode: TreeNodeModel | undefined = undefined,
    permissionValue = true,
) {
    return canDeletePage({}, withPageType(pageType), withCanDeletePage(permissionValue), treeNode ?? withTreeNode({}));
}

function callCanCopyPage(
    pageType: "System" | "Content",
    treeNode: TreeNodeModel | undefined = undefined,
    permissionValue = true,
) {
    return canCopyPage(withPageType(pageType), withCanCopyPage(permissionValue), treeNode ?? withTreeNode({}));
}

function withPageType(pageType: "System" | "Content") {
    return {
        pageType,
    } as any;
}

function withCanDeletePage(canDeletePage: boolean) {
    return {
        canDeletePage,
    } as any as PermissionsModel;
}

function withCanCopyPage(canCopyPage: boolean) {
    return {
        canCopyPage,
    } as any as PermissionsModel;
}

function withTreeNode(treeNode: Partial<TreeNodeModel>) {
    return treeNode as TreeNodeModel;
}
