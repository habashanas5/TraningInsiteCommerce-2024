import { createHandlerChainRunnerOptionalParameter, HandlerWithResult } from "@insite/client-framework/HandlerCreator";

type HandlerType = HandlerWithResult<{}, number>;

export const CalculateTotal: HandlerType = props => {
    let total = 0;
    props.getState().pages.quickOrder.productInfos.forEach(o => {
        total += o.pricing?.extendedUnitNetPrice || 0;
    });
    props.result = total;
};

export const DispatchCalculateTotal: HandlerType = props => {
    props.dispatch({
        type: "Pages/QuickOrder/CalculateTotal",
        total: props.result,
    });
};

export const chain = [CalculateTotal, DispatchCalculateTotal];

const calculateTotal = createHandlerChainRunnerOptionalParameter(chain, {}, "CalculateTotal");
export default calculateTotal;
