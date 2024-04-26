import { AddWidgetData } from "@insite/client-framework/Common/FrameHole";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { changeContext } from "@insite/client-framework/Store/Data/Pages/PagesActionCreators";
import { PersonaModel } from "@insite/client-framework/Types/ApiModels";
import { PageDefinition } from "@insite/client-framework/Types/ContentItemDefinitions";
import AddWidgetModal from "@insite/shell/Components/Modals/AddWidgetModal";
import { HasConfirmationContext, withConfirmation } from "@insite/shell/Components/Modals/ConfirmationContext";
import { closeSiteHole, sendToSite, setSiteFrame } from "@insite/shell/Components/Shell/SiteHole";
import { getPageDefinitions } from "@insite/shell/DefinitionLoader";
import { getPageState, getPageStateFromDictionaries } from "@insite/shell/Services/ContentAdminService";
import { moveWidgetTo, removeWidget } from "@insite/shell/Store/Data/Pages/PagesActionCreators";
import { loadPageOnSite } from "@insite/shell/Store/Data/Pages/PagesHelpers";
import {
    displayAddWidgetModal,
    editWidget,
    reloadPage,
    savePage,
} from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router";
import styled from "styled-components";

interface OwnProps {
    pageId: string;
}

const mapStateToProps = (state: ShellState) => ({
    stageMode: state.shellContext.stageMode,
    isEditMode: state.shellContext.contentMode === "Editing",
    selectedProductPath: state.pageEditor.selectedProductPath,
    selectedCategoryPath: state.pageEditor.selectedCategoryPath,
    selectedBrandPath: state.pageEditor.selectedBrandPath,
    currentLanguageId: state.shellContext.currentLanguageId,
    currentPersonaId: state.shellContext.currentPersonaId,
    currentDeviceType: state.shellContext.currentDeviceType,
    draggingWidgetId: state.data.pages.draggingWidgetId,
    permissions: state.shellContext.permissions,
    nodesByParentId: state.pageTree.treeNodesByParentId,
    headerNodesByParentId: state.pageTree.headerTreeNodesByParentId,
    footerNodesByParentId: state.pageTree.footerTreeNodesByParentId,
    mobileNodesByParentId: state.pageTree.mobileTreeNodesByParentId,
    updatedLayoutIds: state.pageEditor.updatedLayoutIds,
    futurePublishNodeIds: state.pageTree.futurePublishNodeIds,
});

const mapDispatchToProps = {
    moveWidgetTo,
    displayAddWidgetModal,
    editWidget,
    savePage,
    removeWidget,
    changeContext,
    reloadPage,
};

type Props = ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps> &
    OwnProps &
    RouteComponentProps &
    HasConfirmationContext;

interface State {
    lastPageId: string;
}

class SiteFrame extends React.Component<Props, State> {
    private framePageId = "";

    componentDidUpdate(prevProps: Props) {
        if (this.props.draggingWidgetId && this.props.draggingWidgetId !== prevProps.draggingWidgetId) {
            sendToSite({
                type: "BeginDraggingWidget",
                id: this.props.draggingWidgetId,
            });
        } else if (!this.props.draggingWidgetId && this.props.draggingWidgetId !== prevProps.draggingWidgetId) {
            sendToSite({
                type: "EndDraggingWidget",
            });
        }

        if (
            this.props.currentLanguageId !== prevProps.currentLanguageId ||
            this.props.currentPersonaId !== prevProps.currentPersonaId ||
            this.props.currentDeviceType !== prevProps.currentDeviceType
        ) {
            sendToSite({
                type: "ChangeLanguage",
                languageId: this.props.currentLanguageId,
            });
            closeSiteHole();
        }

        if (this.props.selectedProductPath !== prevProps.selectedProductPath) {
            sendToSite({
                type: "SelectProduct",
                productPath: this.props.selectedProductPath,
            });
        }

        if (this.props.selectedCategoryPath !== prevProps.selectedCategoryPath) {
            sendToSite({
                type: "SelectCategory",
                categoryPath: this.props.selectedCategoryPath,
            });
        }

        if (this.props.selectedBrandPath !== prevProps.selectedBrandPath) {
            sendToSite({
                type: "SelectBrand",
                brandPath: this.props.selectedBrandPath,
            });
        }
    }

    render() {
        const {
            pageId,
            stageMode,
            isEditMode,
            history: {
                location: { search },
            },
            permissions,
        } = this.props;

        const url = pageId.startsWith("SwitchTo") ? pageId.replace("SwitchTo", "") + search : `/Content/Page/${pageId}`;

        if (this.framePageId !== pageId) {
            loadPageOnSite(pageId);
        }

        return (
            <SiteFrameStyle stageMode={stageMode}>
                {isEditMode && permissions?.canAddWidget && (
                    <>
                        <AddWidgetModal />
                    </>
                )}
                <ActualFrame url={url || "/"} onLoad={this.onLoad} />
            </SiteFrameStyle>
        );
    }

    onLoad = (event: React.MouseEvent<HTMLIFrameElement>) => {
        const iframe = event.currentTarget;
        const iframeWindow = iframe.contentWindow as WindowProxy;

        const bubbleEvent = (eventType: "mousemove" | "click" | "mousedown") => {
            iframeWindow.addEventListener(eventType, (event: MouseEvent) => {
                const boundingClientRect = iframe.getBoundingClientRect();
                const bubbledEvent = new MouseEvent(eventType, {
                    bubbles: true,
                    cancelable: false,
                    // we add these just to later remove them because the SiteFrameStyle mouseMove has to remove them.
                    clientX: event.clientX + boundingClientRect.left,
                    clientY: event.clientY + boundingClientRect.top,
                });
                iframe.dispatchEvent(bubbledEvent);
            });
        };

        bubbleEvent("mousemove");
        bubbleEvent("click");
        bubbleEvent("mousedown");

        setSiteFrame(iframe, {
            LoadPageComplete: (data: { pageId: string; parentId: string; layoutPageId: string | undefined }) => {
                const url = `/ContentAdmin/Page/${data.pageId}`;
                this.framePageId = data.pageId;
                this.props.history.push(url);

                const pageDefinitions = getPageDefinitions();
                const pageDefinitionsByType: SafeDictionary<Pick<PageDefinition, "pageType">> = {};
                pageDefinitions.forEach(definition => {
                    pageDefinitionsByType[definition.type] = { pageType: definition.pageType };
                });

                const pageState =
                    getPageState(
                        data.pageId,
                        this.props.nodesByParentId[data.parentId],
                        this.props.headerNodesByParentId[data.parentId],
                        this.props.footerNodesByParentId[data.parentId],
                        this.props.mobileNodesByParentId[data.parentId],
                    ) ||
                    getPageStateFromDictionaries(
                        data.pageId,
                        this.props.nodesByParentId,
                        this.props.headerNodesByParentId,
                        this.props.footerNodesByParentId,
                        this.props.mobileNodesByParentId,
                    );

                const key =
                    pageState && (pageState.isVariant ? `${pageState.nodeId}_${pageState.pageId}` : pageState.nodeId);

                sendToSite({
                    type: "CMSPermissions",
                    permissions: this.props.permissions,
                    canChangePage:
                        !key ||
                        !this.props.futurePublishNodeIds[key] ||
                        this.props.futurePublishNodeIds[key] <= new Date(),
                });

                sendToSite({
                    type: "PageDefinitions",
                    pageDefinitionsByType,
                });

                if (data.layoutPageId && this.props.updatedLayoutIds?.[data.layoutPageId]) {
                    this.props.reloadPage(data.pageId);
                }
            },
            MoveWidgetTo: (data: { id: string; parentId: string; zoneName: string; index: number; pageId: string }) => {
                this.props.moveWidgetTo(data.id, data.parentId, data.zoneName, data.index, data.pageId);
                this.props.savePage();
            },
            AddRow: (data: AddWidgetData) => {
                this.props.displayAddWidgetModal(data);
            },
            DisplayWidgetModal: (data: AddWidgetData) => {
                this.props.displayAddWidgetModal(data);
            },
            EditWidget: (data: { id: string }) => {
                this.props.editWidget(data.id);
            },
            ConfirmWidgetDeletion: (data: { id: string; widgetType: string; pageId: string }) => {
                this.props.confirmation.display({
                    message: "Are you sure you want to delete this widget?",
                    title: `Delete ${data.widgetType}`,
                    onConfirm: () => {
                        this.props.removeWidget(data.id, data.pageId);
                        this.props.savePage();
                    },
                });
            },
            ChangeWebsiteLanguage: (data: { languageId: string }) => {
                this.props.changeContext(data.languageId, this.props.currentPersonaId, this.props.currentDeviceType);
            },
            FrontEndSessionLoaded: (data: { personas: PersonaModel[] }) => {
                if (!data.personas.length) {
                    return;
                }
                this.props.changeContext(
                    this.props.currentLanguageId,
                    data.personas[0].id,
                    this.props.currentDeviceType,
                );
            },
        });
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withConfirmation(SiteFrame)));

const SiteFrameStyle = styled.div<Pick<ShellState["shellContext"], "stageMode">>`
    position: relative;
    width: 100%;
    height: 100%;
    iframe {
        width: 100%;
        height: ${
            /* sc-value */ ({ stageMode }) => {
                switch (stageMode) {
                    case "Desktop":
                        return "calc(100%)";
                    case "Tablet":
                        return "1024px";
                    case "Phone":
                        return "813px";
                }
            }
        };
        border: none;
    }
`;

class ActualFrame extends React.Component<{
    url: string;
    onLoad: (event: React.MouseEvent<HTMLIFrameElement>) => void;
}> {
    shouldComponentUpdate() {
        return false;
    }

    render() {
        return <iframe id="siteIFrame" src={this.props.url} onLoad={this.props.onLoad} />;
    }
}
