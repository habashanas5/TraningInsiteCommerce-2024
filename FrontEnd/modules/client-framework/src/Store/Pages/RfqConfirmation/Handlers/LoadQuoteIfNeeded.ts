import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { GetQuoteApiParameter } from "@insite/client-framework/Services/QuoteService";
import loadQuote from "@insite/client-framework/Store/Data/Quotes/Handlers/LoadQuote";
import { getQuoteState } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import { QuoteModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetQuoteApiParameter, QuoteModel>;

export const DispatchSetQuoteId: HandlerType = props => {
    props.dispatch({
        type: "Pages/RfqConfirmation/SetQuoteId",
        quoteId: props.parameter.quoteId,
    });
};

export const DispatchLoadQuoteIfNeeded: HandlerType = props => {
    const quoteState = getQuoteState(props.getState(), props.parameter.quoteId);
    if (!quoteState.value) {
        props.dispatch(loadQuote({ quoteId: props.parameter.quoteId }));
    }
};

export const chain = [DispatchSetQuoteId, DispatchLoadQuoteIfNeeded];

const loadQuoteIfNeeded = createHandlerChainRunner(chain, "LoadQuoteIfNeeded");
export default loadQuoteIfNeeded;
