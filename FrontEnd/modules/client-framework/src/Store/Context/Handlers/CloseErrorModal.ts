import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler;

export const DispatchSetErrorModalIsOpen: HandlerType = props => {
    props.dispatch({
        type: "Context/SetErrorModalIsOpen",
        isErrorModalOpen: false,
    });
};

export const chain = [DispatchSetErrorModalIsOpen];

const closeErrorModal = createHandlerChainRunnerOptionalParameter(chain, {}, "CloseErrorModal");
export default closeErrorModal;
