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
    categoryFacets: getProductListDataViewProperty(state, "categoryFacets"),
    isCategoryPage: state.pages.productList.productFilters.pageCategoryId !== undefined,
});

const mapDispatchToProps = {
    addProductFilters,
    removeProductFilters,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export const productListCategoryFiltersStyles: ProductListFilterAccordionSectionStyles = {};

const ProductListCategoryFilters: FC<Props> = ({
    categoryFacets,
    isCategoryPage,
    addProductFilters,
    removeProductFilters,
    fields,
}) => {
    // TODO ISC-11787 - make showMoreLimit configurable
    const showMoreLimit = 10;

    if (isCategoryPage || !categoryFacets?.length) {
        return null;
    }

    const facets = categoryFacets?.map(o => ({
        ...o,
        id: o.categoryId,
        name: o.shortDescription,
    }));

    const onChangeFacet = (facet: FacetModel) => {
        if (facet.selected) {
            removeProductFilters({ categoryId: facet.id });
        } else {
            addProductFilters({ categoryId: facet.id });
        }
    };

    return (
        <ProductListFiltersAccordionSection
            title={translate("Categories")}
            facets={facets}
            onChangeFacet={onChangeFacet}
            showMoreLimit={showMoreLimit}
            expandByDefault={fields.expandByDefault}
            extendedStyles={productListCategoryFiltersStyles}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(ProductListCategoryFilters),
    definition: {
        group: "Product List",
        displayName: "Category Filters",
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
