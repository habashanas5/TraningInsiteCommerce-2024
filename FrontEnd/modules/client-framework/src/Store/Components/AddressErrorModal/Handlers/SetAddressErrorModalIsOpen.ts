import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

interface Parameter {
    modalIsOpen: boolean;
}

type HandlerType = Handler<Parameter>;

export const DispatchSetAddressErrorModalIsOpen: HandlerType = props => {
    props.dispatch({
        type: "Components/AddressErrorModal/SetIsOpen",
        isOpen: props.parameter.modalIsOpen,
    });
};

export const chain = [DispatchSetAddressErrorModalIsOpen];

const setAddressErrorModalIsOpen = createHandlerChainRunner(chain, "SetAddressErrorModalIsOpen");
export default setAddressErrorModalIsOpen;
