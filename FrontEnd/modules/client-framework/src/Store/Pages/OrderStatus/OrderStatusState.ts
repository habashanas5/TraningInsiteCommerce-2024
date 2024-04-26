import { OrderModel } from "@insite/client-framework/Types/ApiModels";

export default interface OrderStatusState {
    order?: OrderModel;
    isReordering: boolean;
    isLoading?: boolean;
}
