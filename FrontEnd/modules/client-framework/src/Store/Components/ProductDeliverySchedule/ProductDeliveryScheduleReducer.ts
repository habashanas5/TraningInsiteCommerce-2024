import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import ProductDeliveryScheduleState from "@insite/client-framework/Store/Components/ProductDeliverySchedule/ProductDeliveryScheduleState";
import { ProductSubscriptionDto } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: ProductDeliveryScheduleState = {
    modalIsOpen: false,
};

const reducer = {
    "Components/ProductDeliverySchedule/SetIsOpen": (
        draft: Draft<ProductDeliveryScheduleState>,
        action: {
            isOpen: boolean;
            subscription?: ProductSubscriptionDto;
            onSave?: (subscription: ProductSubscriptionDto) => void;
        },
    ) => {
        draft.modalIsOpen = action.isOpen;
        draft.subscription = action.subscription;
        draft.onSave = action.onSave;
    },
    "Components/ProductDeliverySchedule/Reset": (draft: Draft<ProductDeliveryScheduleState>) => {
        return { ...initialState };
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
