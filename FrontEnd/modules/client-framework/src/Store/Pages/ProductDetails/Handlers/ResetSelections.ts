import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler;

export const DispatchResetSelections: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductDetails/ResetSelections",
    });
};

export const chain = [DispatchResetSelections];

const resetSelections = createHandlerChainRunnerOptionalParameter(chain, {}, "ResetSelections");
export default resetSelections;
