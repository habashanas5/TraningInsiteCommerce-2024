import { Dictionary } from "@insite/client-framework/Common/Types";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";
import Edit from "@insite/shell/Components/Icons/Edit";
import Move from "@insite/shell/Components/Icons/Move";
import OverflowAddPage from "@insite/shell/Components/Icons/OverflowAddPage";
import OverflowCopyPage from "@insite/shell/Components/Icons/OverflowCopyPage";
import Trash from "@insite/shell/Components/Icons/Trash";
import { HasConfirmationContext, withConfirmation } from "@insite/shell/Components/Modals/ConfirmationContext";
import {
    canAddChildPage,
    canAddVariant,
    canCopyPage,
    canDeleteLayout,
    canDeletePage,
    canEditLayout,
    canEditPage,
} from "@insite/shell/Components/PageTree/PageTreeFlyout.Functions";
import { getPageDefinition } from "@insite/shell/DefinitionLoader";
import { getPagePublishInfo, getPublishedPageVersions } from "@insite/shell/Services/ContentAdminService";
import { ShellThemeProps } from "@insite/shell/ShellTheme";
import { showErrorModal } from "@insite/shell/Store/ErrorModal/ErrorModalActionCreator";
import { editPageOptions } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import {
    deletePage,
    openAddPage,
    openCopyPage,
    openCreateVariant,
    openMakeDefaultVariant,
    openReorderPages,
    openRulesEdit,
} from "@insite/shell/Store/PageTree/PageTreeActionCreators";
import { TreeNodeModel } from "@insite/shell/Store/PageTree/PageTreeState";
import { setContentMode } from "@insite/shell/Store/ShellContext/ShellContextActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import styled from "styled-components";

interface OwnProps {
    flyOutNode: TreeNodeModel;
    flyOutElement: HTMLElement;
    closeFlyOut: () => void;
    nodesByParentId: Dictionary<TreeNodeModel[]>;
}

const mapStateToProps = (state: ShellState) => ({
    currentPageId: getCurrentPage(state).id,
    permissions: state.shellContext.permissions,
    mobileCmsModeActive: state.shellContext.mobileCmsModeActive,
    futurePublishNodeIds: state.pageTree.futurePublishNodeIds,
});

const mapDispatchToProps = {
    deletePage,
    openAddPage,
    openCopyPage,
    editPageOptions,
    setContentMode,
    openCreateVariant,
    openMakeDefaultVariant,
    openRulesEdit,
    openReorderPages,
    showErrorModal,
};

type Props = RouteComponentProps &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    OwnProps &
    HasConfirmationContext;

const flyOutOption = (onClick: () => void, icon: any, title: string) => {
    return (
        <FlyoutOption onClick={onClick} data-test-selector={`pageFlyOutOption_${title}`}>
            <div>{icon}</div>
            <span>{title}</span>
        </FlyoutOption>
    );
};

class PageTreeFlyOut extends React.Component<Props> {
    private handleDeletePage = () => {
        this.props.closeFlyOut();

        const childNodes = this.props.nodesByParentId[this.props.flyOutNode.nodeId];
        const messageDetails = this.props.flyOutNode.isRootVariant
            ? "All variant pages other than the default will be removed."
            : childNodes
            ? `This will immediately delete the page and its ${childNodes.length} children.`
            : "This will take effect immediately.";

        const name =
            (this.props.flyOutNode.variantName || this.props.flyOutNode.displayName) +
            (this.props.flyOutNode.isRootVariant ? " variants" : "");
        this.props.confirmation.display({
            message: `Are you sure you want to delete ${name}? ${
                this.props.flyOutNode.isVariant ? "" : messageDetails
            }`,
            title: `Delete ${name}`,
            onConfirm: () => {
                this.props.deletePage(
                    this.props.flyOutNode.nodeId,
                    this.props.history,
                    this.props.flyOutNode.isVariant || this.props.flyOutNode.isRootVariant
                        ? this.props.flyOutNode.pageId
                        : "",
                );
            },
        });
    };

    private handleAddPage = () => {
        this.props.closeFlyOut();
        this.props.openAddPage(this.props.flyOutNode.nodeId, this.props.flyOutNode.type);
    };

    private handleCopyPage = () => {
        this.props.closeFlyOut();
        this.props.openCopyPage(
            this.props.flyOutNode.parentId,
            this.props.flyOutNode.pageId,
            `${this.props.flyOutNode.displayName}Copy`,
            this.props.flyOutNode.type,
        );
    };

    private handleReorderVariants = () => {
        this.props.closeFlyOut();
        this.props.openReorderPages(this.props.flyOutNode.nodeId);
    };

    private handleEditPage = () => {
        this.props.closeFlyOut();

        this.props.editPageOptions(this.props.flyOutNode.pageId, !!this.props.flyOutNode.isVariant);
    };

    private handleCreateVariant = async () => {
        this.props.closeFlyOut();
        if (!this.props.flyOutNode.isRootVariant) {
            const pagePublishInfo = await getPagePublishInfo(this.props.flyOutNode.pageId);
            if (pagePublishInfo.length) {
                this.props.showErrorModal(
                    "Page should be published before creating any variant.",
                    undefined,
                    undefined,
                    "Create Variant",
                );
                return;
            }
        }
        this.props.openCreateVariant(
            this.props.flyOutNode.parentId,
            this.props.flyOutNode.pageId,
            this.props.flyOutNode.displayName,
            this.props.flyOutNode.type,
        );
    };

    private handleEditRules = () => {
        this.props.closeFlyOut();
        this.props.openRulesEdit(this.props.flyOutNode.pageId);
    };

    private handleMakeDefault = async () => {
        this.props.closeFlyOut();
        const publishedVersions = await getPublishedPageVersions(this.props.flyOutNode.pageId, 1, 1);
        if (publishedVersions.totalItemCount === 0) {
            this.props.showErrorModal(
                "This variant cannot be made the default because it has not been published. Publish the variant and try again.",
                undefined,
                undefined,
                "Make Default",
            );
            return;
        }
        this.props.openMakeDefaultVariant(this.props.flyOutNode.parentId, this.props.flyOutNode.pageId);
    };

    render() {
        const { flyOutNode, permissions, mobileCmsModeActive } = this.props;
        const style = this.getFlyOutStyle();
        const pageDefinition = getPageDefinition(flyOutNode.type);
        const isLayout = flyOutNode.type === "Layout";

        if (isLayout) {
            return (
                <PageTreeFlyOutMenu style={style}>
                    {permissions &&
                        canEditLayout(permissions) &&
                        flyOutOption(this.handleEditPage, <Edit />, "Edit Layout")}
                    {permissions &&
                        canDeleteLayout(permissions) &&
                        flyOutOption(this.handleDeletePage, <Trash color1="#9b9b9b" />, "Delete Layout")}
                </PageTreeFlyOutMenu>
            );
        }

        if (!permissions) {
            return null;
        }

        return (
            <PageTreeFlyOutMenu style={style}>
                {canEditPage(this.props.futurePublishNodeIds, pageDefinition, permissions, flyOutNode) &&
                    flyOutOption(
                        this.handleEditPage,
                        <Edit />,
                        flyOutNode.isRootVariant ? "Edit Shared Fields" : "Edit Page",
                    )}
                {!mobileCmsModeActive && (
                    <>
                        {canAddChildPage(pageDefinition, permissions, flyOutNode) &&
                            flyOutOption(this.handleAddPage, <OverflowAddPage />, "Add Page")}
                    </>
                )}
                {canAddVariant(pageDefinition, permissions) &&
                    !flyOutNode.isVariant &&
                    flyOutOption(this.handleCreateVariant, <OverflowAddPage />, "Create Variant")}
                {canAddVariant(pageDefinition, permissions) &&
                    flyOutNode.isVariant &&
                    !flyOutNode.isDefaultVariant &&
                    flyOutOption(this.handleEditRules, <Edit />, "Edit Rules")}
                {canAddVariant(pageDefinition, permissions) &&
                    flyOutNode.isVariant &&
                    !flyOutNode.isDefaultVariant &&
                    flyOutOption(this.handleMakeDefault, <Edit />, "Make Default")}
                {canCopyPage(pageDefinition, permissions, flyOutNode) &&
                    flyOutOption(this.handleCopyPage, <OverflowCopyPage />, "Copy Page")}
                {flyOutNode.isRootVariant && flyOutOption(this.handleReorderVariants, <Move />, "Reorder Variants")}
                {canDeletePage(this.props.futurePublishNodeIds, pageDefinition, permissions, flyOutNode) &&
                    flyOutOption(
                        this.handleDeletePage,
                        <Trash color1="#9b9b9b" />,
                        flyOutNode.isRootVariant ? "Delete Variants" : "Delete",
                    )}
            </PageTreeFlyOutMenu>
        );
    }

    private getFlyOutStyle() {
        let left = 10;
        let top = 0;
        if (this.props.flyOutElement) {
            const rect = this.props.flyOutElement.getBoundingClientRect();
            left = rect.right;
            top = rect.top;
        }

        if (top + 200 > window.innerHeight) {
            return {
                bottom: window.innerHeight - top - 40,
                left,
            };
        }

        return {
            left,
            top,
        };
    }
}

export const pageTreeFlyOutMenuHasItems = (
    futurePublishNodeIds: Dictionary<Date>,
    flyOutNode: TreeNodeModel,
    permissions: PermissionsModel | undefined,
): boolean => {
    const pageDefinition = getPageDefinition(flyOutNode.type);

    return (
        !!permissions &&
        (canEditPage(futurePublishNodeIds, pageDefinition, permissions, flyOutNode) ||
            canAddChildPage(pageDefinition, permissions, flyOutNode) ||
            canAddVariant(pageDefinition, permissions) ||
            canCopyPage(pageDefinition, permissions, flyOutNode) ||
            canDeletePage(futurePublishNodeIds, pageDefinition, permissions, flyOutNode) ||
            (flyOutNode.type === "Layout" && (canEditLayout(permissions) || canDeleteLayout(permissions))))
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withConfirmation(PageTreeFlyOut)));

const PageTreeFlyOutMenu = styled.div`
    border-radius: 8px;
    background-color: ${(props: ShellThemeProps) => props.theme.colors.common.accent};
    box-shadow: 0 2px 11px 0 rgba(0, 0, 0, 0.2);
    position: fixed;
    display: block;
    z-index: 1000;
`;

const FlyoutOption = styled.div`
    font-family: ${(props: ShellThemeProps) => props.theme.typography.body.fontFamily};
    color: ${(props: ShellThemeProps) => props.theme.colors.text.main};
    cursor: pointer;
    width: 180px;
    padding: 3px 0;
    font-weight: 300;
    display: flex;
    align-content: center;
    position: relative;
    align-items: center;

    div {
        width: 36px;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    &:hover {
        background-color: ${(props: ShellThemeProps) => props.theme.colors.common.backgroundContrast};
        color: ${(props: ShellThemeProps) => props.theme.colors.common.background};
    }

    &:first-child {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }

    &:last-child {
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
    }
`;
