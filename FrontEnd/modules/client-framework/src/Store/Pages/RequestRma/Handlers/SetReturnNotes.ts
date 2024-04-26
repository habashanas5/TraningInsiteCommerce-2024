import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ returnNotes: string }>;

export const DispatchSetReturnNotes: HandlerType = props => {
    props.dispatch({
        type: "Pages/RequestRma/SetReturnNotes",
        returnNotes: props.parameter.returnNotes,
    });
};

export const chain = [DispatchSetReturnNotes];

const setReturnNotes = createHandlerChainRunner(chain, "SetReturnNotes");
export default setReturnNotes;
