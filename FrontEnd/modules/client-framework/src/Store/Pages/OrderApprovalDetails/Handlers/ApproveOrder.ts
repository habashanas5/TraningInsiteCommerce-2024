import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import { updateCart, UpdateCartApiParameter } from "@insite/client-framework/Services/CartService";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { getOrderApprovalsState } from "@insite/client-framework/Store/Data/OrderApprovals/OrderApprovalsSelectors";
import { CartModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<HasOnSuccess, UpdateCartApiParameter, CartModel>;

const CART_STATUS = "Cart";

export const DispatchBeginApproveOrder: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderApprovalDetails/BeginApproveOrder",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    const state = props.getState();
    const order = getOrderApprovalsState(state, state.pages.orderApprovalDetails.cartId);
    if (!order.value) {
        throw new Error("ApproveOrder was called but there was no order");
    }

    props.apiParameter = {
        cart: {
            ...order.value,
            status: CART_STATUS,
        },
    };
};

export const SendDataToApi: HandlerType = async props => {
    await updateCart(props.apiParameter);
};

export const DispatchCompleteApproveOrder: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderApprovalDetails/CompleteApproveOrder",
    });
    props.dispatch(loadCurrentCart({ shouldLoadFullCart: true }));
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [
    DispatchBeginApproveOrder,
    PopulateApiParameter,
    SendDataToApi,
    DispatchCompleteApproveOrder,
    ExecuteOnSuccessCallback,
];

const approveOrder = createHandlerChainRunnerOptionalParameter(chain, {}, "ApproveOrder");
export default approveOrder;
