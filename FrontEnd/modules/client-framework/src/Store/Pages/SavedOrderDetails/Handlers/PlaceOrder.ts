import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
    HasOnError,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import {
    AddCartLinesApiParameter,
    addLineCollection,
    updateCart,
    UpdateCartApiParameter,
} from "@insite/client-framework/Services/CartService";
import { getCartState, getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import deleteOrder from "@insite/client-framework/Store/Pages/SavedOrderDetails/Handlers/DeleteOrder";
import displayOrder from "@insite/client-framework/Store/Pages/SavedOrderDetails/Handlers/DisplayOrder";
import translate from "@insite/client-framework/Translate";
import { CartLineModel, CartModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    { order?: CartModel } & HasOnSuccess & HasOnError<string>,
    AddCartLinesApiParameter,
    CartModel,
    { updateCartApiParameter: UpdateCartApiParameter }
>;

export const DispatchBeginPlaceOrder: HandlerType = props => {
    props.dispatch({
        type: "Pages/SavedOrderDetails/BeginPlaceOrder",
    });
};

export const PopulateAddLineCollectionApiParameter: HandlerType = props => {
    const state = props.getState();
    const order = props.parameter.order ?? getCartState(state, state.pages.savedOrderDetails.cartId).value;
    if (!order) {
        throw new Error("PlaceOrder was called but there was no order");
    }

    const availableLines = order.cartLines!.filter(
        (cartLine: CartLineModel) =>
            cartLine.canAddToCart && (cartLine.availability?.messageType !== 2 || cartLine.canBackOrder),
    );

    props.apiParameter = {
        cartId: API_URL_CURRENT_FRAGMENT,
        cartLineCollection: {
            cartLines: availableLines,
        },
    } as AddCartLinesApiParameter;
};

export const SendDataToApi: HandlerType = async props => {
    try {
        await addLineCollection(props.apiParameter);
    } catch (error) {
        if (error.status === 404) {
            const state = props.getState();
            const cartId = state.pages.savedOrderDetails.cartId;
            props.dispatch({
                type: "Pages/SavedOrderDetails/Reset",
            });
            if (cartId) {
                props.dispatch(displayOrder({ cartId }));
            }

            props.parameter.onError?.(translate("Cannot place order - product not found"));
            return false;
        }
        throw error;
    }
};

export const PopulateUpdateCartApiParameter: HandlerType = props => {
    const state = props.getState();
    const order = props.parameter.order ?? getCartState(state, state.pages.savedOrderDetails.cartId).value;
    const currentCart = getCurrentCartState(state);
    let shouldUpdateCart = false;
    const orderForUpdate = {
        ...currentCart.value!,
    };

    if (order!.notes) {
        orderForUpdate.notes = order!.notes;
        shouldUpdateCart = true;
    }
    if (order!.requestedDeliveryDate) {
        orderForUpdate.requestedDeliveryDate = order!.requestedDeliveryDate;
        shouldUpdateCart = true;
    }
    if (order!.poNumber) {
        orderForUpdate.poNumber = order!.poNumber;
        shouldUpdateCart = true;
    }

    if (shouldUpdateCart) {
        props.updateCartApiParameter = { cart: orderForUpdate };
    }
};

export const UpdateCart: HandlerType = async props => {
    if (!props.updateCartApiParameter) {
        return;
    }

    await updateCart(props.updateCartApiParameter);
};

export const DeleteSavedOrder: HandlerType = props => {
    props.dispatch(deleteOrder());
};

export const DispatchCompletePlaceOrder: HandlerType = props => {
    props.dispatch({
        type: "Pages/SavedOrderDetails/CompletePlaceOrder",
    });
};

export const LoadCart: HandlerType = props => {
    props.dispatch(loadCurrentCart({ shouldLoadFullCart: true }));
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    DispatchBeginPlaceOrder,
    PopulateAddLineCollectionApiParameter,
    SendDataToApi,
    PopulateUpdateCartApiParameter,
    UpdateCart,
    DeleteSavedOrder,
    DispatchCompletePlaceOrder,
    LoadCart,
    ExecuteOnSuccessCallback,
];

const placeOrder = createHandlerChainRunnerOptionalParameter(chain, {}, "PlaceOrder");
export default placeOrder;
