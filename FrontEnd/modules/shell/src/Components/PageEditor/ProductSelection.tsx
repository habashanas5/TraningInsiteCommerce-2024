import { ModelSelection } from "@insite/shell/Components/PageEditor/ModelSelection";
import { searchProducts, selectProduct } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ShellState) => ({
    selectedProductPath: state.pageEditor.selectedProductPath,
    productSearchResults: state.pageEditor.productSearchResults,
});

const mapDispatchToProps = {
    selectProduct,
    searchProducts,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

class ProductSelection extends React.Component<Props> {
    onSelectionChange = (productPath?: string) => {
        let selectedPath = productPath ?? "";
        const queryStringIndex = selectedPath.indexOf("?");
        if (queryStringIndex > -1) {
            selectedPath = selectedPath.substring(0, queryStringIndex);
        }
        this.props.selectProduct(selectedPath);
    };

    render() {
        const productSearchResults = this.props.productSearchResults ?? [];

        const options = productSearchResults.map(o => ({
            optionText: o.displayName,
            optionValue: o.path,
        }));

        return (
            <ModelSelection
                modelType="Product"
                selectedValue={this.props.selectedProductPath ?? ""}
                onSelectionChange={this.onSelectionChange}
                onInputChange={this.props.searchProducts}
                options={options}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductSelection);
