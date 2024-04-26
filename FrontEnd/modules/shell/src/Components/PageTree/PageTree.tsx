import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import Typography from "@insite/mobius/Typography";
import ClickOutside from "@insite/shell/Components/ClickOutside";
import Add from "@insite/shell/Components/Icons/Add";
import Move from "@insite/shell/Components/Icons/Move";
import SectionCollapse from "@insite/shell/Components/Icons/SectionCollapse";
import PageTreeFlyOut from "@insite/shell/Components/PageTree/PageTreeFlyOut";
import PageTreePages from "@insite/shell/Components/PageTree/PageTreePages";
import MakeDefaultVariantModal from "@insite/shell/Components/Shell/MakeDefaultVariantModal";
import VariantRulesModal from "@insite/shell/Components/Shell/VariantRulesModal";
import {
    loadTreeNodes,
    openAddLayout,
    openReorderPages,
    setExpandedNodes,
} from "@insite/shell/Store/PageTree/PageTreeActionCreators";
import { TreeNodeModel } from "@insite/shell/Store/PageTree/PageTreeState";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled, { css } from "styled-components";

const mapStateToProps = (state: ShellState) => ({
    selectedPageId: getCurrentPage(state).id,
    isEditMode: state.shellContext.contentMode === "Editing",
    nodesByParentId: state.pageTree.treeNodesByParentId,
    allowRootAddPage: state.pageTree.appliedTreeFilters.length === 0 && state.shellContext.contentMode === "Editing",
    headerNodesByParentId: state.pageTree.headerTreeNodesByParentId,
    footerNodesByParentId: state.pageTree.footerTreeNodesByParentId,
    expandedNodes: state.pageTree.expandedNodes,
    hasExpandedNodes: Object.keys(state.pageTree.expandedNodes).length > 0,
    permissions: state.shellContext.permissions,
    mobileCmsModeActive: state.shellContext.mobileCmsModeActive,
    mobileTreeNodesByParentId: state.pageTree.mobileTreeNodesByParentId,
    layoutTreeNodesByParentId: state.pageTree.layoutTreeNodesByParentId,
    neverPublishedNodeIds: state.pageTree.neverPublishedNodeIds,
    futurePublishNodeIds: state.pageTree.futurePublishNodeIds,
    draftNodeIds: state.pageTree.draftNodeIds,
    appliedTreeFilters: state.pageTree.appliedTreeFilters,
});

const mapDispatchToProps = {
    loadTreeNodes,
    openReorderPages,
    setExpandedNodes,
    openAddLayout,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

interface State {
    flyOutNode?: TreeNodeModel;
    flyOutElement?: HTMLElement;
}

class PageTree extends ClickOutside<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {};
    }

    componentDidMount(): void {
        if (typeof this.props.nodesByParentId[""] === "undefined") {
            this.props.loadTreeNodes();
        }
    }

    onClickOutside(): void {
        this.closeFlyOut();
    }

    private handleFlyOutNode = (pageElement: HTMLElement, node: TreeNodeModel) => {
        if (this.state.flyOutElement === pageElement) {
            this.closeFlyOut();
            return;
        }

        this.setState({
            flyOutNode: node,
            flyOutElement: pageElement,
        });
    };

    private handleExpandPage = (node: TreeNodeModel) => {
        const { expandedNodes, setExpandedNodes } = this.props;
        const nextExpandedNodes = { ...expandedNodes };
        if (typeof expandedNodes[node.key] === "undefined") {
            nextExpandedNodes[node.key] = true;
        } else {
            delete nextExpandedNodes[node.key];
        }

        setExpandedNodes(nextExpandedNodes);
    };

    private addNewLayout = () => {
        this.props.openAddLayout();
    };

    private closeFlyOut = () => {
        if (this.state.flyOutNode || this.state.flyOutElement) {
            this.setState({
                flyOutNode: undefined,
                flyOutElement: undefined,
            });
        }
    };

    private closeAll = () => {
        this.props.setExpandedNodes({});
    };

    private reorderPages = () => {
        this.props.openReorderPages();
    };

    render() {
        const { flyOutNode, flyOutElement } = this.state;
        const {
            allowRootAddPage,
            hasExpandedNodes,
            expandedNodes,
            headerNodesByParentId,
            nodesByParentId,
            footerNodesByParentId,
            isEditMode,
            selectedPageId,
            permissions,
            mobileCmsModeActive,
            mobileTreeNodesByParentId,
            layoutTreeNodesByParentId,
            neverPublishedNodeIds,
            futurePublishNodeIds,
            draftNodeIds,
            appliedTreeFilters,
        } = this.props;

        if (mobileCmsModeActive) {
            return (
                <PageTreeStyle ref={this.setWrapperRef} onClick={this.closeFlyOut}>
                    <Typography variant="h2" css={pagesH2}>
                        Pages
                    </Typography>
                    <PageTreePages
                        isEditMode={isEditMode}
                        selectedPageId={selectedPageId}
                        parentId={emptyGuid}
                        nodesByParentId={mobileTreeNodesByParentId}
                        expandedNodes={expandedNodes}
                        onExpandNode={this.handleExpandPage}
                        onFlyOutNode={this.handleFlyOutNode}
                        flyOutNode={flyOutNode}
                        permissions={permissions}
                        neverPublishedNodeIds={neverPublishedNodeIds}
                        futurePublishNodeIds={futurePublishNodeIds}
                        draftNodeIds={draftNodeIds}
                    />
                    {flyOutNode && flyOutElement && (
                        <PageTreeFlyOut
                            flyOutNode={flyOutNode}
                            flyOutElement={flyOutElement}
                            closeFlyOut={this.closeFlyOut}
                            nodesByParentId={nodesByParentId}
                        />
                    )}
                    <MakeDefaultVariantModal />
                    <VariantRulesModal />
                </PageTreeStyle>
            );
        }

        const noPagesFound =
            appliedTreeFilters.length > 0 &&
            Object.keys(headerNodesByParentId).length === 0 &&
            Object.keys(nodesByParentId).length === 0 &&
            Object.keys(footerNodesByParentId).length === 0;

        return (
            <PageTreeContainerStyle>
                <PageTreeStyle ref={this.setWrapperRef} onClick={this.closeFlyOut}>
                    <Typography variant="h2" css={pagesH2}>
                        {noPagesFound ? "No pages found" : "Pages"}
                        {hasExpandedNodes && (
                            <CollapseTreeStyle onClick={this.closeAll}>
                                <SectionCollapse />
                            </CollapseTreeStyle>
                        )}
                        {allowRootAddPage && permissions?.canMovePages && (
                            <ReorderStyle onClick={this.reorderPages}>
                                <Move height={19} />
                            </ReorderStyle>
                        )}
                    </Typography>
                    <PageTreePages
                        isEditMode={isEditMode}
                        selectedPageId={selectedPageId}
                        parentId={emptyGuid}
                        nodesByParentId={headerNodesByParentId}
                        expandedNodes={expandedNodes}
                        onExpandNode={this.handleExpandPage}
                        onFlyOutNode={this.handleFlyOutNode}
                        flyOutNode={flyOutNode}
                        permissions={permissions}
                        neverPublishedNodeIds={neverPublishedNodeIds}
                        futurePublishNodeIds={futurePublishNodeIds}
                        draftNodeIds={draftNodeIds}
                    />
                    <PageTreePages
                        isEditMode={isEditMode}
                        selectedPageId={selectedPageId}
                        parentId={emptyGuid}
                        nodesByParentId={nodesByParentId}
                        expandedNodes={expandedNodes}
                        onExpandNode={this.handleExpandPage}
                        onFlyOutNode={this.handleFlyOutNode}
                        flyOutNode={flyOutNode}
                        permissions={permissions}
                        neverPublishedNodeIds={neverPublishedNodeIds}
                        futurePublishNodeIds={futurePublishNodeIds}
                        draftNodeIds={draftNodeIds}
                    />
                    <PageTreePages
                        isEditMode={isEditMode}
                        selectedPageId={selectedPageId}
                        parentId={emptyGuid}
                        nodesByParentId={footerNodesByParentId}
                        expandedNodes={expandedNodes}
                        onExpandNode={this.handleExpandPage}
                        onFlyOutNode={this.handleFlyOutNode}
                        flyOutNode={flyOutNode}
                        permissions={permissions}
                        neverPublishedNodeIds={neverPublishedNodeIds}
                        futurePublishNodeIds={futurePublishNodeIds}
                        draftNodeIds={draftNodeIds}
                    />
                    {flyOutNode && flyOutElement && (
                        <PageTreeFlyOut
                            flyOutNode={flyOutNode}
                            flyOutElement={flyOutElement}
                            closeFlyOut={this.closeFlyOut}
                            nodesByParentId={nodesByParentId}
                        />
                    )}
                    <MakeDefaultVariantModal />
                    <VariantRulesModal />
                </PageTreeStyle>
                {isEditMode && (
                    <PageTreeStyle ref={this.setWrapperRef} onClick={this.closeFlyOut}>
                        <Typography variant="h2" css={pagesH2}>
                            Layouts
                            <PageTreeNewLayout
                                onClick={this.addNewLayout}
                                title="Add New Layout"
                                data-test-selector="pageTree_addNewLayout"
                            >
                                <Add />
                            </PageTreeNewLayout>
                        </Typography>
                        <PageTreePages
                            isEditMode={isEditMode}
                            selectedPageId={selectedPageId}
                            parentId={emptyGuid}
                            nodesByParentId={layoutTreeNodesByParentId}
                            expandedNodes={expandedNodes}
                            onExpandNode={this.handleExpandPage}
                            onFlyOutNode={this.handleFlyOutNode}
                            flyOutNode={flyOutNode}
                            permissions={permissions}
                            neverPublishedNodeIds={neverPublishedNodeIds}
                            futurePublishNodeIds={futurePublishNodeIds}
                            draftNodeIds={draftNodeIds}
                        />
                        {flyOutNode && flyOutElement && (
                            <PageTreeFlyOut
                                flyOutNode={flyOutNode}
                                flyOutElement={flyOutElement}
                                closeFlyOut={this.closeFlyOut}
                                nodesByParentId={nodesByParentId}
                            />
                        )}
                    </PageTreeStyle>
                )}
            </PageTreeContainerStyle>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PageTree);

const pagesH2 = css`
    position: relative;
    font-weight: normal;
    font-size: 26px;
`;

const TreeIcon = styled.div`
    position: absolute;
    text-align: center;
    cursor: pointer;
    top: 0;
    &:hover svg {
        circle {
            fill: #777;
        }
        path:first-child {
            fill: #777;
        }
    }
`;

const ReorderStyle = styled(TreeIcon)`
    text-align: center;
    right: 0;
    width: 20px;
`;

const CollapseTreeStyle = styled.div`
    position: absolute;
    top: 2px;
    left: -22px;
    cursor: pointer;
`;

const PageTreeStyle = styled.div`
    overflow: visible;
    padding: 0 35px;
`;

const PageTreeNewLayout = styled.button`
    cursor: pointer;
    position: absolute;
    width: 20px;
    text-align: center;
    right: 0;
    top: 0;
    background-color: transparent;
    border: none;
    padding: 0;
`;

const PageTreeContainerStyle = styled.div`
    margin-bottom: 40px;
`;
