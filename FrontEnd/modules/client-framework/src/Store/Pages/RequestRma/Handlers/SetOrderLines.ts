import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { OrderLineModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = Handler<{ orderLines: OrderLineModel[] }>;

export const DispatchSetOrderLines: HandlerType = props => {
    props.dispatch({
        type: "Pages/RequestRma/SetOrderLines",
        orderLines: props.parameter.orderLines,
    });
};

export const chain = [DispatchSetOrderLines];

const setOrderLines = createHandlerChainRunner(chain, "SetOrderLines");
export default setOrderLines;
