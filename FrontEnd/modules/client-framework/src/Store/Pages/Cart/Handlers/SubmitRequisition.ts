import {
    createHandlerChainRunnerOptionalParameter,
    HandlerWithResult,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import { Cart, updateCart } from "@insite/client-framework/Services/CartService";
import { getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { CartModel } from "@insite/client-framework/Types/ApiModels";
import cloneDeep from "lodash/cloneDeep";

type HandlerType = HandlerWithResult<HasOnSuccess<Cart>, Cart, { cartToUpdate: CartModel }>;

export const SetCartStatus: HandlerType = props => {
    const state = props.getState();
    const cart = getCurrentCartState(state).value;

    if (!cart) {
        throw new Error("There was no current cart");
    }

    props.cartToUpdate = {
        ...cloneDeep(cart),
        status: "RequisitionSubmitted",
    };
};

export const UpdateCart: HandlerType = async props => {
    props.result = (await updateCart({ cart: props.cartToUpdate })).cart;
};

export const LoadCart: HandlerType = props => {
    props.dispatch(loadCurrentCart());
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.(props.result);
};

export const chain = [SetCartStatus, UpdateCart, LoadCart, ExecuteOnSuccessCallback];

const submitRequisition = createHandlerChainRunnerOptionalParameter(chain, {}, "SubmitRequisition");
export default submitRequisition;
