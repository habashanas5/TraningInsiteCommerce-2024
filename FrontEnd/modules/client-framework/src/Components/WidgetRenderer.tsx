import {
    createWidgetElement,
    registerWidgetUpdate,
    unregisterWidgetUpdate,
} from "@insite/client-framework/Components/ContentItemStore";
import { HasShellContext, withIsInShell } from "@insite/client-framework/Components/IsInShell";
import { sendToShell } from "@insite/client-framework/Components/ShellHole";
import logger from "@insite/client-framework/Logger";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { beginDraggingWidget, endDraggingWidget } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import Icon from "@insite/mobius/Icon";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

interface OwnProps {
    id: string;
    type: string;
    fixed: boolean;
    isLayout: boolean;
    pageId: string;
}

interface State {
    hasError: boolean;
    error?: Error;
}

const mapStateToProps = (state: ApplicationState, { id }: OwnProps) => {
    const {
        data: {
            pages: { widgetsById, draggingWidgetId, pageDefinitionsByType },
        },
        context: { permissions, canChangePage },
    } = state;
    return {
        widget: widgetsById[id],
        draggingWidgetId,
        permissions,
        canChangePage,
        currentPageType: getCurrentPage(state).type,
        pageDefinitionsByType,
    };
};

const mapDispatchToProps = {
    beginDraggingWidget,
    endDraggingWidget,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps & HasShellContext;

const ErrorWithWidgetStyle = styled.div`
    color: red;
`;

class WidgetRenderer extends React.PureComponent<Props, State> {
    // this is required because firefox doesn't set clientY in the drag event that uses this below
    private clientY = 0;
    private readonly widgetHover = React.createRef<HTMLDivElement>();

    constructor(props: Props) {
        super(props);

        this.state = {
            hasError: false,
        };
    }

    static getDerivedStateFromError(error: Error) {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        logger.error(error);
    }

    componentDidMount() {
        document.addEventListener("dragover", this.documentDragOver);
        if (module.hot) {
            this.forceUpdate = this.forceUpdate.bind(this);
            registerWidgetUpdate(this.forceUpdate);
        }
    }

    componentWillUnmount() {
        document.removeEventListener("dragover", this.documentDragOver);
        if (module.hot) {
            unregisterWidgetUpdate(this.forceUpdate);
        }
    }

    documentDragOver = (event: DragEvent) => {
        this.clientY = event.clientY;
    };

    editWidget = () => {
        sendToShell({
            type: "EditWidget",
            id: this.props.id,
        });
    };

    removeWidget = () => {
        sendToShell({
            type: "ConfirmWidgetDeletion",
            id: this.props.id,
            widgetType: this.props.widget.type,
            pageId: this.props.pageId,
        });
    };

    dragHandleMouseDown = () => {
        if (this.props.fixed || this.props.isLayout || !this.canMoveWidget()) {
            return;
        }
        this.widgetHover.current!.setAttribute("draggable", "true");
    };

    scrollIfNeededId: number | undefined;
    scrollStep: number | undefined;

    dragStart = () => {
        this.props.beginDraggingWidget(this.props.widget!.id);
        setTimeout(() => {
            const { current } = this.widgetHover;
            current!.style.display = "none";
            current!.parentElement!.parentElement!.setAttribute("data-dragging", "");
        });
        this.scrollIfNeededId = setInterval(this.scrollIfNeeded, 20);
    };

    dragEnd = () => {
        const { current } = this.widgetHover;
        current!.setAttribute("draggable", "false");
        current!.parentElement!.parentElement!.removeAttribute("data-dragging");
        current!.style.display = "";
        this.props.endDraggingWidget();
        clearInterval(this.scrollIfNeededId);
    };

    drag = () => {
        const top = this.clientY;
        const bottom = document.documentElement.clientHeight - this.clientY;
        const fastStep = 30;
        const fastZone = 40;
        const slowStep = 20;
        const slowZone = 80;

        if (top < fastZone) {
            this.scrollStep = -fastStep;
        } else if (top < slowZone) {
            this.scrollStep = -slowStep;
        } else if (bottom < fastZone) {
            this.scrollStep = fastStep;
        } else if (bottom < slowZone) {
            this.scrollStep = slowStep;
        } else {
            this.scrollStep = undefined;
        }
    };

    scrollIfNeeded = () => {
        if (!this.scrollStep) {
            return;
        }
        window.scrollTo({ top: window.pageYOffset + this.scrollStep });
    };

    private canEditWidget = () => {
        return (
            this.props.canChangePage &&
            this.props.permissions?.canEditWidget &&
            (!this.isAdvancedWidget() || this.canEditAdvancedWidgets())
        );
    };

    private canMoveWidget = () => {
        const pageDefinition = this.props.pageDefinitionsByType?.[this.props.currentPageType];
        return (
            pageDefinition &&
            this.props.canChangePage &&
            ((this.props.permissions?.canMoveWidgets && pageDefinition.pageType === "Content") ||
                (this.props.permissions?.canMoveSystemWidgets && pageDefinition.pageType === "System")) &&
            (!this.isAdvancedWidget() || this.canEditAdvancedWidgets())
        );
    };

    private canDeleteWidget = () => {
        const pageDefinition = this.props.pageDefinitionsByType?.[this.props.currentPageType];
        return (
            pageDefinition &&
            this.props.canChangePage &&
            ((this.props.permissions?.canDeleteWidget && pageDefinition.pageType === "Content") ||
                (this.props.permissions?.canDeleteSystemWidget && pageDefinition.pageType === "System")) &&
            (!this.isAdvancedWidget() || this.canEditAdvancedWidgets())
        );
    };

    private isAdvancedWidget = () => {
        return this.props.widget.type === "Basic/CodeSnippet";
    };

    private canEditAdvancedWidgets = () => {
        return this.props.permissions?.canUseAdvancedFeatures || false;
    };

    render() {
        const { type, widget, draggingWidgetId, shellContext, fixed, isLayout } = this.props;

        const { isEditing, isCurrentPage, isInShell } = shellContext;

        if (this.state.hasError) {
            if (isInShell) {
                return (
                    <ErrorWithWidgetStyle>
                        There was an unhandled exception that occurred while trying to render the widget:{" "}
                        {this.state.error}. See the console for more details.
                    </ErrorWithWidgetStyle>
                );
            }

            return <ErrorWithWidgetStyle>An error occurred.</ErrorWithWidgetStyle>;
        }

        const widgetElement = createWidgetElement(type, widget);

        if (isInShell && isEditing && isCurrentPage && !isLayout) {
            // this extra div appears necessary to make sure data-widget shows up if the server renders the wrong version of isInShell
            return (
                <div data-widget={type}>
                    <WidgetStyle>
                        {(!draggingWidgetId || draggingWidgetId === widget.id) && (
                            <HoverStyle
                                ref={this.widgetHover}
                                onDragStart={this.dragStart}
                                onDrag={this.drag}
                                onDragEnd={this.dragEnd}
                                data-test-selector={`widgetHover_${type}`}
                            >
                                <WidgetHoverNameStyle
                                    fixed={fixed || !this.canMoveWidget()}
                                    onMouseDown={this.dragHandleMouseDown}
                                    data-test-selector="widgetHover_title"
                                >
                                    {widget.type}
                                </WidgetHoverNameStyle>
                                {this.canEditWidget() && (
                                    <IconLink
                                        onClick={this.editWidget}
                                        data-test-selector="widgetHover_edit"
                                        title="Edit"
                                    >
                                        <Icon src="Edit" size={20} color="#fff" />
                                    </IconLink>
                                )}
                                {!fixed && this.canDeleteWidget() && (
                                    <IconLink
                                        onClick={this.removeWidget}
                                        title="Delete"
                                        data-test-selector="widgetHover_delete"
                                    >
                                        <Icon src="Trash2" size={20} color="#fff" />
                                    </IconLink>
                                )}
                            </HoverStyle>
                        )}
                        <WidgetWrapper data-test-selector="widgetWrapper">
                            {draggingWidgetId === widget.id && <WidgetDisabler />}
                            {widgetElement}
                            <WidgetClearer></WidgetClearer>
                        </WidgetWrapper>
                    </WidgetStyle>
                </div>
            );
        }
        if (isInShell && isCurrentPage) {
            return <div data-widget={type}>{widgetElement}</div>;
        }

        return widgetElement;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withIsInShell(WidgetRenderer));

const IconLink = styled.a`
    svg:hover {
        color: #fff;
    }
`;

const HoverStyle = styled.div`
    display: none;
    position: absolute;
    background-color: #4a4a4a;
    color: white;
    top: 42px;
    left: 4px;
    transform: translate(0, -100%);
    align-items: center;
    z-index: 10;
    a {
        padding: 9px 6px 5px;
        cursor: pointer;
    }
    a:hover {
        background-color: black;
    }
`;

const WidgetHoverNameStyle = styled.span<{ fixed: boolean }>`
    padding: 0 12px;
    margin-right: 20px;
    font-weight: 300;
    font-size: 15px;
    letter-spacing: 0.5px;
    cursor: ${props => (!props.fixed ? "grab" : "auto")};
    white-space: nowrap;
`;

const WidgetWrapper = styled.div`
    border: 1px solid #999;
    min-height: 8px;
    padding: 1px;
    &[data-dragging="true"] {
        background-color: grey;
    }
    position: relative;
`;

const WidgetStyle = styled.div`
    padding: 40px 4px 4px;
    position: relative;

    &:hover > ${WidgetWrapper} {
        border: 2px solid #000;
        padding: 0;
    }

    &:hover > ${HoverStyle} {
        display: flex;
    }
`;

const WidgetDisabler = styled.div`
    background-color: rgba(150, 150, 150, 0.5);
    position: absolute;
    height: 100%;
    width: 100%;
    top: 0;
    left: 0;
    z-index: 10;
`;

const WidgetClearer = styled.div`
    clear: both;
`;
