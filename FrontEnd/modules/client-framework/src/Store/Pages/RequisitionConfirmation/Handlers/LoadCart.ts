import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { CartResult, getCart, GetCartApiParameter } from "@insite/client-framework/Services/CartService";

type HandlerType = ApiHandlerDiscreteParameter<{ cartId: string }, GetCartApiParameter, CartResult>;

export const DispatchBeginLoadCart: HandlerType = props => {
    props.dispatch({
        type: "Pages/RequisitionConfirmation/SetCartId",
        cartId: props.parameter.cartId,
    });
    props.dispatch({
        type: "Data/Carts/BeginLoadCart",
        id: props.parameter.cartId,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        cartId: props.parameter.cartId,
        expand: ["carriers", "creditCardBillingAddress", "cartLines", "validation", "restrictions", "shipping", "tax"],
    };
};

export const GetCart: HandlerType = async props => {
    props.apiResult = await getCart(props.apiParameter);
};

export const DispatchCompleteLoadOrder: HandlerType = props => {
    props.dispatch({
        type: "Data/Carts/CompleteLoadCart",
        model: props.apiResult.cart,
    });
};

export const DispatchCompleteLoadBillTo: HandlerType = props => {
    if (!props.apiResult.billTo) {
        return;
    }

    props.dispatch({
        type: "Data/BillTos/CompleteLoadBillTo",
        model: props.apiResult.billTo,
    });
};

export const DispatchCompleteLoadShipTo: HandlerType = props => {
    if (!props.apiResult.shipTo) {
        return;
    }

    props.dispatch({
        type: "Data/ShipTos/CompleteLoadShipTo",
        model: props.apiResult.shipTo,
    });
};

export const chain = [
    DispatchBeginLoadCart,
    PopulateApiParameter,
    GetCart,
    DispatchCompleteLoadOrder,
    DispatchCompleteLoadBillTo,
    DispatchCompleteLoadShipTo,
];

const loadCart = createHandlerChainRunner(chain, "LoadCart");
export default loadCart;
