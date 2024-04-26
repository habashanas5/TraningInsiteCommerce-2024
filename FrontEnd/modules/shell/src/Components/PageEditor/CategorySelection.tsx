import { ModelSelection } from "@insite/shell/Components/PageEditor/ModelSelection";
import { searchCategories, selectCategory } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ShellState) => ({
    selectedCategoryPath: state.pageEditor.selectedCategoryPath,
    categorySearchResults: state.pageEditor.categorySearchResults,
});

const mapDispatchToProps = {
    selectCategory,
    searchCategories,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

class CategorySelection extends React.Component<Props> {
    onSelectionChange = (categoryPath?: string) => {
        this.props.selectCategory(categoryPath ?? "");
    };

    render() {
        const categorySearchResults = this.props.categorySearchResults ?? [];

        const options = categorySearchResults.map(o => ({
            optionText: o.displayName,
            optionValue: o.path,
        }));

        return (
            <ModelSelection
                modelType="Category"
                selectedValue={this.props.selectedCategoryPath ?? ""}
                onSelectionChange={this.onSelectionChange}
                onInputChange={this.props.searchCategories}
                options={options}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategorySelection);
