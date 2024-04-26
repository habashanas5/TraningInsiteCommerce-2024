import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { ShipToModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = Handler<{
    shipTo: ShipToModel | undefined;
}>;

export const DispatchSelectShipTo: HandlerType = ({ dispatch, parameter: { shipTo } }) => {
    dispatch({
        type: "Components/AddressDrawer/SelectShipTo",
        shipTo,
    });
};

export const chain = [DispatchSelectShipTo];

const selectShipTo = createHandlerChainRunner(chain, "SelectShipTo");
export default selectShipTo;
