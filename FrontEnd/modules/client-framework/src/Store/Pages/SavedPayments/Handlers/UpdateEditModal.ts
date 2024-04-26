import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { AccountPaymentProfileModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = Handler<{ paymentProfile?: AccountPaymentProfileModel; modalIsOpen: boolean }>;

export const DispatchUpdateModal: HandlerType = props => {
    props.dispatch({
        type: "Pages/SavedPayments/UpdateEditModal",
        modalIsOpen: props.parameter.modalIsOpen,
        paymentProfile: props.parameter.paymentProfile,
    });
};

export const chain = [DispatchUpdateModal];

const updateEditModal = createHandlerChainRunner(chain, "UpdateEditModal");
export default updateEditModal;
