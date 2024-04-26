import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler;

export const DispatchCloseVariantModal: HandlerType = props => {
    props.dispatch({
        type: "Components/ProductSelector/CloseVariantModal",
    });
};

export const chain = [DispatchCloseVariantModal];

const closeVariantModal = createHandlerChainRunnerOptionalParameter(chain, {}, "CloseVariantModal");
export default closeVariantModal;
