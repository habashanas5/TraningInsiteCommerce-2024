import { OrderLineModel } from "@insite/client-framework/Types/ApiModels";

export default interface RequestRmaState {
    orderLines: OrderLineModel[];
    returnNotes?: string;
    resultMessage?: string;
    canSendReturnRequest: boolean;
}
