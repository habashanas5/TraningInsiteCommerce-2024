import { createHandlerChainRunner, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import setFilterQuery from "@insite/client-framework/Store/Pages/ProductList/Handlers/SetFilterQuery";
import { ProductFilters } from "@insite/client-framework/Store/Pages/ProductList/ProductListState";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";

type HandlerType = HandlerWithResult<ProductFilters, ProductFilters>;

export const MergeParameter: HandlerType = props => {
    const currentFilters = cloneDeep(props.getState().pages.productList.productFilters);
    props.result = merge(currentFilters, props.parameter);
};

export const AbortOnDuplicateFilter: HandlerType = props => {
    const currentFilters = props.getState().pages.productList.productFilters;
    if (props.parameter.searchWithinQueries?.filter(x => currentFilters.searchWithinQueries?.includes(x)).length) {
        return false;
    }
};

export const ResetPage: HandlerType = props => {
    if (
        props.parameter.pageSize ||
        props.parameter.sort ||
        props.parameter.pageCategoryId ||
        props.parameter.categoryId ||
        props.parameter.searchWithinQueries?.length ||
        props.parameter.brandIds?.length ||
        props.parameter.productLineIds?.length ||
        props.parameter.priceFilters?.length ||
        props.parameter.attributeValueIds?.length
    ) {
        props.result.page = undefined;
    }
};

export const AddSearchWithin: HandlerType = props => {
    const currentFilters = props.getState().pages.productList.productFilters;
    props.result.searchWithinQueries = currentFilters.searchWithinQueries;

    if (props.parameter.searchWithinQueries) {
        // must copy array or props don't update
        props.result.searchWithinQueries = props.result.searchWithinQueries
            ? props.result.searchWithinQueries.concat(props.parameter.searchWithinQueries)
            : props.parameter.searchWithinQueries;
    }
};

export const AddBrands: HandlerType = props => {
    const currentFilters = props.getState().pages.productList.productFilters;
    props.result.brandIds = currentFilters.brandIds;

    if (props.parameter.brandIds) {
        props.result.brandIds = props.parameter.brandIds.concat(props.result.brandIds || []);
    }
};

export const AddProductLines: HandlerType = props => {
    const currentFilters = props.getState().pages.productList.productFilters;
    props.result.productLineIds = currentFilters.productLineIds;

    if (props.parameter.productLineIds) {
        props.result.productLineIds = props.parameter.productLineIds.concat(props.result.productLineIds || []);
    }
};

export const AddPriceFilters: HandlerType = props => {
    const currentFilters = props.getState().pages.productList.productFilters;
    props.result.priceFilters = currentFilters.priceFilters;

    if (props.parameter.priceFilters) {
        props.result.priceFilters = props.parameter.priceFilters.concat(props.result.priceFilters || []);
    }
};

export const AddAttributeValueFilters: HandlerType = props => {
    const currentFilters = props.getState().pages.productList.productFilters;
    props.result.attributeValueIds = currentFilters.attributeValueIds;

    if (props.parameter.attributeValueIds) {
        props.result.attributeValueIds = props.parameter.attributeValueIds.concat(props.result.attributeValueIds || []);
    }
};

export const AddFilterCategory: HandlerType = props => {
    if (props.parameter.categoryId) {
        props.result.categoryId = props.parameter.categoryId;
    }
};

export const AddStockedItemsFilter: HandlerType = props => {
    if (props.parameter.stockedItemsOnly !== undefined) {
        props.result.stockedItemsOnly = props.parameter.stockedItemsOnly;
    }
};

export const AddPreviouslyPurchasedFilter: HandlerType = props => {
    if (props.parameter.previouslyPurchasedProducts !== undefined) {
        props.result.previouslyPurchasedProducts = props.parameter.previouslyPurchasedProducts;
    }
};

export const DispatchSetProductFilters: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductList/SetProductFilters",
        result: props.result,
    });
};

export const DispatchSetFilterQuery: HandlerType = props => {
    props.dispatch(setFilterQuery());
};

export const chain = [
    MergeParameter,
    AbortOnDuplicateFilter,
    ResetPage,
    AddSearchWithin,
    AddBrands,
    AddProductLines,
    AddPriceFilters,
    AddAttributeValueFilters,
    AddFilterCategory,
    AddStockedItemsFilter,
    DispatchSetProductFilters,
    DispatchSetFilterQuery,
];

const addProductFilters = createHandlerChainRunner(chain, "AddProductFilters");
export default addProductFilters;
