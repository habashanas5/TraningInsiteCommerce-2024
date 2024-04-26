import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";
import { getSession } from "@insite/client-framework/Store/Context/ContextSelectors";

export const ClearSearch: Handler = props => {
    const isSalesPerson = getSession(props.getState()).isSalesPerson;
    props.dispatch({
        type: "Pages/RfqMyQuotes/ClearParameter",
        isSalesPerson,
    });
};

export const chain = [ClearSearch];

const clearSearch = createHandlerChainRunnerOptionalParameter(chain, {}, "ClearSearch");
export default clearSearch;
