import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import { clearCart, ClearCartApiParameter } from "@insite/client-framework/Services/CartService";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { CartModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<HasOnSuccess, ClearCartApiParameter, CartModel>;

export const DispatchBeginDeleteOrder: HandlerType = props => {
    props.dispatch({
        type: "Pages/SavedOrderDetails/BeginDeleteOrder",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    const state = props.getState();
    const cartId = state.pages.savedOrderDetails.cartId;
    if (cartId) {
        props.apiParameter = {
            cartId,
        };
    } else {
        throw new Error("Delete saved order was called but there was no order.");
    }
};

export const SendDataToApi: HandlerType = async props => {
    await clearCart(props.apiParameter);
};

export const LoadCart: HandlerType = props => {
    const state = props.getState();
    const currentCartId = state.data.carts.currentId;

    if (currentCartId !== props.apiParameter.cartId) {
        return;
    }

    props.dispatch(loadCurrentCart());
};

export const DispatchCartsReset: HandlerType = props => {
    props.dispatch({
        type: "Data/Carts/ResetCart",
        id: props.apiParameter.cartId,
    });
};

export const DispatchCompleteDeleteOrder: HandlerType = props => {
    props.dispatch({
        type: "Pages/SavedOrderDetails/CompleteDeleteOrder",
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    DispatchBeginDeleteOrder,
    PopulateApiParameter,
    SendDataToApi,
    LoadCart,
    DispatchCartsReset,
    DispatchCompleteDeleteOrder,
    ExecuteOnSuccessCallback,
];

const deleteOrder = createHandlerChainRunnerOptionalParameter(chain, {}, "DeleteOrder");
export default deleteOrder;
