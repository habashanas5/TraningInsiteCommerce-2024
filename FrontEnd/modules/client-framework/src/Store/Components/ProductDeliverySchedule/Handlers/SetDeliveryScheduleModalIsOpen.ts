import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { ProductSubscriptionDto } from "@insite/client-framework/Types/ApiModels";

type HandlerType = Handler<{
    isOpen: boolean;
    subscription?: ProductSubscriptionDto;
    onSave?: (subscription: ProductSubscriptionDto) => void;
}>;

export const DispatchSetIsOpen: HandlerType = props => {
    props.dispatch({
        type: "Components/ProductDeliverySchedule/SetIsOpen",
        isOpen: props.parameter.isOpen,
        subscription: props.parameter.subscription,
        onSave: props.parameter.onSave,
    });
};

export const chain = [DispatchSetIsOpen];

const setDeliveryScheduleModalIsOpen = createHandlerChainRunner(chain, "SetDeliveryScheduleModalIsOpen");
export default setDeliveryScheduleModalIsOpen;
