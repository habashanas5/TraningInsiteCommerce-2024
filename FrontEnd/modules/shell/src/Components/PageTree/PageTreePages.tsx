import { Dictionary } from "@insite/client-framework/Common/Types";
import PermissionsModel from "@insite/client-framework/Types/PermissionsModel";
import PageTreeItem from "@insite/shell/Components/PageTree/PageTreeItem";
import { TreeNodeModel } from "@insite/shell/Store/PageTree/PageTreeState";
import * as React from "react";

interface Props {
    isEditMode: boolean;
    selectedPageId: string;
    nodesByParentId: Dictionary<TreeNodeModel[]>;
    expandedNodes: Dictionary<boolean>;
    parentId: string;
    onFlyOutNode: (pageElement: HTMLElement, node: TreeNodeModel) => void;
    onExpandNode: (node: TreeNodeModel) => void;
    flyOutNode?: TreeNodeModel;
    permissions?: PermissionsModel;
    neverPublishedNodeIds: Dictionary<boolean>;
    futurePublishNodeIds: Dictionary<Date>;
    draftNodeIds: Dictionary<boolean>;
}

const PageTreePages: React.FC<Props> = ({
    expandedNodes,
    onExpandNode,
    onFlyOutNode,
    nodesByParentId,
    parentId,
    flyOutNode,
    isEditMode,
    selectedPageId,
    permissions,
    neverPublishedNodeIds,
    futurePublishNodeIds,
    draftNodeIds,
}) => (
    <ul>
        {nodesByParentId[parentId] &&
            nodesByParentId[parentId].map(node => (
                <PageTreeItem
                    isEditMode={isEditMode}
                    selectedPageId={selectedPageId}
                    nodesByParentId={nodesByParentId}
                    expandedNodes={expandedNodes}
                    onExpandNode={onExpandNode}
                    key={node.key}
                    node={node}
                    onFlyOutNode={onFlyOutNode}
                    flyOutNode={flyOutNode}
                    permissions={permissions}
                    neverPublishedNodeIds={neverPublishedNodeIds}
                    futurePublishNodeIds={futurePublishNodeIds}
                    draftNodeIds={draftNodeIds}
                />
            ))}
    </ul>
);

export default PageTreePages;
