import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { pageDefinitions } from "@insite/client-framework/Components/ContentItemStore";
import { TemplateInfo } from "@insite/client-framework/Types/SiteGenerationModel";
import Checkbox from "@insite/mobius/Checkbox";
import Scrim from "@insite/mobius/Overlay/Scrim";
import Select from "@insite/mobius/Select";
import TextField from "@insite/mobius/TextField";
import SideBarForm from "@insite/shell/Components/Shell/SideBarForm";
import { getPageDefinitions } from "@insite/shell/DefinitionLoader";
import { getPageState } from "@insite/shell/Services/ContentAdminService";
import { getTemplatePaths } from "@insite/shell/Services/SpireService";
import { addPage, cancelAddPage } from "@insite/shell/Store/PageTree/PageTreeActionCreators";
import { TreeNodeModel } from "@insite/shell/Store/PageTree/PageTreeState";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled from "styled-components";

interface OwnProps {
    addingPageUnderId: string;
    addingPageUnderType: string;
    copyDisplayName: string;
    copyType: string;
    copyPageId: string;
    variantType: string;
    variantPageName: string;
    variantPageId: string;
    isLayout: boolean;
}

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

const mapStateToProps = (state: ShellState) => {
    const {
        pageTree: {
            treeNodesByParentId,
            headerTreeNodesByParentId,
            footerTreeNodesByParentId,
            mobileTreeNodesByParentId,
            layoutTreeNodesByParentId,
        },
    } = state;

    return {
        pageDefinitions: getPageDefinitions(),
        treeNodesByParentId,
        headerTreeNodesByParentId,
        footerTreeNodesByParentId,
        mobileTreeNodesByParentId,
        layouts: layoutTreeNodesByParentId[emptyGuid] || [],
    };
};

const mapDispatchToProps = {
    addPage,
    cancelAddPage,
};

interface State {
    selectedPageType: string;
    pageName: string;
    variantName: string;
    pageTypeError: string;
    pageNameError: string;
    savingPage: boolean;
    templates: TemplateInfo[];
    selectedPageTemplate: string;
    pageTemplateError: string;
    variantNameError: string;
    copyVariantContent: boolean;
    selectedLayoutId: string;
    selectedAllowedForPageType: string;
    allowedForPageTypeError: string;
}

class AddPage extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedPageType: this.props.isLayout ? "Layout" : props.copyType || props.variantType,
            pageName: props.copyDisplayName || props.variantPageName,
            variantName: "",
            pageTypeError: "",
            pageNameError: "",
            variantNameError: "",
            savingPage: false,
            templates: [],
            selectedPageTemplate: "",
            pageTemplateError: "",
            copyVariantContent: false,
            selectedLayoutId: "",
            selectedAllowedForPageType: "",
            allowedForPageTypeError: "",
        };
    }

    addPage = () => {
        const {
            selectedPageType,
            selectedPageTemplate,
            pageName,
            variantName,
            copyVariantContent,
            selectedLayoutId,
            selectedAllowedForPageType,
        } = this.state;

        const isVariant = !!this.props.variantPageId;

        let pageTypeError = "";
        if (!selectedPageType) {
            pageTypeError = "Page Type is Required";
        }
        let pageNameError = "";
        if (!pageName) {
            pageNameError = "Display Name is Required";
        } else if (pageName.length > 100) {
            pageNameError = "Display Name is too long, limit is 100 characters";
        }
        let pageTemplateError = "";
        if (!selectedPageTemplate && this.state.templates.length > 1) {
            pageTemplateError = "Page Template is Required";
        }
        let variantNameError = "";
        if (isVariant && !variantName) {
            variantNameError = "Variant Name is Required";
        }
        let allowedForPageTypeError = "";
        if (this.props.isLayout && !selectedAllowedForPageType) {
            allowedForPageTypeError = "Allowed for Page Type is Required";
        }

        if (pageTypeError || pageNameError || pageTemplateError || variantNameError || allowedForPageTypeError) {
            this.setState({
                pageTypeError,
                pageNameError,
                pageTemplateError,
                variantNameError,
                allowedForPageTypeError,
            });
            return;
        }

        this.setState({
            savingPage: true,
        });

        let variantPageId = this.props.variantPageId;

        if (isVariant) {
            const parentId = this.props.addingPageUnderId;
            const rootPageState = getPageState(
                variantPageId,
                this.props.treeNodesByParentId[parentId],
                this.props.headerTreeNodesByParentId[parentId],
                this.props.footerTreeNodesByParentId[parentId],
                this.props.mobileTreeNodesByParentId[parentId],
            );

            if (rootPageState?.isRootVariant) {
                const childList =
                    this.props.treeNodesByParentId[rootPageState.nodeId] ||
                    this.props.headerTreeNodesByParentId[rootPageState.nodeId] ||
                    this.props.footerTreeNodesByParentId[rootPageState.nodeId] ||
                    this.props.mobileTreeNodesByParentId[rootPageState.nodeId];

                for (const child of childList) {
                    if (!child.isVariant || !child.isDefaultVariant) {
                        continue;
                    }
                    variantPageId = child.pageId;
                    break;
                }
            }
        }

        let layoutPageName: string | undefined;
        if (selectedLayoutId) {
            layoutPageName = this.props.layouts.find(o => o.pageId === selectedLayoutId)?.displayName;
        }

        this.props.addPage({
            pageType: selectedPageType,
            pageName: isVariant ? variantName : pageName,
            parentId: this.props.addingPageUnderId,
            copyPageId: this.props.copyPageId || variantPageId,
            pageTemplate: this.state.selectedPageTemplate,
            isVariant,
            copyVariantContent,
            layoutId: selectedLayoutId,
            allowedForPageType: selectedAllowedForPageType,
            layoutPageName,
            afterSavePage: ({ duplicatesFound }) => {
                if (!duplicatesFound) {
                    return;
                }

                this.setState({
                    savingPage: false,
                });
            },
        });
    };

    cancel = () => {
        this.props.cancelAddPage();
    };

    onAllowedForPageTypeChange = (event: React.FormEvent<HTMLSelectElement>) => {
        const allowedForPageType = event.currentTarget.value;
        this.setState({
            selectedAllowedForPageType: allowedForPageType,
            allowedForPageTypeError: "",
        });
    };

    onPageTypeChange = (event: React.FormEvent<HTMLSelectElement>) => {
        const pageType = event.currentTarget.value;
        getTemplatePaths(pageType).then(templates => {
            this.setState({
                selectedPageType: pageType,
                pageTypeError: "",
                templates,
                selectedPageTemplate: templates.length === 1 ? templates[0].fullPath : "",
                pageTemplateError: "",
            });
        });
    };

    onLayoutChange = (event: React.FormEvent<HTMLSelectElement>) => {
        const layoutId = event.currentTarget.value;
        this.setState({
            selectedLayoutId: layoutId,
        });
    };

    onPageTemplateChange = (event: React.FormEvent<HTMLSelectElement>) => {
        this.setState({
            selectedPageTemplate: event.currentTarget.value,
        });
    };

    onNameChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            pageName: event.currentTarget.value,
            pageNameError: "",
        });
    };

    onVariantNameChange = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            variantName: event.currentTarget.value,
            variantNameError: "",
        });
    };

    onCopyVariantContent = (_: React.SyntheticEvent<Element, Event>, value: boolean) => {
        this.setState({
            copyVariantContent: value,
        });
    };

    render() {
        let title = "Create A New Page";
        let name = "AddPage";
        let saveText = "Continue";

        if (this.props.copyPageId) {
            title = "Copy Page";
            name = "CopyPage";
            saveText = "Create Page";
        } else if (this.props.variantPageId) {
            title = "Create Variant";
            name = "CreateVariant";
            saveText = "Save";
        } else if (this.props.isLayout) {
            title = "Create Layout";
            name = "CreateLayout";
            saveText = "Save";
        }

        let allowedPagesTypes = this.props.pageDefinitions.filter(o => o.pageType === "Content" && o.type !== "Layout");

        if (this.props.addingPageUnderType) {
            const currentPageDefinition = this.props.pageDefinitions.find(
                o => o.type === this.props.addingPageUnderType,
            );
            if (currentPageDefinition?.allowedChildren?.length) {
                allowedPagesTypes = allowedPagesTypes.filter(possibleAllowedPageType =>
                    currentPageDefinition.allowedChildren!.find(
                        allowedChild => allowedChild.toLowerCase() === possibleAllowedPageType.type.toLowerCase(),
                    ),
                );
            }

            for (let x = allowedPagesTypes.length - 1; x--; x >= 0) {
                const possibleAllowedPageType = allowedPagesTypes[x];
                if (
                    possibleAllowedPageType.allowedParents &&
                    !possibleAllowedPageType.allowedParents.find(
                        o => o.toLowerCase() === this.props.addingPageUnderType,
                    )
                ) {
                    allowedPagesTypes.splice(x, 1);
                }
            }
        }

        return (
            <>
                <Scrim zIndexLevel="modal" />
                <SideBarForm
                    title={title}
                    name={name}
                    cancel={this.cancel}
                    save={this.addPage}
                    saveText={saveText}
                    disableSave={this.state.savingPage}
                >
                    <TextField
                        disabled={!!this.props.variantPageId}
                        label="Display Name"
                        name="DisplayName"
                        value={this.state.pageName}
                        onChange={this.onNameChange}
                        error={this.state.pageNameError}
                    />
                    {this.props.variantPageId && (
                        <TextField
                            label="Variant Name"
                            name="VariantName"
                            value={this.state.variantName}
                            onChange={this.onVariantNameChange}
                            error={this.state.variantNameError}
                        />
                    )}
                    {this.props.variantPageId && (
                        <CopyVariantContentCheckbox
                            data-test-selector="createVariant_CopyVariantContent"
                            onChange={this.onCopyVariantContent}
                            checked={this.state.copyVariantContent}
                        >
                            Copy Content from Default
                        </CopyVariantContentCheckbox>
                    )}
                    {this.props.isLayout && (
                        <Select
                            label="Allowed for Page Type"
                            name="AllowedForPageType"
                            value={this.state.selectedAllowedForPageType}
                            onChange={this.onAllowedForPageTypeChange}
                            error={this.state.allowedForPageTypeError}
                        >
                            <option value="">Select Type</option>
                            {allowedPagesTypes.map(pageDefinition => (
                                <option key={pageDefinition.type} value={pageDefinition.type}>
                                    {pageDefinition.type}
                                </option>
                            ))}
                        </Select>
                    )}
                    {!this.props.isLayout && (
                        <>
                            <Select
                                disabled={!!this.props.copyPageId || !!this.props.variantPageId}
                                label="Page Type"
                                name="PageType"
                                value={this.state.selectedPageType}
                                onChange={this.onPageTypeChange}
                                error={this.state.pageTypeError}
                            >
                                <option value="">Select Type</option>
                                {allowedPagesTypes.map(pageDefinition => (
                                    <option key={pageDefinition.type} value={pageDefinition.type}>
                                        {pageDefinition.type}
                                    </option>
                                ))}
                            </Select>
                            {this.state.selectedPageType && this.props.layouts.length > 0 && (
                                <Select
                                    label="Layout"
                                    name="Layout"
                                    value={this.state.selectedLayoutId}
                                    onChange={this.onLayoutChange}
                                >
                                    <option value="">Select Layout</option>
                                    {this.props.layouts
                                        .filter(o => o.allowedForPageType === this.state.selectedPageType)
                                        .map((treeNode: TreeNodeModel) => (
                                            <option key={treeNode.pageId} value={treeNode.pageId}>
                                                {treeNode.displayName}
                                            </option>
                                        ))}
                                </Select>
                            )}
                        </>
                    )}
                    {this.state.selectedPageType && this.state.templates.length > 1 && (
                        <Select
                            label="Page Template"
                            name="PageTemplate"
                            value={this.state.selectedPageTemplate}
                            onChange={this.onPageTemplateChange}
                            error={this.state.pageTemplateError}
                        >
                            <option value="">Select Template</option>
                            {this.state.templates.map(template => (
                                <option key={template.fullPath} value={template.fullPath}>
                                    {template.name}
                                </option>
                            ))}
                        </Select>
                    )}
                </SideBarForm>
            </>
        );
    }
}

const ConnectedAddPage = connect(mapStateToProps, mapDispatchToProps)(AddPage);

interface WrapperProps {
    addingPageUnderId: string;
    addingPageUnderType: string;
    copyDisplayName: string;
    copyType: string;
    copyPageId: string;
    variantType: string;
    variantPageName: string;
    variantPageId: string;
    isLayout: boolean;
}

const mapWrapperState = (state: ShellState, ownProps: {}): WrapperProps => {
    return {
        addingPageUnderId: state.pageTree.addingPageUnderId || "",
        addingPageUnderType: state.pageTree.addingPageUnderType || "",
        copyDisplayName: state.pageTree.copyPageDisplayName || "",
        copyType: state.pageTree.copyPageType || "",
        copyPageId: state.pageTree.copyPageId || "",
        variantType: state.pageTree.variantPageType || "",
        variantPageName: state.pageTree.variantPageName || "",
        variantPageId: state.pageTree.variantPageId || "",
        isLayout: state.pageTree.isLayout || false,
    };
};

// used so that it is easier to reset the state of the add page component.
const AddPageWrapper: React.FunctionComponent<WrapperProps> = (props: WrapperProps) => {
    if (!props.addingPageUnderId) {
        return null;
    }

    return (
        <ConnectedAddPage
            addingPageUnderId={props.addingPageUnderId}
            addingPageUnderType={props.addingPageUnderType}
            copyDisplayName={props.copyDisplayName}
            copyType={props.copyType}
            copyPageId={props.copyPageId}
            variantType={props.variantType}
            variantPageName={props.variantPageName}
            variantPageId={props.variantPageId}
            isLayout={props.isLayout}
        />
    );
};

export default connect(mapWrapperState)(AddPageWrapper);

const CopyVariantContentCheckbox = styled(Checkbox)`
    margin-top: 10px;
`;
