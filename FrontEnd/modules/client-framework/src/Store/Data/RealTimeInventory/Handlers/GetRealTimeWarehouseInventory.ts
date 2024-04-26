import { createHandlerChainRunnerForOldOnComplete, Handler } from "@insite/client-framework/HandlerCreator";
import {
    getProductRealTimeInventory,
    GetProductRealTimeInventoryApiV2Parameter,
} from "@insite/client-framework/Services/ProductServiceV2";
import { ProductInventoryDto, WarehouseDto } from "@insite/client-framework/Types/ApiModels";

interface Result {
    errorMessage: string;
    warehouses?: WarehouseDto[];
}

type HandlerType = Handler<
    GetProductRealTimeInventoryApiV2Parameter & {
        /** This is a legacy onComplete, it will only fire if the Handler CallOnComplete is hit */
        onComplete: (result: Result) => void;
        unitOfMeasure: string;
    },
    {
        apiParameter: GetProductRealTimeInventoryApiV2Parameter;
        apiResult?: ProductInventoryDto;
        result: Result;
    }
>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = props.parameter;
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getProductRealTimeInventory(props.apiParameter);
};

export const FindWarehouseData: HandlerType = props => {
    props.result = {
        errorMessage: "Inventory is not currently available",
    };

    if (props.apiResult && props.apiResult.inventoryWarehousesDtos) {
        const inventoryWarehousesDto = props.apiResult.inventoryWarehousesDtos.find(
            o => o.unitOfMeasure.toLowerCase() === props.parameter.unitOfMeasure.toLowerCase(),
        );

        if (inventoryWarehousesDto && inventoryWarehousesDto.warehouseDtos) {
            props.result = {
                warehouses: inventoryWarehousesDto.warehouseDtos,
                errorMessage: "",
            };
        }
    }
};

export const CallOnComplete: HandlerType = props => {
    props.parameter.onComplete(props.result);
};

export const chain = [PopulateApiParameter, RequestDataFromApi, FindWarehouseData, CallOnComplete];

const getRealTimeWarehouseInventory = createHandlerChainRunnerForOldOnComplete(chain, "GetRealTimeWarehouseInventory");
export default getRealTimeWarehouseInventory;
