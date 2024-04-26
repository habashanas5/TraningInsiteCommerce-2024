import { createHandlerChainRunner, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import setFilterQuery from "@insite/client-framework/Store/Pages/ProductList/Handlers/SetFilterQuery";
import { ProductFilters } from "@insite/client-framework/Store/Pages/ProductList/ProductListState";
import cloneDeep from "lodash/cloneDeep";

type HandlerType = HandlerWithResult<ProductFilters, ProductFilters>;

export const GetCurrentFilters: HandlerType = props => {
    props.result = cloneDeep(props.getState().pages.productList.productFilters);
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

export const RemoveSearchWithin: HandlerType = props => {
    props.result.searchWithinQueries = props.result.searchWithinQueries?.filter(
        x => !props.parameter.searchWithinQueries?.includes(x),
    );
    if (props.result.searchWithinQueries?.length === 0) {
        props.result.searchWithinQueries = undefined;
    }
};

export const RemoveBrands: HandlerType = props => {
    props.result.brandIds = props.result.brandIds?.filter(x => !props.parameter.brandIds?.find(y => y === x));
    if (props.result.brandIds?.length === 0) {
        props.result.brandIds = undefined;
    }
};

export const RemoveProductLines: HandlerType = props => {
    props.result.productLineIds = props.result.productLineIds?.filter(
        x => !props.parameter.productLineIds?.find(y => y === x),
    );
    if (props.result.productLineIds?.length === 0) {
        props.result.productLineIds = undefined;
    }
};

export const RemovePriceFilters: HandlerType = props => {
    props.result.priceFilters = props.result.priceFilters?.filter(
        x => !props.parameter.priceFilters?.find(y => y === x),
    );
    if (props.result.priceFilters?.length === 0) {
        props.result.priceFilters = undefined;
    }
};

export const RemoveAttributeValueFilters: HandlerType = props => {
    props.result.attributeValueIds = props.result.attributeValueIds?.filter(
        x => !props.parameter.attributeValueIds?.find(y => y === x),
    );
    if (props.result.attributeValueIds?.length === 0) {
        props.result.attributeValueIds = undefined;
    }
};

export const RemoveFilterCategory: HandlerType = ({ parameter: { categoryId }, result }) => {
    if (categoryId && categoryId === result.categoryId) {
        result.categoryId = undefined;
    }
};

export const RemoveStockedItemsFilter: HandlerType = ({ result, parameter: { stockedItemsOnly } }) => {
    if (stockedItemsOnly !== undefined) {
        result.stockedItemsOnly = undefined;
    }
};

export const RemovePreviouslyPurchasedFilter: HandlerType = ({
    result,
    parameter: { previouslyPurchasedProducts },
}) => {
    if (previouslyPurchasedProducts !== undefined) {
        result.previouslyPurchasedProducts = undefined;
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
    GetCurrentFilters,
    ResetPage,
    RemoveSearchWithin,
    RemoveBrands,
    RemoveProductLines,
    RemovePriceFilters,
    RemoveFilterCategory,
    RemoveAttributeValueFilters,
    RemoveStockedItemsFilter,
    RemovePreviouslyPurchasedFilter,
    DispatchSetProductFilters,
    DispatchSetFilterQuery,
];

const removeProductFilters = createHandlerChainRunner(chain, "RemoveProductFilters");
export default removeProductFilters;
