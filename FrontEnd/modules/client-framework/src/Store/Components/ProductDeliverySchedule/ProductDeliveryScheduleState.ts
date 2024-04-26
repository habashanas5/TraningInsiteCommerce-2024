import { ProductSubscriptionDto } from "@insite/client-framework/Types/ApiModels";

export default interface ProductDeliveryScheduleState {
    modalIsOpen: boolean;
    subscription?: ProductSubscriptionDto;
    onSave?: (subscription: ProductSubscriptionDto) => void;
}
