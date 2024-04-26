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

const mapStateToProps = (state: ApplicationState) => {
    const {
        pages: {
            productList: { productFilters },
        },
    } = state;
    return {
        productLineFacets: getProductListDataViewProperty(state, "productLineFacets"),
        pageProductLineId: productFilters.pageProductLineId,
    };
};

const mapDispatchToProps = {
    addProductFilters,
    removeProductFilters,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export const productListProductLineFiltersStyles: ProductListFilterAccordionSectionStyles = {};

const ProductListProductListFilters: FC<Props> = ({
    productLineFacets,
    addProductFilters,
    removeProductFilters,
    fields,
    pageProductLineId,
}) => {
    // TODO ISC-11787 - make showMoreLimit configurable
    const showMoreLimit = 10;

    if (!productLineFacets?.length || pageProductLineId) {
        return null;
    }

    const onChangeFacet = (facet: FacetModel) => {
        if (facet.selected) {
            removeProductFilters({ productLineIds: [facet.id] });
        } else {
            addProductFilters({ productLineIds: [facet.id] });
        }
    };

    return (
        <ProductListFiltersAccordionSection
            title={translate("Product Lines")}
            facets={productLineFacets}
            onChangeFacet={onChangeFacet}
            showMoreLimit={showMoreLimit}
            expandByDefault={fields.expandByDefault}
            extendedStyles={productListProductLineFiltersStyles}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(ProductListProductListFilters),
    definition: {
        group: "Product List",
        displayName: "Product Line Filters",
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
