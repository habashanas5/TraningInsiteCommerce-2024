import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{
    isDefault: boolean;
}>;

export const DispatchSetAsDefault: HandlerType = ({ dispatch, parameter: { isDefault } }) => {
    dispatch({
        type: "Components/AddressDrawer/SetAsDefault",
        isDefault,
    });
};

export const chain = [DispatchSetAsDefault];

const setAsDefault = createHandlerChainRunner(chain, "SetAsDefault");
export default setAsDefault;
