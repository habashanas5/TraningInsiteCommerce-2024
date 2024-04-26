import { HasShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import { sendToShell } from "@insite/client-framework/Components/ShellHole";
import WidgetRenderer from "@insite/client-framework/Components/WidgetRenderer";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import { getWidgetsByIdAndZone } from "@insite/client-framework/Store/Data/Widgets/WidgetSelectors";
import { dragLeaveZone, dragWidgetOverZone, dropWidgetOnZone } from "@insite/client-framework/WidgetReordering";
import Icon from "@insite/mobius/Icon";
import * as React from "react";
import { connect } from "react-redux";
import styled from "styled-components";

export interface OwnProps {
    contentId: string;
    zoneName: string;
    fixed?: boolean;
    requireRows?: boolean;
    fullHeight?: boolean;
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps & HasShellContext) => {
    const currentPage = getCurrentPage(state);
    let pageId = currentPage.id;

    if (ownProps.shellContext.pageId) {
        pageId = ownProps.shellContext.pageId;
    }

    return {
        widgets: getWidgetsByIdAndZone(state, ownProps.contentId, ownProps.zoneName, pageId),
        draggingWidgetId: state.data.pages.draggingWidgetId,
        permissions: state.context.permissions,
        canChangePage: state.context.canChangePage,
        currentPageType: currentPage.type,
        pageDefinitionsByType: state.data.pages.pageDefinitionsByType,
        createdUsingLayout: !!currentPage.layoutPageId,
        isLayoutPage: currentPage.type === "Layout",
        pageId,
    };
};

export type Props = ReturnType<typeof mapStateToProps> & OwnProps & HasShellContext;

class Zone extends React.Component<Props> {
    private dropWidget = (event: React.DragEvent<HTMLElement>) => {
        const { contentId, draggingWidgetId, zoneName, pageId } = this.props;

        if (draggingWidgetId) {
            dropWidgetOnZone(event, index => {
                sendToShell({
                    type: "MoveWidgetTo",
                    id: draggingWidgetId,
                    parentId: contentId,
                    zoneName,
                    index,
                    pageId,
                });
            });
        }
    };

    private dragOver = (event: React.DragEvent<HTMLDivElement>) => {
        if (this.props.fixed || !this.props.permissions?.canMoveWidgets || !this.props.canChangePage) {
            return;
        }
        dragWidgetOverZone(event);
    };

    private dragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        if (this.props.fixed || !this.props.permissions?.canMoveWidgets || !this.props.canChangePage) {
            return;
        }
        dragLeaveZone(event);
    };

    private add = () => {
        const { contentId, zoneName, widgets, requireRows } = this.props;

        sendToShell({
            type: "DisplayWidgetModal",
            parentId: contentId,
            zoneName,
            sortOrder: widgets.length,
            addRow: requireRows,
        });
    };

    render() {
        const {
            contentId,
            fixed,
            widgets,
            draggingWidgetId,
            zoneName,
            shellContext: { isEditing, isCurrentPage, layoutEditableZone },
            permissions,
            canChangePage,
            currentPageType,
            pageDefinitionsByType,
            createdUsingLayout,
            pageId,
            isLayoutPage,
        } = this.props;

        if (!contentId) {
            return null;
        }

        const pageDefinition = pageDefinitionsByType?.[currentPageType];
        const renderedWidgets =
            widgets.length === 0 && isEditing && isCurrentPage ? (
                draggingWidgetId ? (
                    <ZonePlaceholder data-zoneplaceholder />
                ) : null
            ) : (
                widgets.map(widget => (
                    <WidgetRenderer
                        key={widget.id}
                        id={widget.id}
                        type={widget.type}
                        fixed={!!fixed}
                        isLayout={!!widget.isLayout && !isLayoutPage}
                        pageId={pageId}
                    />
                ))
            );

        if (isEditing && isCurrentPage && (!createdUsingLayout || layoutEditableZone)) {
            return (
                <ZoneStyle
                    data-contentid={contentId}
                    onDrop={this.dropWidget}
                    onDragOver={this.dragOver}
                    onDragLeave={this.dragLeave}
                >
                    <ZoneWrapper data-dragging={!!draggingWidgetId} data-empty={widgets.length === 0} data-zone>
                        {renderedWidgets}
                        {!draggingWidgetId &&
                            !fixed &&
                            canChangePage &&
                            ((permissions?.canAddWidget && pageDefinition?.pageType === "Content") ||
                                (permissions?.canAddSystemWidget && pageDefinition?.pageType === "System")) && (
                                <AddContainer fullHeight={widgets.length === 0}>
                                    <AddButton onClick={this.add} data-test-selector={`shell_addWidget_${zoneName}`}>
                                        <Icon src="PlusCircle" size={26} color="#4A4A4A" />
                                    </AddButton>
                                </AddContainer>
                            )}
                    </ZoneWrapper>
                </ZoneStyle>
            );
        }

        return <Wrapper fullHeight={this.props.fullHeight}>{renderedWidgets}</Wrapper>;
    }
}

export default withIsInShell(connect(mapStateToProps)(Zone));

const Wrapper = styled.div<{ fullHeight?: boolean }>`
    width: 100%;
    ${props => (props.fullHeight ? "height: 100%;" : "")}
`;

const ZoneStyle = styled.div`
    min-height: 20px;
    height: 100%;
    width: 100%;
`;

const ZoneWrapper = styled.div`
    border: 2px solid #0072bc;
    margin: 6px;
    height: calc(100% - 12px);
    width: calc(100% - 12px);
    &[data-dragging="true"] {
        padding-bottom: 42px;
    }
    padding-top: 4px;
    &[data-dragging="true"][data-empty="true"] {
        padding-top: 4px;
    }
`;

const ZonePlaceholder = styled.div`
    display: flex;
    height: 100%;
    min-width: 50px;
`;

const AddContainer = styled.div<{ fullHeight: boolean }>`
    display: flex;
    justify-content: center;
    ${props => (props.fullHeight ? "height: 100%" : "")};
`;

const AddButton = styled.div`
    cursor: pointer;
    padding: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 5px 0 7px;
    svg:hover {
        color: #9b9b9b;
    }
`;
