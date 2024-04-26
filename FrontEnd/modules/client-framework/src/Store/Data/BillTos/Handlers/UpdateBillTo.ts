import { ApiHandler, createHandlerChainRunner, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import {
    updateBillTo as updateBillToApi,
    UpdateBillToApiParameter,
} from "@insite/client-framework/Services/CustomersService";
import { BillToModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<UpdateBillToApiParameter & HasOnSuccess, BillToModel>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = props.parameter;
};

export const SendDataToApi: HandlerType = async props => {
    props.apiResult = await updateBillToApi(props.apiParameter);
};

export const DispatchCompleteLoadBillTo: HandlerType = props => {
    props.dispatch({
        type: "Data/BillTos/CompleteLoadBillTo",
        model: props.apiResult,
    });
};

export const UpdateShipToIfNeeded: HandlerType = props => {
    const shipTos = props.getState().data.shipTos;
    let shipTo = shipTos.byId[props.apiResult.id];
    if (!shipTo) {
        return;
    }

    shipTo = { ...shipTo };

    // only copy over values from billTo that exist on shipTo
    for (const key in shipTo) {
        const billToValue = (props.apiResult as any)[key];
        if (typeof billToValue === "undefined") {
            continue;
        }
        (shipTo as any)[key] = billToValue;
    }

    props.dispatch({
        type: "Data/ShipTos/CompleteLoadShipTo",
        model: shipTo,
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => props.parameter.onSuccess?.();

export const chain = [
    PopulateApiParameter,
    SendDataToApi,
    DispatchCompleteLoadBillTo,
    UpdateShipToIfNeeded,
    ExecuteOnSuccessCallback,
];

const updateBillTo = createHandlerChainRunner(chain, "UpdateBillTo");
export default updateBillTo;
