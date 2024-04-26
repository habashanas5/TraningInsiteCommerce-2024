import { AddWidgetData } from "@insite/client-framework/Common/FrameHole";
import { Dictionary } from "@insite/client-framework/Common/Types";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import WidgetGroups, { WidgetGroup } from "@insite/client-framework/Types/WidgetGroups";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Icon from "@insite/mobius/Icon";
import mobiusIconsObject from "@insite/mobius/Icons/commonIcons";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import TextField from "@insite/mobius/TextField";
import shellIconsObject from "@insite/shell/Components/Icons/CompatibleIcons/shellIcons";
import { getWidgetDefinition, getWidgetDefinitions } from "@insite/shell/DefinitionLoader";
import { LoadedWidgetDefinition } from "@insite/shell/DefinitionTypes";
import { setupWidgetModel } from "@insite/shell/Services/WidgetCreation";
import { ShellThemeProps } from "@insite/shell/ShellTheme";
import { addWidget } from "@insite/shell/Store/Data/Pages/PagesActionCreators";
import { editWidget, hideAddWidgetModal, savePage } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import sortBy from "lodash/sortBy";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled, { css } from "styled-components";

const iconsObject = { ...shellIconsObject, ...mobiusIconsObject };

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const mapStateToProps = (state: ShellState) => {
    const currentPage = getCurrentPage(state);
    const pageType = currentPage.type;
    const groups: WidgetGroup[] = [];
    const widgetsByGroup: Dictionary<LoadedWidgetDefinition[]> = {};

    for (const widgetDefinition of getWidgetDefinitions()) {
        if (widgetDefinition.isDeprecated) {
            continue;
        }

        if (widgetDefinition.allowedContexts && widgetDefinition.allowedContexts.indexOf(pageType) < 0) {
            continue;
        }

        if (widgetDefinition.canAdd && !widgetDefinition.canAdd(state.shellContext)) {
            continue;
        }

        if (state.shellContext.mobileCmsModeActive && widgetDefinition.group !== "Mobile") {
            continue;
        }
        if (!state.shellContext.mobileCmsModeActive && widgetDefinition.group === "Mobile") {
            continue;
        }

        if (!widgetDefinition.group) {
            continue;
        }

        if (!widgetsByGroup[widgetDefinition.group]) {
            groups.push(widgetDefinition.group);
            widgetsByGroup[widgetDefinition.group] = [];
        }

        widgetsByGroup[widgetDefinition.group].push(widgetDefinition);
    }

    for (const groupKey in widgetsByGroup) {
        widgetsByGroup[groupKey].sort((a, b) => (a.displayName || "").localeCompare(b.displayName || ""));
    }

    return {
        page: currentPage,
        currentLanguage: state.shellContext.languagesById[state.shellContext.currentLanguageId]!,
        defaultLanguageId: state.shellContext.defaultLanguageId,
        currentPersonaId: state.shellContext.currentPersonaId,
        currentDeviceType: state.shellContext.currentDeviceType,
        defaultPersonaId: state.shellContext.defaultPersonaId,
        addWidgetData: state.pageEditor.addWidgetData,
        widgetsByGroup,
        groups: sortBy(groups, [o => WidgetGroups.indexOf(o)]),
    };
};

const mapDispatchToProps = {
    addWidget,
    savePage,
    editWidget,
    hideAddWidgetModal,
};

interface State {
    widgetSearch: string;
}

interface AddWidgetModalStyles {
    modal: ModalPresentationProps;
}

const styles: AddWidgetModalStyles = {
    modal: {
        size: 900,
        cssOverrides: {
            modalContent: css`
                overflow-y: hidden;
            `,
        },
    },
};

class AddWidgetModal extends React.Component<Props, State> {
    searchInputWrapper = React.createRef<HTMLInputElement>();
    lastAddWidgetData?: AddWidgetData;

    constructor(props: Props) {
        super(props);

        this.state = {
            widgetSearch: "",
        };
    }

    close = () => {
        this.props.hideAddWidgetModal();
    };

    searchChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            widgetSearch: event.currentTarget.value,
        });
    };

    addWidget = (widgetDefinition: LoadedWidgetDefinition) => {
        const {
            addWidgetData,
            addWidget,
            currentLanguage,
            defaultLanguageId,
            currentPersonaId,
            defaultPersonaId,
            currentDeviceType,
            savePage,
            editWidget,
            hideAddWidgetModal,
            page,
        } = this.props;
        if (!addWidgetData) {
            return;
        }

        const newWidget = setupWidgetModel(
            widgetDefinition,
            addWidgetData.parentId,
            addWidgetData.zoneName,
            currentLanguage,
            defaultLanguageId,
            currentDeviceType,
            currentPersonaId,
            defaultPersonaId,
        ) as WidgetProps;

        if (page.type === "Layout") {
            newWidget.isLayout = true;
        }

        addWidget(newWidget, addWidgetData.sortOrder, page.id);
        editWidget(newWidget.id, true);
        hideAddWidgetModal();
        savePage();
    };

    render() {
        const { groups, widgetsByGroup, addWidgetData } = this.props;

        if (addWidgetData?.addRow && !this.lastAddWidgetData?.addRow) {
            this.addWidget(getWidgetDefinition("Basic/Row"));
        }

        setTimeout(() => {
            if (addWidgetData && !this.lastAddWidgetData && this.searchInputWrapper.current) {
                this.searchInputWrapper.current.querySelector("input")!.focus();
            }
            this.lastAddWidgetData = addWidgetData;
        });

        const { widgetSearch } = this.state;
        let displayedWidgetsByGroup: Dictionary<LoadedWidgetDefinition[]> = {};
        if (widgetSearch) {
            Object.keys(widgetsByGroup).forEach(groupName => {
                const possibleWidgets = widgetsByGroup[groupName];
                for (const widget of possibleWidgets) {
                    if (widget.displayName!.toLowerCase().indexOf(widgetSearch.toLowerCase()) >= 0) {
                        if (!displayedWidgetsByGroup[groupName]) {
                            displayedWidgetsByGroup[groupName] = [];
                        }
                        displayedWidgetsByGroup[groupName].push(widget);
                    }
                }
            });
        } else {
            displayedWidgetsByGroup = widgetsByGroup;
        }

        return (
            <Modal
                {...styles.modal}
                headline="Add Widget"
                handleClose={this.close}
                isOpen={!!addWidgetData && !addWidgetData.addRow}
            >
                <WidgetListWidgets ref={this.searchInputWrapper} data-test-selector="addWidgetModal">
                    <TextField
                        value={this.state.widgetSearch}
                        placeholder="Search Widgets"
                        onChange={this.searchChange}
                        cssOverrides={{ formInputWrapper: formInputWrapperCss, formField: formFieldCss }}
                        iconProps={{ src: "Search" }}
                    />
                    <WidgetListScroller>
                        {groups.map(
                            displayName =>
                                displayedWidgetsByGroup[displayName] && (
                                    <WidgetListGroup key={displayName}>
                                        <WidgetListHeader>{displayName} elements</WidgetListHeader>
                                        <WidgetListItems>
                                            {displayedWidgetsByGroup[displayName].map(widgetDefinition => (
                                                <WidgetListItemStyle
                                                    key={widgetDefinition.type}
                                                    onClick={() => this.addWidget(widgetDefinition)}
                                                    data-test-selector={`addWidgetModal_${widgetDefinition.displayName}`}
                                                >
                                                    <Icon src={iconsObject[widgetDefinition.icon || "NoIcon"]} />
                                                    {widgetDefinition.displayName}
                                                </WidgetListItemStyle>
                                            ))}
                                        </WidgetListItems>
                                    </WidgetListGroup>
                                ),
                        )}
                    </WidgetListScroller>
                </WidgetListWidgets>
            </Modal>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddWidgetModal);

const formInputWrapperCss = css`
    margin-bottom: 10px;
    width: 300px;
`;

const formFieldCss = css`
    margin-top: 0;
`;

const WidgetListWidgets = styled.div`
    display: flex;
    flex-wrap: wrap;
    font-size: 16px;
    height: 80vh;
`;

const WidgetListScroller = styled.div`
    height: calc(80vh - 85px);
    overflow-y: auto;
    padding-right: 5px;
    margin-bottom: 0;
    width: 100%;
`;

const WidgetListGroup = styled.div`
    border-radius: 4px;
    border: 1px solid ${(props: ShellThemeProps) => props.theme.colors.text.main};
    margin-bottom: 20px;
    background-color: white;
`;

const WidgetListHeader = styled.h3`
    && {
        background-color: ${(props: ShellThemeProps) => props.theme.colors.text.main};
        width: 100%;
        font-size: 14px;
        color: white;
        text-transform: uppercase;
        padding: 4px 8px;
    }
`;

const WidgetListItems = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding: 4px;
`;

const WidgetListItemStyle = styled.div`
    flex-basis: 8.75%;
    border-radius: 4px;
    font-size: 13px;
    margin: 5px;
    display: flex;
    text-align: center;
    align-items: center;
    padding: 2px 5px;
    cursor: pointer;
    overflow: hidden;
    min-height: 36px;
    flex-direction: column;
`;
