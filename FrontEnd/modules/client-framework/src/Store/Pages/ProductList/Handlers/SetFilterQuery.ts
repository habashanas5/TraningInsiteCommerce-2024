import { createHandlerChainRunnerOptionalParameter, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import cloneDeep from "lodash/cloneDeep";
import qs from "qs";

type HandlerType = HandlerWithResult<{}, string>;

export const SetFilterQuery: HandlerType = props => {
    const queryObject = cloneDeep(props.getState().pages.productList.productFilters);
    delete queryObject.expand;
    delete queryObject.pageCategoryId;
    delete queryObject.pageProductLineId;
    delete queryObject.pageBrandId;

    props.result = qs.stringify(queryObject, { arrayFormat: "comma", skipNulls: true });
};

export const DispatchSetFilterQuery: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductList/SetFilterQuery",
        result: props.result,
    });
};

export const chain = [SetFilterQuery, DispatchSetFilterQuery];

const setFilterQuery = createHandlerChainRunnerOptionalParameter(chain, {}, "SetFilterQuery");
export default setFilterQuery;
