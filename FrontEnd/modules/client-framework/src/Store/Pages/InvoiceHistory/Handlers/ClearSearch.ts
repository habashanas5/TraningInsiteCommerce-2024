import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";

export const ClearSearch: Handler = props => {
    props.dispatch({
        type: "Pages/InvoiceHistory/ClearParameter",
    });
};

export const chain = [ClearSearch];

const clearSearch = createHandlerChainRunnerOptionalParameter(chain, {}, "ClearSearch");
export default clearSearch;
