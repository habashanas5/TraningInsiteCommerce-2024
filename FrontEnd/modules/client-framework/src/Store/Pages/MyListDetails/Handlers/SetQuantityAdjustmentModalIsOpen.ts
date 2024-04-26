import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ modalIsOpen: boolean }>;

export const DispatchSetQuantityAdjustmentModalIsOpen: HandlerType = props => {
    props.dispatch({
        type: "Pages/MyListDetails/SetQuantityAdjustmentModalIsOpen",
        modalIsOpen: props.parameter.modalIsOpen,
    });
};

export const chain = [DispatchSetQuantityAdjustmentModalIsOpen];

const setQuantityAdjustmentModalIsOpen = createHandlerChainRunner(chain, "SetQuantityAdjustmentModalIsOpen");
export default setQuantityAdjustmentModalIsOpen;
