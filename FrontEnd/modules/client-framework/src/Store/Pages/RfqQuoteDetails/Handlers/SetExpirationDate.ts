import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ expirationDate?: Date }>;

export const DispatchSetExpirationDate: HandlerType = props => {
    props.dispatch({
        type: "Pages/RfqQuoteDetails/SetExpirationDate",
        expirationDate: props.parameter.expirationDate,
    });
};

export const chain = [DispatchSetExpirationDate];

const setExpirationDate = createHandlerChainRunner(chain, "SetExpirationDate");
export default setExpirationDate;
