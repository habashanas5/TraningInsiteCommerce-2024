import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ index: number }>;

export const DispatchSetSelectedImageIndex: HandlerType = props => {
    props.dispatch({
        type: "Pages/ProductDetails/SetSelectedImageIndex",
        index: props.parameter.index,
    });
};

export const chain = [DispatchSetSelectedImageIndex];

const setSelectedImageIndex = createHandlerChainRunner(chain, "SetSelectedImageIndex");
export default setSelectedImageIndex;
