import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnSuccess,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import {
    Cart,
    CartResult,
    UpdateCartApiParameter,
    updateCartWithResult,
} from "@insite/client-framework/Services/CartService";
import { getCartState, getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";

type HandlerType = ApiHandlerDiscreteParameter<HasOnSuccess<string>, UpdateCartApiParameter, CartResult>;

export const DispatchBeginPlaceOrderForApproval: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutReviewAndSubmit/BeginPlaceOrderForApproval",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    const state = props.getState();
    const cartId = state.pages?.checkoutReviewAndSubmit?.cartId;
    const cartState = cartId ? getCartState(state, cartId) : getCurrentCartState(state);

    if (!cartState.value) {
        throw new Error("There was no current cart and we are trying to place the current cart as an order.");
    }

    props.apiParameter = {
        cart: {
            ...cartState.value,
            status: "AwaitingApproval",
        },
    };
};

export const UpdateCart: HandlerType = async props => {
    const result = await updateCartWithResult(props.apiParameter);
    if (result.successful) {
        props.apiResult = result.result;
    } else {
        props.dispatch({
            type: "Pages/CheckoutReviewAndSubmit/SetPlaceOrderErrorMessage",
            errorMessage: result.errorMessage,
        });
        props.dispatch({
            type: "Pages/CheckoutReviewAndSubmit/CompletePlaceOrderForApproval",
        });
        return false;
    }
};

export const ReloadCurrentCart: HandlerType = props => {
    props.dispatch(loadCurrentCart());
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    if (props.parameter.onSuccess) {
        markSkipOnCompleteIfOnSuccessIsSet(props);
        props.parameter.onSuccess(props.apiResult.cart.id);
    }
};

export const DispatchCompletePlaceOrderForApproval: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutReviewAndSubmit/CompletePlaceOrderForApproval",
    });
};

export const DispatchResetOrders: HandlerType = props => {
    props.dispatch({
        type: "Data/Orders/Reset",
    });
};

export const DispatchResetQuotes: HandlerType = props => {
    const state = props.getState();
    const { cartId } = state.pages.checkoutShipping;
    if (cartId) {
        props.dispatch({
            type: "Data/Quotes/Reset",
        });
        props.dispatch({
            type: "Data/JobQuotes/Reset",
        });
    }
};

export const chain = [
    DispatchBeginPlaceOrderForApproval,
    PopulateApiParameter,
    UpdateCart,
    ReloadCurrentCart,
    ExecuteOnSuccessCallback,
    DispatchCompletePlaceOrderForApproval,
    DispatchResetOrders,
    DispatchResetQuotes,
];

const placeOrderForApproval = createHandlerChainRunner(chain, "PlaceOrderForApproval");
export default placeOrderForApproval;
