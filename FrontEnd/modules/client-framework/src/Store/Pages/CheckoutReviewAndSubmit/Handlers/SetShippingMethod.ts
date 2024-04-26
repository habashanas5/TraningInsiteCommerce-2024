import isApiError from "@insite/client-framework/Common/isApiError";
import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import {
    Cart,
    invalidAddressException,
    updateCart,
    UpdateCartApiParameter,
} from "@insite/client-framework/Services/CartService";
import { getCartState, getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCart";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import loadCurrentPromotions from "@insite/client-framework/Store/Data/Promotions/Handlers/LoadCurrentPromotions";
import { CarrierDto, ShipViaDto } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    {
        carrier: CarrierDto;
        shipVia: ShipViaDto;
    },
    UpdateCartApiParameter
>;

export const PopulateApiParameter: HandlerType = props => {
    const state = props.getState();
    const { cartId } = state.pages.checkoutReviewAndSubmit;
    const cart = cartId ? getCartState(state, cartId).value : getCurrentCartState(state).value;
    if (!cart) {
        throw new Error("There was no current cart and we are trying to set a shipping method on it.");
    }

    const updatedCart: Cart = {
        ...cart,
        ...props.parameter,
    };
    props.apiParameter = { cart: updatedCart };
};

export const UpdateCart: HandlerType = async props => {
    try {
        await updateCart(props.apiParameter);
    } catch (error) {
        if (isApiError(error) && error.status === 400 && error.errorJson.message === invalidAddressException) {
            props.dispatch({
                type: "Components/AddressErrorModal/SetIsOpen",
                isOpen: true,
            });
            return false;
        }
        throw error;
    }
};

export const LoadCart: HandlerType = props => {
    const state = props.getState();
    const { cartId } = state.pages.checkoutShipping;
    if (cartId) {
        props.dispatch(loadCart({ cartId }));
    } else {
        props.dispatch(loadCurrentCart());
    }
};

export const LoadPromotions: HandlerType = props => {
    props.dispatch(loadCurrentPromotions());
};

export const chain = [PopulateApiParameter, UpdateCart, LoadCart, LoadPromotions];

const setShippingMethod = createHandlerChainRunner(chain, "SetShippingMethod");
export default setShippingMethod;
