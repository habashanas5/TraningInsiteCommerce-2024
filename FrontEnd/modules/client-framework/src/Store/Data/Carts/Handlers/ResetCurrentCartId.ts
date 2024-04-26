import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";

export const DispatchResetCurrentCartId: Handler = props => {
    props.dispatch({
        type: "Data/Carts/ResetCurrentCartId",
        cartId: API_URL_CURRENT_FRAGMENT,
    });
};

export const chain = [DispatchResetCurrentCartId];

const resetCurrentCartId = createHandlerChainRunner(chain, "ResetCurrentCartId");
export default resetCurrentCartId;
