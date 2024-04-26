import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import addProductFilters from "@insite/client-framework/Store/Pages/ProductList/Handlers/AddProductFilters";
import removeProductFilters from "@insite/client-framework/Store/Pages/ProductList/Handlers/RemoveProductFilters";
import { getProductListDataViewProperty } from "@insite/client-framework/Store/Pages/ProductList/ProductListSelectors";
import translate from "@insite/client-framework/Translate";
import { CurrencyModel, FacetModel, PriceFacetModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
import ProductListFiltersAccordionSection from "@insite/content-library/Widgets/ProductList/ProductListFilterAccordionSection";
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

export const formatPriceRangeFacet = (
    facet: PriceFacetModel | undefined,
    currency: CurrencyModel | null | undefined,
) => {
    if (!facet) {
        return "";
    }

    const lowPrice = `${currency?.currencySymbol}${facet.minimumPrice}`;
    const highPrice = `${currency?.currencySymbol}${
        facet.maximumPrice > 10 ? facet.maximumPrice - 1 : facet.maximumPrice - 0.01
    }`;
    return `${lowPrice} - ${highPrice}`;
};

const mapStateToProps = (state: ApplicationState) => ({
    currency: state.context.session.currency,
    priceFacets: getProductListDataViewProperty(state, "priceRange")?.priceFacets,
});

const mapDispatchToProps = {
    addProductFilters,
    removeProductFilters,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export interface ProductListPriceFiltersStyles {}

export const productListPriceFiltersStyles: ProductListPriceFiltersStyles = {};

const ProductListPriceFilters: FC<Props> = ({
    priceFacets,
    currency,
    addProductFilters,
    removeProductFilters,
    fields,
}) => {
    // TODO ISC-11787 - make showMoreLimit configurable
    const showMoreLimit = 10;

    if (!priceFacets?.length) {
        return null;
    }

    const facets = priceFacets.map(o => ({
        ...o,
        id: o.minimumPrice.toString(),
        name: formatPriceRangeFacet(o, currency),
    }));

    const onChangeFacet = (facet: FacetModel) => {
        if (facet.selected) {
            removeProductFilters({ priceFilters: [facet.id] });
        } else {
            addProductFilters({ priceFilters: [facet.id] });
        }
    };

    return (
        <ProductListFiltersAccordionSection
            title={translate("Price")}
            facets={facets}
            onChangeFacet={onChangeFacet}
            showMoreLimit={showMoreLimit}
            expandByDefault={fields.expandByDefault}
            extendedStyles={productListPriceFiltersStyles}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(ProductListPriceFilters),
    definition: {
        group: "Product List",
        displayName: "Price Filters",
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
