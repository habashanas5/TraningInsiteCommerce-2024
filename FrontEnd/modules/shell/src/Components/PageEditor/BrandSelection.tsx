import { ModelSelection } from "@insite/shell/Components/PageEditor/ModelSelection";
import { searchBrands, selectBrand } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import ShellState from "@insite/shell/Store/ShellState";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

interface OwnProps {}

const mapStateToProps = (state: ShellState, ownProps: OwnProps) => ({
    selectedBrandPath: state.pageEditor.selectedBrandPath,
    brandSearchResults: state.pageEditor.brandSearchResults,
});

const mapDispatchToProps = {
    selectBrand,
    searchBrands,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

class BrandSelection extends React.Component<Props> {
    onSelectionChange = (brandPath?: string) => {
        this.props.selectBrand(brandPath ?? "");
    };

    render() {
        const brandSearchResults = this.props.brandSearchResults ?? [];

        const options = brandSearchResults.map(o => ({
            optionText: o.displayName,
            optionValue: o.path,
        }));

        return (
            <ModelSelection
                modelType="Brand"
                selectedValue={this.props.selectedBrandPath ?? ""}
                onSelectionChange={this.onSelectionChange}
                onInputChange={this.props.searchBrands}
                options={options}
            />
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BrandSelection);
