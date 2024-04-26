import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSession, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import addProductFilters from "@insite/client-framework/Store/Pages/ProductList/Handlers/AddProductFilters";
import removeProductFilters from "@insite/client-framework/Store/Pages/ProductList/Handlers/RemoveProductFilters";
import { getProductListDataView } from "@insite/client-framework/Store/Pages/ProductList/ProductListSelectors";
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

const mapStateToProps = (state: ApplicationState) => {
    const session = getSession(state);
    const { searchSettings } = getSettingsCollection(state);
    return {
        enabled:
            searchSettings.enableBoostingByPurchaseHistory &&
            searchSettings.allowFilteringForPreviouslyPurchasedProducts &&
            (session.isAuthenticated || session.rememberMe) &&
            !session.isGuest,
        loaded: !!getProductListDataView(state).value,
        previouslyPurchasedProducts: state.pages.productList.productFilters.previouslyPurchasedProducts,
    };
};

const mapDispatchToProps = {
    addProductFilters,
    removeProductFilters,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export const productListPreviouslyPurchasedFilterStyles: ProductListFilterAccordionSectionStyles = {};

const ProductListPreviouslyPurchasedFilter = ({
    enabled,
    loaded,
    previouslyPurchasedProducts,
    addProductFilters,
    removeProductFilters,
}: Props) => {
    if (!enabled || !loaded) {
        return null;
    }

    const onChangeFacet = (facet: FacetModel) => {
        if (facet.selected) {
            removeProductFilters({ previouslyPurchasedProducts: false });
        } else {
            addProductFilters({ previouslyPurchasedProducts: true });
        }
    };

    const facet = [
        {
            id: "previouslyPurchased",
            name: translate("Previously Purchased Only"),
            count: -1,
            selected: previouslyPurchasedProducts ?? false,
        },
    ];

    return (
        <ProductListFiltersAccordionSection
            title={translate("Previously Purchased")}
            facets={facet}
            onChangeFacet={onChangeFacet}
            showMoreLimit={1}
            extendedStyles={productListPreviouslyPurchasedFilterStyles}
            expandByDefault={true}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(ProductListPreviouslyPurchasedFilter),
    definition: {
        group: "Product List",
        displayName: "Previously Purchased Filter",
        allowedContexts: [ProductListPageContext],
    },
};

export default widgetModule;
