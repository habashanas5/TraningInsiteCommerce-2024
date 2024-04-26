import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ jobQuoteLineId: string; qtyOrdered: number }>;

export const DispatchSetQtyOrdered: HandlerType = props => {
    props.dispatch({
        type: "Pages/RfqJobQuoteDetails/SetQtyOrdered",
        jobQuoteLineId: props.parameter.jobQuoteLineId,
        qtyOrdered: props.parameter.qtyOrdered,
    });
};

export const chain = [DispatchSetQtyOrdered];

const setQtyOrdered = createHandlerChainRunner(chain, "SetQtyOrdered");
export default setQtyOrdered;
