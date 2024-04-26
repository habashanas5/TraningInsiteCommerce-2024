import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ editingSortOrder: boolean }>;

export const DispatchSetEditingSortOrder: HandlerType = props => {
    props.dispatch({
        type: "Pages/MyListDetails/SetEditingSortOrder",
        editingSortOrder: props.parameter.editingSortOrder,
    });
};

export const chain = [DispatchSetEditingSortOrder];

const setEditingSortOrder = createHandlerChainRunner(chain, "SetEditingSortOrder");
export default setEditingSortOrder;
