import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{
    navDrawerIsOpen?: boolean;
}>;

export const DispatchSetNavDrawerIsOpen: HandlerType = ({ dispatch, parameter: { navDrawerIsOpen } }) => {
    dispatch({
        type: "Components/AddressDrawer/SetNavDrawerIsOpen",
        navDrawerIsOpen,
    });
};

export const chain = [DispatchSetNavDrawerIsOpen];

const setNavDrawerIsOpen = createHandlerChainRunner(chain, "SetNavDrawerIsOpen");
export default setNavDrawerIsOpen;
