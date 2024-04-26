import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnError,
} from "@insite/client-framework/HandlerCreator";
import { GetCartApiParameter } from "@insite/client-framework/Services/CartService";
import { getCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCart";
import { CartModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    {
        cartId: string;
    } & HasOnError,
    GetCartApiParameter,
    CartModel
>;

export const PopulateApiParameter: HandlerType = props => {
    const state = props.getState();
    const currentCartId = state.pages.savedOrderDetails.cartId;
    const savedOrderState = getCartState(state, props.parameter.cartId);
    if (!savedOrderState.value?.cartLines || savedOrderState.value.cartLines.length === 0) {
        if (currentCartId !== props.parameter.cartId) {
            props.apiParameter = {
                cartId: props.parameter.cartId,
                expand: ["cartLines", "hiddenproducts", "restrictions"],
            } as GetCartApiParameter;
        } else {
            props.parameter.onError?.();
            return false;
        }
    }
};

export const DispatchSetCartId: HandlerType = props => {
    props.dispatch({
        type: "Pages/SavedOrderDetails/SetCartId",
        cartId: props.parameter.cartId,
    });
};

export const DispatchLoadOrderIfNeeded: HandlerType = props => {
    if (props.apiParameter) {
        props.dispatch(
            loadCart({
                apiParameter: props.apiParameter,
            }),
        );
    }
};

export const chain = [PopulateApiParameter, DispatchSetCartId, DispatchLoadOrderIfNeeded];

const displayOrder = createHandlerChainRunner(chain, "DisplayOrder");
export default displayOrder;
