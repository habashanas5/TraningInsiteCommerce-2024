import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler;

export const DispatchCompleteSetProduct: HandlerType = props => {
    props.dispatch({
        type: "Components/ProductSelector/CompleteSetProduct",
    });
};

export const chain = [DispatchCompleteSetProduct];

const clearProduct = createHandlerChainRunnerOptionalParameter(chain, {}, "ClearProduct");
export default clearProduct;
