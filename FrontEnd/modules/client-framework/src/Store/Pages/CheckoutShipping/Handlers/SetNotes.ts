import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ notes: string }>;

export const DispatchSetNotes: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutShipping/SetNotes",
        notes: props.parameter.notes,
    });
};

export const chain = [DispatchSetNotes];

const setNotes = createHandlerChainRunner(chain, "SetNotes");
export default setNotes;
