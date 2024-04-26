import { Dictionary } from "@insite/client-framework/Common/Types";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";
import Icon from "@insite/mobius/Icon";
import ChevronDown from "@insite/mobius/Icons/ChevronDown";
import ChevronRight from "@insite/mobius/Icons/ChevronRight";
import Page from "@insite/shell/Components/Icons/Page";
import TreeOverflow from "@insite/shell/Components/Icons/TreeOverflow";
import { pageTreeFlyOutMenuHasItems } from "@insite/shell/Components/PageTree/PageTreeFlyOut";
import PageTreePages from "@insite/shell/Components/PageTree/PageTreePages";
import { loadPageOnSite } from "@insite/shell/Store/Data/Pages/PagesHelpers";
import { TreeNodeModel } from "@insite/shell/Store/PageTree/PageTreeState";
import * as React from "react";
import styled, { css } from "styled-components";

interface Props {
    isEditMode: boolean;
    node: TreeNodeModel;
    nodesByParentId: Dictionary<TreeNodeModel[]>;
    expandedNodes: Dictionary<boolean>;
    onFlyOutNode: (pageElement: HTMLElement, page: TreeNodeModel) => void;
    onExpandNode: (node: TreeNodeModel) => void;
    flyOutNode?: TreeNodeModel;
    selectedPageId: string;
    permissions?: PermissionsModel;
    neverPublishedNodeIds: Dictionary<boolean>;
    futurePublishNodeIds: Dictionary<Date>;
    draftNodeIds: Dictionary<boolean>;
}

class PageTreeItem extends React.Component<Props> {
    handleFlyOutClick = (event: React.MouseEvent<HTMLElement>) => {
        this.props.onFlyOutNode(event.currentTarget.parentElement as HTMLElement, this.props.node);
    };

    handleExpandClick = (event: React.MouseEvent<HTMLElement>) => {
        this.props.onExpandNode(this.props.node);
    };

    navigateToPage = (pageId: string) => {
        loadPageOnSite(pageId);
    };

    render() {
        const {
            expandedNodes,
            onExpandNode,
            onFlyOutNode,
            node,
            nodesByParentId,
            flyOutNode,
            isEditMode,
            selectedPageId,
            permissions,
            neverPublishedNodeIds,
            futurePublishNodeIds,
            draftNodeIds,
        } = this.props;

        const isExpanded = expandedNodes[node.key] && !node.isVariant;
        const expandIcon = isExpanded ? ChevronDown : ChevronRight;

        let flyOutMenu: null | JSX.Element = null;
        if (node === flyOutNode) {
            flyOutMenu = (
                <PageTreeFlyOutActive isActivePage={selectedPageId === node.pageId} onClick={this.handleFlyOutClick}>
                    <TreeOverflow color1="#00000087" />
                </PageTreeFlyOutActive>
            );
        } else if (isEditMode) {
            flyOutMenu = (
                <PageTreeFlyout
                    isActivePage={selectedPageId === node.pageId}
                    onClick={this.handleFlyOutClick}
                    title="More Options"
                    data-test-selector={`pageTreeFlyOut_${node.displayName}`}
                >
                    <TreeOverflow color1="#00000087" />
                </PageTreeFlyout>
            );
        }

        const children = nodesByParentId[node.nodeId];
        return (
            <PageTreePage data-haschildren={!!children && !node.isVariant}>
                <PageTreeTitle
                    {...node}
                    isActivePage={selectedPageId === node.pageId}
                    isFuturePublish={
                        futurePublishNodeIds[node.isVariant ? `${node.nodeId}_${node.pageId}` : node.nodeId] >
                        new Date()
                    }
                    isWaitingForApproval={node.isWaitingForApproval}
                    isDraftPage={draftNodeIds[node.isVariant ? `${node.nodeId}_${node.pageId}` : node.nodeId]}
                    neverPublished={
                        neverPublishedNodeIds[node.isVariant ? `${node.nodeId}_${node.pageId}` : node.nodeId]
                    }
                    data-test-selector={`pageTreeTitle_${node.displayName}`}
                >
                    {children && !node.isVariant && (
                        <ExpandStyle
                            src={expandIcon}
                            size={20}
                            onClick={this.handleExpandClick}
                            data-test-selector={`pageTreeExpand_${node.displayName}`}
                        />
                    )}
                    <NodeIcon>
                        <Page
                            height={18}
                            color1={node.isVariant ? (node.isDefaultVariant ? "#4A90E2" : "#FFA500") : "#D8D8D8"}
                        />
                    </NodeIcon>
                    <a
                        onClick={() => this.navigateToPage(node.pageId)}
                        data-test-selector={`pageTreeLink_${node.displayName}`}
                    >
                        {node.displayName} {node.isVariant && node.variantName ? ` - ${node.variantName}` : ""}
                    </a>
                    {pageTreeFlyOutMenuHasItems(futurePublishNodeIds, node, permissions) && flyOutMenu}
                </PageTreeTitle>
                {isExpanded && (
                    <PageTreePages
                        isEditMode={isEditMode}
                        selectedPageId={selectedPageId}
                        parentId={node.nodeId}
                        nodesByParentId={nodesByParentId}
                        expandedNodes={expandedNodes}
                        onExpandNode={onExpandNode}
                        onFlyOutNode={onFlyOutNode}
                        flyOutNode={flyOutNode}
                        permissions={permissions}
                        neverPublishedNodeIds={neverPublishedNodeIds}
                        futurePublishNodeIds={futurePublishNodeIds}
                        draftNodeIds={draftNodeIds}
                    />
                )}
            </PageTreePage>
        );
    }
}

export default PageTreeItem;

const ExpandStyle = styled(Icon)`
    top: 11px;
    left: -23px;
    position: absolute;
    cursor: pointer;
    &:hover {
        color: #777;
    }
`;

const NodeIcon = styled.span`
    top: 3px;
    left: 5px;
    position: absolute;
    width: 12px;
    text-align: center;
`;

const PageTreeFlyout = styled.button<{ isActivePage: boolean }>`
    ${props => (!props.isActivePage ? "display: none;" : "")}
    cursor: pointer;
    position: absolute;
    width: 20px;
    text-align: center;
    right: 0;
    top: 8px;
    background-color: transparent;
    border: none;
    padding: 0;
`;

const PageTreeFlyOutActive = styled(PageTreeFlyout)`
    display: block;
`;

const PageTreeTitle = styled.h3<{
    isMatchingPage: boolean;
    isActivePage: boolean;
    isFuturePublish: boolean;
    isWaitingForApproval: boolean;
    isDraftPage: boolean;
    neverPublished: boolean;
}>`
    ${props => (!props.isMatchingPage ? `color: ${props.theme.colors.custom.nonmatchingTreeLinks};` : "")}
    ${props =>
        props.isActivePage
            ? `
                  background-color: ${props.theme.colors.custom.activeBackground};
                  color: ${props.theme.colors.primary.main};
                  &::before {
                      content: "";
                      background-color: ${props.theme.colors.custom.activeBackground};
                      position: absolute;
                      height: 100%;
                      width: 22px;
                      left: -22px;
                  }
                  ${ExpandStyle} {
                      color: ${props.theme.colors.primary.main};
                  }
              `
            : ""}
    ${props =>
        props.isFuturePublish || props.isDraftPage
            ? css`
                  color: ${props.isFuturePublish
                      ? props.theme.colors.custom.futurePublish
                      : props.neverPublished
                      ? props.theme.colors.custom.neverPublished
                      : props.theme.colors.custom.draftPage};
              `
            : ""}
    ${props =>
        props.isWaitingForApproval
            ? css`
                  color: ${props.isActivePage
                      ? props.theme.colors.custom.isWaitingForApprovalActive
                      : props.theme.colors.custom.isWaitingForApproval};
              `
            : ""}
    padding-left: 25px;
    position: relative;
    margin: 0;
    &:hover ${PageTreeFlyout} {
        display: block;
    }
    && {
        font-size: 0.9rem;
        font-weight: normal;
    }
    &:hover {
        background-color: ${props => props.theme.colors.custom.activeBackground};
    }
`;

const PageTreePage = styled.li`
    ul {
        padding-left: 2px;
        h3,
        ul {
            margin-left: 15px;
        }
        li {
            position: relative;
        }
        li::before {
            content: "";
            width: 2px;
            height: 100%;
            background-color: rgb(216, 216, 216);
            position: absolute;
            top: 0;
            left: -16px;
        }
        li:last-child::before {
            height: 20px;
        }
        li::after {
            content: "";
            width: 26px;
            height: 2px;
            background-color: rgb(216, 216, 216);
            position: absolute;
            top: 20px;
            left: -16px;
        }
    }

    &[data-haschildren="true"]::after {
        width: 12px;
    }
`;
