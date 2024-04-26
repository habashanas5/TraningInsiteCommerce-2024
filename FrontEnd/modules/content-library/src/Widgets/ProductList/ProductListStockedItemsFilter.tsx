import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import addProductFilters from "@insite/client-framework/Store/Pages/ProductList/Handlers/AddProductFilters";
import removeProductFilters from "@insite/client-framework/Store/Pages/ProductList/Handlers/RemoveProductFilters";
import { getProductListDataView } from "@insite/client-framework/Store/Pages/ProductList/ProductListSelectors";
import translate from "@insite/client-framework/Translate";
import { FacetModel } from "@insite/client-framework/Types/ApiModels";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { ProductListPageContext } from "@insite/content-library/Pages/ProductListPage";
import { productListCategoryFiltersStyles } from "@insite/content-library/Widgets/ProductList/ProductListCategoryFilters";
import ProductListFiltersAccordionSection from "@insite/content-library/Widgets/ProductList/ProductListFilterAccordionSection";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";

interface OwnProps extends WidgetProps {}

const mapStateToProps = (state: ApplicationState) => ({
    loaded: !!getProductListDataView(state).value,
    stockedItemsOnly: state.pages.productList.productFilters.stockedItemsOnly,
    displayFacetsForStockedItems: getSettingsCollection(state).productSettings.displayFacetsForStockedItems,
});

const mapDispatchToProps = {
    addProductFilters,
    removeProductFilters,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export interface ProductListStockedItemsFilterStyles {}

export const productListStockedItemsFilterStyles: ProductListStockedItemsFilterStyles = {};

const styles = productListStockedItemsFilterStyles;

const ProductListStockedItemsFilter: FC<Props> = ({
    stockedItemsOnly,
    loaded,
    addProductFilters,
    removeProductFilters,
    displayFacetsForStockedItems,
}) => {
    if (!loaded || !displayFacetsForStockedItems) {
        return null;
    }

    const onChangeFacet = (facet: FacetModel) => {
        if (facet.selected) {
            removeProductFilters({ stockedItemsOnly: false });
        } else {
            addProductFilters({ stockedItemsOnly: true });
        }
    };

    const facet = [
        {
            id: "stocked",
            name: translate("Stocked Items Only"),
            count: -1,
            selected: stockedItemsOnly ?? false,
        },
    ];

    return (
        <ProductListFiltersAccordionSection
            title={translate("Stocked Items")}
            facets={facet}
            onChangeFacet={onChangeFacet}
            showMoreLimit={1}
            extendedStyles={productListCategoryFiltersStyles}
            expandByDefault={true}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(ProductListStockedItemsFilter),
    definition: {
        group: "Product List",
        displayName: "Stocked Items Filter",
        allowedContexts: [ProductListPageContext],
    },
};

export default widgetModule;
