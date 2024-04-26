import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler;

export const DispatchClearProducts: HandlerType = props => {
    props.dispatch({
        type: "Pages/QuickOrder/ClearProducts",
    });
};

export const chain = [DispatchClearProducts];

const clearProducts = createHandlerChainRunnerOptionalParameter(chain, {}, "ClearProducts");
export default clearProducts;
