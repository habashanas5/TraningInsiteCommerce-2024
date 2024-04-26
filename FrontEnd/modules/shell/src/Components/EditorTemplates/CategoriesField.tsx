import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { Dictionary } from "@insite/client-framework/Common/Types";
import { CategoriesFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import Checkbox from "@insite/mobius/Checkbox";
import Radio from "@insite/mobius/Radio";
import RadioGroup from "@insite/mobius/RadioGroup";
import TextField from "@insite/mobius/TextField";
import Typography from "@insite/mobius/Typography";
import StandardControl from "@insite/shell-public/Components/StandardControl";
import { EditorTemplateProps } from "@insite/shell-public/EditorTemplateProps";
import ArrowDown from "@insite/shell/Components/Icons/ArrowDown";
import ArrowRight from "@insite/shell/Components/Icons/ArrowRight";
import { loadCategories } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import { SelectCategoryModel } from "@insite/shell/Store/PageEditor/PageEditorState";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import styled, { css } from "styled-components";

interface SelectCategoryModelExtended extends SelectCategoryModel {
    filterStr: string;
}

const getFilterStr = (
    category: SelectCategoryModel,
    categories: SelectCategoryModel[],
    categoryIndexByParentId: Dictionary<number[]>,
): string => {
    let filterStr = category.shortDescription.toLowerCase();

    const hasChildren = !!categoryIndexByParentId[category.id];
    if (hasChildren) {
        filterStr += categoryIndexByParentId[category.id]
            .map(i => getFilterStr(categories[i], categories, categoryIndexByParentId))
            .join(" ");
    }

    return filterStr;
};

interface State {
    selectedCategoryIds: string[];
    expandedCategoryIds: string[];
    filter: string;
}

type OwnProps = EditorTemplateProps<string[], CategoriesFieldDefinition>;

const mapStateToProps = (state: ShellState) => {
    if (!state.pageEditor.categories || !state.pageEditor.categoryIndexByParentId) {
        return {
            categories: undefined as SelectCategoryModelExtended[] | undefined,
            categoryIndexByParentId: undefined as Dictionary<number[]> | undefined,
        };
    }

    return {
        categories: state.pageEditor.categories.map(
            category =>
                ({
                    ...category,
                    filterStr: getFilterStr(
                        category,
                        state.pageEditor.categories!,
                        state.pageEditor.categoryIndexByParentId!,
                    ),
                } as SelectCategoryModelExtended),
        ),
        categoryIndexByParentId: state.pageEditor.categoryIndexByParentId,
    };
};

const mapDispatchToProps = {
    loadCategories,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

class CategoriesField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectedCategoryIds: this.props.fieldValue || [],
            expandedCategoryIds: [emptyGuid],
            filter: "",
        };
    }

    componentDidMount(): void {
        if (!this.props.categories) {
            this.props.loadCategories();
        }
    }

    onFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ filter: event.currentTarget.value });
    };

    onCheckboxChange = (categoryId: string, checked: boolean) => {
        const newCelectedCategoryIds = checked
            ? this.state.selectedCategoryIds.concat([categoryId])
            : this.state.selectedCategoryIds.filter(o => o !== categoryId);

        this.setState({ selectedCategoryIds: newCelectedCategoryIds });
        this.props.updateField(this.props.fieldDefinition.name, newCelectedCategoryIds);
    };

    onRadioGroupChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ selectedCategoryIds: [event.currentTarget.value] });
        this.props.updateField(this.props.fieldDefinition.name, [event.currentTarget.value]);
    };

    toggleCategory = (categoryId: string) => {
        const index = this.state.expandedCategoryIds.indexOf(categoryId);
        const expandedCategoryIds = this.state.expandedCategoryIds;
        if (index >= 0) {
            expandedCategoryIds.splice(index, 1);
        } else {
            expandedCategoryIds.push(categoryId);
        }

        this.setState({
            expandedCategoryIds,
        });
    };

    renderCategories(parentId?: string) {
        const { categories, categoryIndexByParentId, fieldDefinition, item } = this.props;
        if (!categories || !categoryIndexByParentId) {
            return null;
        }

        return (
            <ul>
                {(!fieldDefinition.singleCategorySelection || !fieldDefinition.singleCategorySelection(item)) &&
                    categoryIndexByParentId[parentId || emptyGuid].map(categoryIndex => {
                        const category = categories[categoryIndex];
                        if (category.filterStr.indexOf(this.state.filter.toLowerCase()) === -1) {
                            return null;
                        }

                        const disabled =
                            !!this.state.filter &&
                            category.shortDescription.toLowerCase().indexOf(this.state.filter.toLowerCase()) === -1;
                        const isExpanded = this.state.expandedCategoryIds.indexOf(category.id) >= 0 || disabled;
                        const hasChildren = !!categoryIndexByParentId[category.id];
                        return (
                            <TreeItemStyle key={category.id}>
                                <TreeItemTitleStyle>
                                    {hasChildren && (
                                        <ArrowContainerStyle
                                            isExpanded={isExpanded}
                                            onClick={() => this.toggleCategory(category.id)}
                                        >
                                            {isExpanded ? <ArrowDown height={6} /> : <ArrowRight width={6} />}
                                        </ArrowContainerStyle>
                                    )}
                                    <Checkbox
                                        key={category.id}
                                        checked={this.state.selectedCategoryIds.indexOf(category.id) > -1}
                                        disabled={disabled}
                                        onChange={(_, value) => this.onCheckboxChange(category.id, value)}
                                        css={css`
                                            cursor: pointer;
                                            vertical-align: middle;
                                            span[role="checkbox"] + label {
                                                white-space: nowrap;
                                            }
                                        `}
                                    >
                                        {category.shortDescription}
                                    </Checkbox>
                                </TreeItemTitleStyle>
                                {isExpanded && hasChildren && this.renderCategories(category.id)}
                            </TreeItemStyle>
                        );
                    })}
                {fieldDefinition.singleCategorySelection?.(item) && (
                    <RadioGroup value={this.state.selectedCategoryIds?.[0]} onChangeHandler={this.onRadioGroupChange}>
                        {categoryIndexByParentId[parentId || emptyGuid].map(categoryIndex => {
                            const category = categories[categoryIndex];
                            if (category.filterStr.indexOf(this.state.filter.toLowerCase()) === -1) {
                                return null;
                            }

                            const disabled =
                                !!this.state.filter &&
                                category.shortDescription.toLowerCase().indexOf(this.state.filter.toLowerCase()) === -1;
                            const isExpanded = this.state.expandedCategoryIds.indexOf(category.id) >= 0 || disabled;
                            const hasChildren = !!categoryIndexByParentId[category.id];
                            return (
                                <TreeItemStyle key={category.id}>
                                    <TreeItemTitleStyle>
                                        {hasChildren && (
                                            <ArrowContainerStyle
                                                isExpanded={isExpanded}
                                                onClick={() => this.toggleCategory(category.id)}
                                            >
                                                {isExpanded ? <ArrowDown height={6} /> : <ArrowRight width={6} />}
                                            </ArrowContainerStyle>
                                        )}
                                        <Radio
                                            key={category.id}
                                            disabled={disabled}
                                            value={category.id}
                                            css={css`
                                                display: inline;
                                                white-space: nowrap;
                                                vertical-align: middle;
                                                padding-top: 4px;
                                                input[type="radio"] {
                                                    margin: 1px;
                                                }
                                                input[type="radio"] + label {
                                                    white-space: nowrap;
                                                    cursor: pointer;
                                                }
                                            `}
                                        >
                                            {category.shortDescription}
                                        </Radio>
                                    </TreeItemTitleStyle>
                                    {isExpanded && hasChildren && this.renderCategories(category.id)}
                                </TreeItemStyle>
                            );
                        })}
                    </RadioGroup>
                )}
            </ul>
        );
    }

    render() {
        return (
            <StandardControl fieldDefinition={this.props.fieldDefinition}>
                <TextField placeholder="Search categories" value={this.state.filter} onChange={this.onFilterChange} />
                <TreeContainerStyle>
                    {!this.state.filter ||
                    this.props.categories?.some(o => o.filterStr.indexOf(this.state.filter.toLowerCase()) > -1) ? (
                        this.renderCategories()
                    ) : (
                        <Typography>No categories found</Typography>
                    )}
                </TreeContainerStyle>
            </StandardControl>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesField);

const TreeContainerStyle = styled.div`
    margin-top: 10px;
    padding: 2px 8px;
    background-color: #fff;
    overflow: auto;
    border: 1px solid lightgray;
    border-radius: 4px;
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
            height: 12px;
        }
        li::after {
            content: "";
            width: 14px;
            height: 2px;
            background-color: rgb(216, 216, 216);
            position: absolute;
            top: 13px;
            left: -6px;
        }
    }
`;

const TreeItemTitleStyle = styled.h3`
    padding: 2px 0;

    span {
        cursor: pointer;
        &:hover {
            font-weight: bold;
        }
    }
`;

const ArrowContainerStyle = styled.div<{ isExpanded: boolean }>`
    padding: ${props => (props.isExpanded ? "0 4px 0 6px;" : "0 5px 0 4px")};
    margin-left: ${props => (props.isExpanded ? "-5px" : "-1px")};
    display: inline-block;
    cursor: pointer;

    &:hover svg path {
        stroke-width: 4 !important;
    }
`;
