import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import addProductFilters from "@insite/client-framework/Store/Pages/ProductList/Handlers/AddProductFilters";
import removeProductFilters from "@insite/client-framework/Store/Pages/ProductList/Handlers/RemoveProductFilters";
import { getProductListDataViewProperty } from "@insite/client-framework/Store/Pages/ProductList/ProductListSelectors";
import translate from "@insite/client-framework/Translate";
import { FacetModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
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
    brandFacets: getProductListDataViewProperty(state, "brandFacets"),
    pageBrandId: state.pages.productList.productFilters.pageBrandId,
});

const mapDispatchToProps = {
    addProductFilters,
    removeProductFilters,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export const productListBrandFiltersStyles: ProductListFilterAccordionSectionStyles = {};

const ProductListBrandFilters: FC<Props> = ({
    brandFacets,
    addProductFilters,
    removeProductFilters,
    fields,
    pageBrandId,
}) => {
    // TODO ISC-11787 - make showMoreLimit configurable
    const showMoreLimit = 10;

    if (!brandFacets?.length || pageBrandId) {
        return null;
    }

    const onChangeFacet = (facet: FacetModel) => {
        if (facet.selected) {
            removeProductFilters({ brandIds: [facet.id] });
        } else {
            addProductFilters({ brandIds: [facet.id] });
        }
    };

    return (
        <ProductListFiltersAccordionSection
            title={translate("Brands")}
            facets={brandFacets}
            onChangeFacet={onChangeFacet}
            showMoreLimit={showMoreLimit}
            expandByDefault={fields.expandByDefault}
            extendedStyles={productListBrandFiltersStyles}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(ProductListBrandFilters),
    definition: {
        group: "Product List",
        displayName: "Brand Filters",
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
