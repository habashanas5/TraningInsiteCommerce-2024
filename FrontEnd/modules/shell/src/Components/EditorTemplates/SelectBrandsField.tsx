import translate from "@insite/client-framework/Translate";
import { HasFields } from "@insite/client-framework/Types/ContentItemModel";
import { ListFieldDefinition, SelectBrandsFieldDefinition } from "@insite/client-framework/Types/FieldDefinition";
import DynamicDropdown from "@insite/mobius/DynamicDropdown";
import StandardControl from "@insite/shell-public/Components/StandardControl";
import { EditorTemplateProps } from "@insite/shell-public/EditorTemplateProps";
import FieldsEditor from "@insite/shell/Components/ItemEditor/FieldsEditor";
import { loadSelectBrands, loadSelectedBrands } from "@insite/shell/Store/PageEditor/PageEditorActionCreators";
import { SelectBrandModel } from "@insite/shell/Store/PageEditor/PageEditorState";
import ShellState from "@insite/shell/Store/ShellState";
import debounce from "lodash/debounce";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";

interface State {
    selectBrands: SelectBrandModel[];
    isFocused: boolean;
    loaded?: boolean;
}

type OwnProps = EditorTemplateProps<string[], SelectBrandsFieldDefinition>;

const mapStateToProps = (state: ShellState, ownProps: OwnProps) => {
    const selectBrands = state.pageEditor.selectBrandsState?.selectBrands || [];
    const selectedBrands = state.pageEditor.selectBrandsState?.selectedBrands || [];
    const websiteId = state.shellContext.websiteId;

    return {
        selectBrands,
        selectedBrands,
        initialFilter: `logoSmallImagePath ne '' and Products/any(product: product/Categories/any(category: category/websiteId eq ${websiteId}))`,
    };
};

const mapDispatchToProps = {
    loadSelectBrands,
    loadSelectedBrands,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

class SelectBrandsField extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            selectBrands: [],
            isFocused: false,
        };
    }

    componentDidMount(): void {
        this.loadSelectBrands(this.props.fieldValue);
        this.loadSelectedBrands(this.props.fieldValue);
    }

    private loadSelectBrands(brands: string[], nameFilter?: string) {
        let queryFilter = this.props.initialFilter;
        if (nameFilter) {
            queryFilter = `${queryFilter} and contains(name,'${nameFilter}') eq true`;
        }
        this.props.loadSelectBrands({
            $filter: queryFilter,
            $select: "id,name",
            $orderBy: "name",
            $top: `${20 + brands.length}`,
        });
    }

    private loadSelectedBrands(brands: string[]) {
        let queryFilter = this.props.initialFilter;
        if (brands.length > 0) {
            const brandFilter: string[] = [];
            brands.forEach(brand => {
                brandFilter.push(`(id eq ${brand})`);
            });
            queryFilter = `${queryFilter} and (${brandFilter.join(" or ")})`;
        }
        this.props.loadSelectedBrands({
            $filter: queryFilter,
            $select: "id,name",
            $orderBy: "name",
            $top: `${20 + brands.length}`,
        });
    }

    componentDidUpdate(prevProps: Props) {
        if (prevProps.selectBrands !== this.props.selectBrands || prevProps.fieldValue !== this.props.fieldValue) {
            // TODO ISC-12679 - Redesign so that this can be moved to a field of the class rather than state.
            // eslint-disable-next-line react/no-did-update-set-state
            this.setState({
                selectBrands: this.props.selectBrands?.filter(brand => !this.props.fieldValue.includes(brand.id)) || [],
                loaded: !!this.props.selectBrands,
            });
        }
    }

    onChange = (value?: string) => {
        if (!value) {
            return;
        }
        const updateFieldValue = [...this.props.fieldValue, value];
        this.props.updateField(this.props.fieldDefinition.name, updateFieldValue);
        this.loadSelectBrands(updateFieldValue);
        this.loadSelectedBrands(updateFieldValue);
    };

    updateBrandListFromListField = (_: string, value: readonly HasFields[]) => {
        this.props.updateField(
            this.props.fieldDefinition.name,
            value.map(valueFields => valueFields.fields.id),
        );
    };

    render() {
        const { fieldValue, selectedBrands } = this.props;
        const { selectBrands, loaded } = this.state;
        const listFieldDefinition: ListFieldDefinition = {
            name: "selectBrandsListField",
            fieldDefinitions: [],
            defaultValue: [],
            editorTemplate: "ListField",
            fieldType: "General",
            getDisplay: (item: HasFields, _) => {
                const brand = selectedBrands?.filter(brand => brand.id === item.fields.id)[0];
                return brand?.name ?? item.fields.id;
            },
            hideEdit: true,
            hideAdd: true,
            tab: {
                displayName: translate("Basic"),
                sortOrder: 0,
            },
        };
        const listFieldItem = {
            fields: { selectBrandsListField: [...fieldValue.map(brandId => ({ fields: { id: brandId } }))] },
        };
        const options = selectBrands.map(option => ({ optionText: option.name, optionValue: option.id }));
        const loadSelectBrandsDebounce = debounce((value: string) => {
            this.loadSelectBrands(this.props.fieldValue, value);
        }, 100);
        const onInputChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
            loadSelectBrandsDebounce(event.target.value);
        };

        return (
            <StandardControl fieldDefinition={this.props.fieldDefinition}>
                {loaded && (
                    <DynamicDropdown
                        uid={this.props.fieldDefinition.name}
                        onSelectionChange={this.onChange}
                        options={options}
                        onInputChange={onInputChanged}
                        placeholder={translate("Select a Brand")}
                    />
                )}

                <FieldsEditor
                    fieldDefinitions={[listFieldDefinition]}
                    item={listFieldItem}
                    updateField={this.updateBrandListFromListField}
                    registerHasValidationErrors={() => false}
                    updateHasValidationErrors={() => false}
                />
            </StandardControl>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectBrandsField);
