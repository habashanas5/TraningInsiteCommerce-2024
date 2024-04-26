import { createHandlerChainRunner, Handler, HandlerWithResult } from "@insite/client-framework/HandlerCreator";
import { BreakPriceRfqModel, QuoteLineModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = Handler<{ quoteLine: QuoteLineModel }>;

export const DispatchSetQuoteLineForCalculation: HandlerType = props => {
    props.dispatch({
        type: "Pages/RfqQuoteDetails/SetQuoteLineForCalculation",
        quoteLine: props.parameter.quoteLine,
    });
};

export const chain = [DispatchSetQuoteLineForCalculation];

const setQuoteLineForCalculation = createHandlerChainRunner(chain, "SetQuoteLineForCalculation");
export default setQuoteLineForCalculation;
