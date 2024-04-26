import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import setInitialValues from "@insite/client-framework/Store/Components/AddressDrawer/Handlers/SetInitialValues";

type HandlerType = Handler<{
    isOpen: boolean;
}>;

export const LoadInitialValues: HandlerType = ({ dispatch, parameter: { isOpen } }) => {
    if (isOpen) {
        dispatch(setInitialValues({}));
    }
};

export const DispatchSetIsOpen: HandlerType = ({ dispatch, parameter: { isOpen } }) => {
    dispatch({
        type: "Components/AddressDrawer/SetIsOpen",
        isOpen,
    });
};

export const chain = [LoadInitialValues, DispatchSetIsOpen];

const setDrawerIsOpen = createHandlerChainRunner(chain, "SetDrawerIsOpen");
export default setDrawerIsOpen;
