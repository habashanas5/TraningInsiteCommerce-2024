import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import addProductFilters from "@insite/client-framework/Store/Pages/ProductList/Handlers/AddProductFilters";
import removeProductFilters from "@insite/client-framework/Store/Pages/ProductList/Handlers/RemoveProductFilters";
import { getProductListDataViewProperty } from "@insite/client-framework/Store/Pages/ProductList/ProductListSelectors";
import { FacetModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
import { productListCategoryFiltersStyles } from "@insite/content-library/Widgets/ProductList/ProductListCategoryFilters";
import ProductListFiltersAccordionSection, {
    ProductListFilterAccordionSectionStyles,
} from "@insite/content-library/Widgets/ProductList/ProductListFilterAccordionSection";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";

const enum fields {
    expandByDefault = "expandByDefault",
}

interface OwnProps extends WidgetProps {
    fields: {
        [fields.expandByDefault]: boolean;
    };
}

const mapStateToProps = (state: ApplicationState) => ({
    attributeTypeFacets: getProductListDataViewProperty(state, "attributeTypeFacets"),
});

const mapDispatchToProps = {
    addProductFilters,
    removeProductFilters,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export const productListAttributeFiltersStyles: ProductListFilterAccordionSectionStyles = {};

const ProductListAttributeFilters: FC<Props> = ({
    attributeTypeFacets,
    addProductFilters,
    removeProductFilters,
    fields,
}) => {
    // TODO ISC-11787 - make showMoreLimit configurable
    const showMoreLimit = 10;

    if (!attributeTypeFacets?.length) {
        return null;
    }

    const onChangeFacet = (facet: FacetModel) => {
        if (facet.selected) {
            removeProductFilters({ attributeValueIds: [facet.id] });
        } else {
            addProductFilters({ attributeValueIds: [facet.id] });
        }
    };

    return (
        <>
            {attributeTypeFacets.map(a =>
                a.attributeValueFacets ? (
                    <ProductListFiltersAccordionSection
                        key={a.attributeTypeId}
                        title={a.nameDisplay}
                        facets={a.attributeValueFacets.map<FacetModel>(av => ({
                            ...av,
                            id: av.attributeValueId,
                            name: av.valueDisplay,
                        }))}
                        onChangeFacet={onChangeFacet}
                        showMoreLimit={showMoreLimit}
                        expandByDefault={fields.expandByDefault}
                        extendedStyles={productListCategoryFiltersStyles}
                    />
                ) : null,
            )}
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(ProductListAttributeFilters),
    definition: {
        group: "Product List",
        displayName: "Attribute Filters",
        allowedContexts: [ProductListPageContext],
        fieldDefinitions: [
            {
                name: fields.expandByDefault,
                editorTemplate: "CheckboxField",
                defaultValue: false,
                fieldType: "General",
            },
        ],
    },
};

export default widgetModule;
