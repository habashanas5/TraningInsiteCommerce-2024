import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { QuoteParameter } from "@insite/client-framework/Store/Pages/RfqRequestQuote/RfqRequestQuoteState";

type HandlerType = Handler<QuoteParameter>;

export const DispatchUpdateLoadParameter: HandlerType = props => {
    props.dispatch({
        type: "Pages/RfqRequestQuote/UpdateQuoteParameter",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateLoadParameter];

const updateQuoteParameter = createHandlerChainRunner(chain, "UpdateQuoteParameter");
export default updateQuoteParameter;
