import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { WarehouseModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = Handler<{
    warehouse: WarehouseModel;
}>;

export const DispatchSetPickUpWarehouse: HandlerType = props => {
    props.dispatch({
        type: "Components/AddressDrawer/SetPickUpWarehouse",
        pickUpWarehouse: props.parameter.warehouse,
    });
};

export const chain = [DispatchSetPickUpWarehouse];

const changePickUpWarehouse = createHandlerChainRunner(chain, "ChangePickUpWarehouse");
export default changePickUpWarehouse;
