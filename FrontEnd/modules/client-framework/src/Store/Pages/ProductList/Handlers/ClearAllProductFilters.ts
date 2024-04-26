import { createHandlerChainRunnerOptionalParameter, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import setFilterQuery from "@insite/client-framework/Store/Pages/ProductList/Handlers/SetFilterQuery";
import { ProductFilters } from "@insite/client-framework/Store/Pages/ProductList/ProductListState";
import cloneDeep from "lodash/cloneDeep";

type HandlerType = HandlerWithResult<
    {
        removeAll?: true;
    },
    ProductFilters
>;

export const GetCurrentFilters: HandlerType = props => {
    props.result = cloneDeep(props.getState().pages.productList.productFilters);
};

export const RemoveAllFilters: HandlerType = props => {
    if (props.parameter.removeAll) {
        props.result.query = undefined;
        props.result.includeSuggestions = undefined;
    }
    props.result.stockedItemsOnly = undefined;
    props.result.previouslyPurchasedProducts = undefined;
    props.result.searchWithinQueries = undefined;
    props.result.brandIds = undefined;
    props.result.productLineIds = undefined;
    props.result.priceFilters = undefined;
    props.result.attributeValueIds = undefined;
    props.result.categoryId = undefined;
    props.result.page = undefined;
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

export const chain = [GetCurrentFilters, RemoveAllFilters, DispatchSetProductFilters, DispatchSetFilterQuery];

const clearAllProductFilters = createHandlerChainRunnerOptionalParameter(chain, {}, "ClearAllProductFilters");
export default clearAllProductFilters;
