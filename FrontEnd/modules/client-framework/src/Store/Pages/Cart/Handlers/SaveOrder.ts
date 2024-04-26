import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnError,
    HasOnSuccess,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import {
    CartResult,
    UpdateCartApiParameter,
    updateCartWithResult,
} from "@insite/client-framework/Services/CartService";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";

type SaveOrderParameter = HasOnError<string> & HasOnSuccess<string>;

type HandlerType = ApiHandlerDiscreteParameter<SaveOrderParameter, UpdateCartApiParameter, CartResult>;

export const DispatchBeginRemoveCart: HandlerType = props => {
    props.dispatch({
        type: "Pages/Cart/BeginSavingOrder",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    const cartState = getCurrentCartState(props.getState());

    if (!cartState.value) {
        throw new Error("There was no current cart and we are trying to save the current cart.");
    }

    props.apiParameter = {
        cart: {
            ...cartState.value,
            status: "Saved",
        },
    };
};

export const UpdateCart: HandlerType = async props => {
    const result = await updateCartWithResult(props.apiParameter);
    if (result.successful) {
        props.apiResult = result.result;
    } else {
        props.dispatch({
            type: "Pages/Cart/CompleteSavingOrder",
        });

        props.parameter.onError?.(result.errorMessage);
        return false;
    }
};

export const DispatchCartsReset: HandlerType = props => {
    props.dispatch({
        type: "Data/Carts/Reset",
    });
};

export const LoadCart: HandlerType = props => {
    props.dispatch(loadCurrentCart());
};

export const DispatchCompleteSavingOrder: HandlerType = props => {
    props.dispatch({
        type: "Pages/Cart/CompleteSavingOrder",
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.(props.apiResult.cart.id);
};

export const chain = [
    DispatchBeginRemoveCart,
    PopulateApiParameter,
    UpdateCart,
    DispatchCartsReset,
    LoadCart,
    DispatchCompleteSavingOrder,
    ExecuteOnSuccessCallback,
];

const saveOrder = createHandlerChainRunner(chain, "SaveOrder");
export default saveOrder;
