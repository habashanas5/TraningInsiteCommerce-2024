import { getCookie } from "@insite/client-framework/Common/Cookies";
import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { PageLinkModel } from "@insite/client-framework/Services/ContentService";
import { getPageLinkByNodeId } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import { LinkFieldDefinition, LinkFieldValue } from "@insite/client-framework/Types/FieldDefinition";
import Button from "@insite/mobius/Button";
import Icon from "@insite/mobius/Icon";
import Tab, { TabProps } from "@insite/mobius/Tab";
import TabGroup from "@insite/mobius/TabGroup";
import TextField from "@insite/mobius/TextField";
import StandardControl from "@insite/shell-public/Components/StandardControl";
import { EditorTemplateProps } from "@insite/shell-public/EditorTemplateProps";
import { isValidUrl } from "@insite/shell/Common/IsValidUrl";
import ClickOutside from "@insite/shell/Components/ClickOutside";
import ArrowDown from "@insite/shell/Components/Icons/ArrowDown";
import ArrowRight from "@insite/shell/Components/Icons/ArrowRight";
import Link from "@insite/shell/Components/Icons/Link";
import NeverPublishedModal from "@insite/shell/Components/Modals/NeverPublishedModal";
import shellTheme, { ShellThemeProps } from "@insite/shell/ShellTheme";
import { showNeverPublishedModal } from "@insite/shell/Store/NeverPublishedModal/NeverPublishedModalActionCreators";
import { loadCategories } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled, { css, FlattenSimpleInterpolation } from "styled-components";

interface State {
    linkSelectorIsOpen: boolean;
    expandedKeys: string[];
    url: string;
    isValidUrl: boolean;
    triedToSaveUrl: boolean;
}

type OwnProps = EditorTemplateProps<LinkFieldValue, LinkFieldDefinition>;

const mapStateToProps = (state: ShellState, ownProps: OwnProps) => {
    const categories = state.pageEditor.categories;

    const fieldValue = ownProps.fieldValue;
    let displayValue = "";
    if (fieldValue) {
        switch (fieldValue.type) {
            case "Page":
                displayValue = getPageLinkByNodeId(state, fieldValue.value)?.title ?? "";
                break;
            case "Category":
                if (fieldValue.value === emptyGuid) {
                    displayValue = "Products";
                } else if (!categories) {
                    displayValue = "Loading...";
                } else if (fieldValue.value === "") {
                    displayValue = "";
                } else {
                    const matchingCategories = categories.filter(o => o.id === fieldValue.value);
                    if (matchingCategories.length === 0) {
                        displayValue = "Unknown";
                    } else {
                        displayValue = matchingCategories[0].shortDescription;
                    }
                }
                break;
            case "Url":
                displayValue = fieldValue.value;
                break;
        }
    }

    return {
        neverPublishedNodeIds: state.pageTree.neverPublishedNodeIds,
        futurePublishNodeIds: state.pageTree.futurePublishNodeIds,
        draftNodeIds: state.pageTree.draftNodeIds,
        pageLinks: state.links.pageLinks,
        displayValue,
        categories,
        categoryIndexByParentId: state.pageEditor.categoryIndexByParentId,
    };
};

const mapDispatchToProps = {
    loadCategories,
    showNeverPublishedModal,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

const StandardIconPropsSource: React.FC = () => <Link color1={shellTheme.colors.text.main} />;
const ClearIconPropsSource: React.FC = () => <Icon src="X" />;

class LinkField extends ClickOutside<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            linkSelectorIsOpen: false,
            expandedKeys: [props.pageLinks[0].id, emptyGuid],
            url: props.fieldValue.type === "Url" ? props.fieldValue.value : "",
            isValidUrl: true,
            triedToSaveUrl: false,
        };
    }

    componentDidMount(): void {
        if (!this.props.categories) {
            this.props.loadCategories();
        }
    }

    onClickOutside(): void {
        this.setState({
            linkSelectorIsOpen: false,
        });
    }

    clickLinkField = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            linkSelectorIsOpen: true,
        });
    };

    clickPage = (event: React.FormEvent<HTMLElement>) => {
        const nodeId = event.currentTarget.closest("[data-id]")!.getAttribute("data-id")!;

        this.setState({
            linkSelectorIsOpen: false,
        });

        if (this.props.neverPublishedNodeIds[nodeId] && !getCookie("NeverShowLinkWarning")) {
            this.props.showNeverPublishedModal(this.props.fieldDefinition.name, nodeId);
            return;
        }

        this.props.updateField(this.props.fieldDefinition.name, {
            type: "Page",
            value: nodeId,
        });
    };

    clickCategory = (event: React.FormEvent<HTMLElement>) => {
        const categoryId = event.currentTarget.closest("[data-id]")!.getAttribute("data-id")!;
        this.props.updateField(this.props.fieldDefinition.name, {
            type: "Category",
            value: categoryId,
        });

        this.setState({
            linkSelectorIsOpen: false,
        });
    };

    clickExpand = (event: React.FormEvent<HTMLElement>) => {
        const nodeId = event.currentTarget.closest("[data-id]")!.getAttribute("data-id")!;
        const index = this.state.expandedKeys.indexOf(nodeId);
        const expandedKeys = this.state.expandedKeys;
        if (index >= 0) {
            expandedKeys.splice(index, 1);
        } else {
            expandedKeys.push(nodeId);
        }

        this.setState({
            expandedKeys,
        });
    };

    renderTreeChunk(links: readonly PageLinkModel[]) {
        return (
            <ul>
                {links.map(page => {
                    const isExpanded = this.state.expandedKeys.indexOf(page.id) >= 0;
                    const hasChildren = !!page.children;
                    return (
                        <TreeItemStyle key={page.id}>
                            <TitleStyle
                                data-id={page.id}
                                isUnpublished={this.props.draftNodeIds[page.id]}
                                neverPublished={this.props.neverPublishedNodeIds[page.id]}
                                futurePublish={
                                    this.props.futurePublishNodeIds[page.id] &&
                                    this.props.futurePublishNodeIds[page.id] > new Date()
                                }
                                className="link-selector"
                            >
                                {hasChildren && (
                                    <ArrowContainer isExpanded={isExpanded} onClick={this.clickExpand}>
                                        {isExpanded ? <ArrowDown height={6} /> : <ArrowRight width={6} />}
                                    </ArrowContainer>
                                )}
                                <span onClick={this.clickPage}>{page.title}</span>
                            </TitleStyle>
                            {isExpanded && hasChildren && this.renderTreeChunk(page.children!)}
                        </TreeItemStyle>
                    );
                })}
            </ul>
        );
    }

    renderCategoryChunk(parentId: string) {
        const { categories, categoryIndexByParentId } = this.props;
        if (!categories || !categoryIndexByParentId) {
            return null;
        }

        return (
            <ul>
                {categoryIndexByParentId[parentId].map(categoryIndex => {
                    const category = categories[categoryIndex];
                    const isExpanded = this.state.expandedKeys.indexOf(category.id) >= 0;
                    const hasChildren = !!categoryIndexByParentId[category.id];
                    return (
                        <TreeItemStyle key={category.id}>
                            <TitleStyle className="link-selector" data-id={category.id}>
                                {hasChildren && (
                                    <ArrowContainer isExpanded={isExpanded} onClick={this.clickExpand}>
                                        {isExpanded ? <ArrowDown height={6} /> : <ArrowRight width={6} />}
                                    </ArrowContainer>
                                )}
                                <span onClick={this.clickCategory}>{category.shortDescription}</span>
                            </TitleStyle>
                            {isExpanded && hasChildren && this.renderCategoryChunk(category.id)}
                        </TreeItemStyle>
                    );
                })}
            </ul>
        );
    }

    changeExternalUrl = (event: React.FormEvent<HTMLInputElement>) => {
        let isValidExternalUrl = true;
        if (this.state.triedToSaveUrl && !this.state.isValidUrl && !isValidUrl(event.currentTarget.value)) {
            isValidExternalUrl = false;
        }

        this.setState({
            url: event.currentTarget.value,
            isValidUrl: isValidExternalUrl,
        });
    };

    clickSaveExternalUrl = () => {
        if (!isValidUrl(this.state.url)) {
            this.setState({
                isValidUrl: false,
                triedToSaveUrl: true,
            });
            return;
        }

        this.props.updateField(this.props.fieldDefinition.name, {
            type: "Url",
            value: this.state.url,
        });
        this.setState({
            linkSelectorIsOpen: false,
            isValidUrl: true,
            triedToSaveUrl: false,
        });
    };

    externalUrlKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            this.clickSaveExternalUrl();
        }
    };

    clearFieldValue = () => {
        this.props.updateField(this.props.fieldDefinition.name, {
            ...this.props.fieldValue,
            value: "",
        });
    };

    render() {
        const {
            fieldValue: { type, value },
            fieldDefinition,
        } = this.props;
        const allowUrls = !fieldDefinition.allowUrls || fieldDefinition.allowUrls(this.props.item);
        const allowCategories = !fieldDefinition.allowCategories || fieldDefinition.allowCategories(this.props.item);
        const currentTab = (type === "Url" && !allowUrls) || (type === "Category" && !allowCategories) ? "Page" : type;

        const tabs = [
            <Tab data-test-selector="tab_Pages" headline="Pages" key="Page" tabKey="Page" css={tabCss}>
                {this.renderTreeChunk(this.props.pageLinks)}
            </Tab>,
        ];

        if (allowCategories) {
            tabs.push(
                <Tab
                    data-test-selector="tab_Categories"
                    headline="Categories"
                    key="Category"
                    tabKey="Category"
                    css={tabCss}
                >
                    {this.props.categories && this.props.categoryIndexByParentId ? (
                        <ul>
                            <TreeItemStyle key={emptyGuid}>
                                {fieldDefinition.showCategoryRoot && (
                                    <TitleStyle className="link-selector" data-id={emptyGuid}>
                                        <span onClick={this.clickCategory}>Root</span>
                                    </TitleStyle>
                                )}
                                {this.renderCategoryChunk(emptyGuid)}
                            </TreeItemStyle>
                        </ul>
                    ) : (
                        <span>Loading</span>
                    )}
                </Tab>,
            );
        }

        if (allowUrls) {
            tabs.push(
                <Tab data-test-selector="tab_Url" headline="Url" key="Url" tabKey="Url" css={tabCss}>
                    <ExternalStyle>
                        <TextField
                            label="Url"
                            value={this.state.url}
                            error={this.state.isValidUrl ? "" : "Please enter a valid URL"}
                            onChange={this.changeExternalUrl}
                            onKeyPress={this.externalUrlKeyPress}
                        />
                        <Button variant="secondary" onClick={this.clickSaveExternalUrl}>
                            Save
                        </Button>
                    </ExternalStyle>
                </Tab>,
            );
        }

        return (
            <StandardControl fieldDefinition={fieldDefinition}>
                <TextField
                    readOnly={true}
                    onClick={this.clickLinkField}
                    id={fieldDefinition.name}
                    type="text"
                    value={this.props.displayValue}
                    iconProps={{ src: value ? ClearIconPropsSource : StandardIconPropsSource }}
                    iconClickableProps={value ? { onClick: this.clearFieldValue } : undefined}
                    clickableText={value ? translate("clear link field") : undefined}
                />
                {this.state.linkSelectorIsOpen && (
                    <LinkSelectorStyle ref={this.setWrapperRef}>
                        <TabGroup cssOverrides={{ tabContent, tabGroup, wrapper }} current={currentTab}>
                            {tabs}
                        </TabGroup>
                    </LinkSelectorStyle>
                )}
                <NeverPublishedModal updateField={this.props.updateField} />
            </StandardControl>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LinkField);

const tabCss: FlattenSimpleInterpolation = css`
    padding: 6px;
    &:hover {
        cursor: ${(props: TabProps) => (props.selected ? "default" : "pointer")};
    }
    font-weight: ${(props: TabProps) => (props.selected ? "bold" : "inherit")};
` as FlattenSimpleInterpolation;

const tabContent = css`
    border-bottom: none;
    padding: 16px;
    max-height: 463px;
    overflow: auto;
`;

const tabGroup = css`
    padding: 0;
`;

const wrapper = css`
    padding: 0;
`;

const LinkSelectorStyle = styled.div`
    margin-top: 2px;
    position: absolute;
    background-color: ${(props: ShellThemeProps) => props.theme.colors.common.accent};
    width: 288px;
    z-index: 10;
    border: 1px solid ${(props: ShellThemeProps) => props.theme.colors.common.border};
    border-radius: 3px;
    box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.4);
    height: 500px;
`;

const TitleStyle = styled.h3<{ isUnpublished?: boolean; neverPublished?: boolean; futurePublish?: boolean }>`
    span {
        ${props =>
            props.neverPublished || props.isUnpublished || props.futurePublish
                ? `color: ${
                      props.neverPublished
                          ? props.theme.colors.custom.neverPublished
                          : props.futurePublish
                          ? props.theme.colors.custom.futurePublish
                          : props.theme.colors.custom.draftPage
                  };`
                : ""}
        cursor: pointer;
        &:hover {
            font-weight: bold;
        }
    }
`;

const ArrowContainer = styled.div<{ isExpanded: boolean }>`
    padding: ${props => (props.isExpanded ? "0 6px" : "0 3px 0 4px")};
    margin-left: ${props => (props.isExpanded ? "-5px" : "-1px")};
    display: inline-block;
    cursor: pointer;

    &:hover svg path {
        stroke-width: 4 !important;
    }
`;

const TreeItemStyle = styled.li`
    ul {
        padding-left: 10px;
        h3,
        ul {
            margin-left: 12px;
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
            top: 2px;
            left: -6px;
        }
        li:last-child::before {
            height: 10px;
        }
        li::after {
            content: "";
            width: 14px;
            height: 2px;
            background-color: rgb(216, 216, 216);
            position: absolute;
            top: 10px;
            left: -6px;
        }
    }
`;

const ExternalStyle = styled.div`
    button {
        margin-top: 16px;
        float: right;
    }
    label {
        font-size: 15px;
        margin-bottom: -4px;
    }
`;
