import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{
    fulfillmentMethod: string;
}>;

export const DispatchChangeFulfillmentMethod: HandlerType = ({ dispatch, parameter: { fulfillmentMethod } }) => {
    dispatch({
        type: "Components/AddressDrawer/ChangeFulfillmentMethod",
        fulfillmentMethod,
    });
};

export const chain = [DispatchChangeFulfillmentMethod];

const changeFulfillmentMethod = createHandlerChainRunner(chain, "ChangeFulfillmentMethod");
export default changeFulfillmentMethod;
