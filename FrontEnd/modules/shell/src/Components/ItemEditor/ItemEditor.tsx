import { Dictionary, SafeDictionary } from "@insite/client-framework/Common/Types";
import { getCurrentPage } from "@insite/client-framework/Store/Data/Pages/PageSelectors";
import FieldDefinition, {
    HideFromSearchEngines,
    HideFromSiteSearch,
} from "@insite/client-framework/Types/FieldDefinition";
import PageProps from "@insite/client-framework/Types/PageProps";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import Scrim from "@insite/mobius/Overlay/Scrim";
import FieldsEditor from "@insite/shell/Components/ItemEditor/FieldsEditor";
import SideBarForm from "@insite/shell/Components/Shell/SideBarForm";
import { getPageDefinition, getWidgetDefinition } from "@insite/shell/DefinitionLoader";
import { LoadedPageDefinition, LoadedWidgetDefinition } from "@insite/shell/DefinitionTypes";
import { getPageState } from "@insite/shell/Services/ContentAdminService";
import { removeWidget, replaceItem, updateField } from "@insite/shell/Store/Data/Pages/PagesActionCreators";
import { cancelEditingItem, doneEditingItem } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import cloneDeep from "lodash/cloneDeep";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

interface OwnProps {}

const mapStateToProps = (state: ShellState) => {
    let item: PageProps | WidgetProps | undefined;
    let definition: LoadedPageDefinition | LoadedWidgetDefinition | undefined;
    const currentPage = getCurrentPage(state);
    if (state.pageEditor.editingId) {
        if (state.pageEditor.editingId === currentPage.id) {
            item = currentPage;
            definition = cloneDeep(getPageDefinition(currentPage.type));
        } else {
            item = state.data.pages.widgetsById[state.pageEditor.editingId];
            if (item) {
                definition = getWidgetDefinition(item.type);
            }
        }
    }

    return {
        item,
        definition,
        itemBeforeEditing: state.pageEditor.itemBeforeEditing,
        language: state.shellContext.languagesById[state.shellContext.currentLanguageId]!,
        defaultLanguageId: state.shellContext.defaultLanguageId,
        personaId: state.shellContext.currentPersonaId,
        defaultPersonaId: state.shellContext.defaultPersonaId,
        deviceType: state.shellContext.currentDeviceType,
        removeItemIfCanceled: state.pageEditor.removeItemIfCanceled,
        isVariant: !!state.pageEditor.isEditingVariant,
        treeNodesByParentId: state.pageTree.treeNodesByParentId,
        headerTreeNodesByParentId: state.pageTree.headerTreeNodesByParentId,
        footerTreeNodesByParentId: state.pageTree.footerTreeNodesByParentId,
        mobileTreeNodesByParentId: state.pageTree.mobileTreeNodesByParentId,
        pageId: currentPage.id,
    };
};

const mapDispatchToProps = {
    updateField,
    doneEditingItem,
    cancelEditingItem,
    replaceItem,
    removeWidget,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

interface State {
    hasValidationErrors: boolean;
}

class ItemEditor extends React.Component<Props, State> {
    private hasValidationErrors: () => boolean;

    constructor(props: Props) {
        super(props);

        this.hasValidationErrors = () => false;
        this.state = {
            hasValidationErrors: false,
        };
    }

    updateField = (fieldName: string, value: any) => {
        const { item, definition, language, defaultLanguageId, personaId, defaultPersonaId, deviceType } = this.props;
        if (!item || !definition || !definition.fieldDefinitions) {
            return;
        }

        const fieldDefinition = definition.fieldDefinitions.filter(o => o.name === fieldName)[0];

        const parameter = {
            id: item.id,
            fieldName,
            value,
            fieldType: fieldDefinition.fieldType,
            language,
            defaultLanguageId,
            personaId,
            defaultPersonaId,
            deviceType,
        };
        this.props.updateField(parameter);
    };

    doneEditingItem = () => {
        if (!this.hasValidationErrors()) {
            this.props.doneEditingItem();
        }
    };

    cancelEditingItem = () => {
        const { itemBeforeEditing, cancelEditingItem, removeItemIfCanceled, removeWidget, replaceItem, pageId } =
            this.props;

        cancelEditingItem();
        if (removeItemIfCanceled) {
            removeWidget(itemBeforeEditing!.id, pageId);
        } else {
            replaceItem(itemBeforeEditing!);
        }
    };

    updateHasValidationErrors = (hasValidationErrors: boolean) => {
        this.setState({
            hasValidationErrors,
        });
    };

    registerHasValidationErrors = (validate: () => boolean) => {
        this.hasValidationErrors = validate;
    };

    render() {
        const {
            item,
            definition,
            isVariant,
            treeNodesByParentId,
            headerTreeNodesByParentId,
            footerTreeNodesByParentId,
            mobileTreeNodesByParentId,
        } = this.props;

        if (!item || !definition) {
            return null;
        }

        const fieldDefinitions = definition.fieldDefinitions ?? [];

        if (item.type === "VariantRootPage") {
            const currentPageState = getPageState(
                item.id,
                treeNodesByParentId[item.parentId],
                headerTreeNodesByParentId[item.parentId],
                footerTreeNodesByParentId[item.parentId],
                mobileTreeNodesByParentId[item.parentId],
            );

            if (currentPageState) {
                const childList =
                    treeNodesByParentId[currentPageState.nodeId] ||
                    headerTreeNodesByParentId[currentPageState.nodeId] ||
                    footerTreeNodesByParentId[currentPageState.nodeId] ||
                    mobileTreeNodesByParentId[currentPageState.nodeId];

                let variantDefinition: LoadedPageDefinition | undefined;
                for (const child of childList) {
                    if (!child.isVariant) {
                        continue;
                    }
                    variantDefinition = getPageDefinition(child.type);
                    break;
                }

                if (variantDefinition) {
                    const variantFieldDefinitions: SafeDictionary<FieldDefinition> = {};

                    (variantDefinition.fieldDefinitions ?? []).forEach(o => {
                        variantFieldDefinitions[o.name] = o;
                    });

                    const rootFieldDefinitions: SafeDictionary<FieldDefinition> = {};

                    fieldDefinitions.forEach(o => {
                        rootFieldDefinitions[o.name] = o;
                    });

                    for (let i = fieldDefinitions.length - 1; i >= 0; i--) {
                        if (!variantFieldDefinitions[fieldDefinitions[i].name]) {
                            fieldDefinitions.splice(i, 1);
                        }
                    }

                    if (variantFieldDefinitions["urlSegment"] && !rootFieldDefinitions["urlSegment"]) {
                        fieldDefinitions.unshift(variantFieldDefinitions["urlSegment"]);
                    }

                    if (variantFieldDefinitions["title"] && !rootFieldDefinitions["title"]) {
                        fieldDefinitions.unshift(variantFieldDefinitions["title"]);
                    }
                }
            }
        } else if (isVariant) {
            const rootFields = [
                "title",
                "urlSegment",
                "metaKeywords",
                "metaDescription",
                "hideFromSearchEngines",
                "hideFromSiteSearch",
                "excludeFromNavigation",
                "excludeFromSignInRequired",
            ];
            for (let i = fieldDefinitions.length - 1; i >= 0; --i) {
                for (let j = 0; j < rootFields.length; ++j) {
                    if (fieldDefinitions[i].name === rootFields[j]) {
                        fieldDefinitions.splice(i, 1);
                        break;
                    }
                }
            }
        }

        const removeFieldDefinitions = new Set();

        if (!isVariant) {
            removeFieldDefinitions.add("variantName");
        }

        if (!item.fields["layoutPage"]) {
            removeFieldDefinitions.add("layoutPage");
        }

        if (item.type === "Layout" || item.type === "VariantRootPage") {
            ["horizontalRule", "tags", "hideBreadcrumbs"].forEach(o => removeFieldDefinitions.add(o));
        }

        if (removeFieldDefinitions.size) {
            let tabName;
            const previousNameForTab: Dictionary<string> = {};
            for (let i = fieldDefinitions.length - 1; i >= 0; --i) {
                tabName = fieldDefinitions[i].tab?.displayName || "_";
                if (
                    removeFieldDefinitions.has(fieldDefinitions[i].name) ||
                    (previousNameForTab[tabName] === "horizontalRule" &&
                        previousNameForTab[tabName] === fieldDefinitions[i].name)
                ) {
                    fieldDefinitions.splice(i, 1);
                } else {
                    previousNameForTab[tabName] = fieldDefinitions[i].name;
                }
            }
        }

        if ((definition as LoadedPageDefinition).pageType === "System" && !isVariant) {
            let itemType = item.type;
            if (itemType === "VariantRootPage") {
                const currentPageState = getPageState(
                    item.id,
                    treeNodesByParentId[item.parentId],
                    headerTreeNodesByParentId[item.parentId],
                    footerTreeNodesByParentId[item.parentId],
                    mobileTreeNodesByParentId[item.parentId],
                );
                itemType = currentPageState?.type || "";
            }

            const skipTypes = new Set([
                "Header",
                "Footer",
                "Layout",
                "RobotsTxtPage",
                "ProductListPage",
                "ProductDetailsPage",
                "CategoryListPage",
                "CategoryDetailsPage",
                "NotFoundErrorPage",
                "UnhandledErrorModal",
                "UnhandledErrorPage",
            ]);
            if (!skipTypes.has(itemType)) {
                const fieldDefinitionSet = new Set(fieldDefinitions.map(o => o.name));
                if (!fieldDefinitionSet.has(HideFromSearchEngines.name)) {
                    fieldDefinitions.push(HideFromSearchEngines);
                }
                if (!fieldDefinitionSet.has(HideFromSiteSearch.name)) {
                    fieldDefinitions.push(HideFromSiteSearch);
                }
            }
        }

        return (
            <>
                <Scrim zIndexLevel="modal" />
                <SideBarForm
                    title={`Edit ${definition.displayName}`}
                    save={this.doneEditingItem}
                    name="EditItem"
                    cancel={this.cancelEditingItem}
                    disableSave={this.state.hasValidationErrors}
                >
                    <FieldsEditor
                        fieldDefinitions={fieldDefinitions}
                        item={item}
                        updateField={this.updateField}
                        registerHasValidationErrors={this.registerHasValidationErrors}
                        updateHasValidationErrors={this.updateHasValidationErrors}
                    />
                </SideBarForm>
            </>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ItemEditor);
