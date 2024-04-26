import { updateContext } from "@insite/client-framework/Context";
import {
    ApiHandlerNoApiParameter,
    createHandlerChainRunner,
    HasOnSuccess,
    makeHandlerChainAwaitable,
} from "@insite/client-framework/HandlerCreator";
import { updateCart as updateCartApi } from "@insite/client-framework/Services/CartService";
import { createShipTo, updateShipTo as updateShipToApi } from "@insite/client-framework/Services/CustomersService";
import { updateSession } from "@insite/client-framework/Services/SessionService";
import loadSession from "@insite/client-framework/Store/Context/Handlers/LoadSession";
import { getCartState, getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCart";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import loadShipTo from "@insite/client-framework/Store/Data/ShipTos/Handlers/LoadShipTo";
import { getShipToState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosSelectors";
import { ShipToModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerNoApiParameter<
    {
        billToId: string;
        shipTo: ShipToModel;
    } & HasOnSuccess<boolean>,
    ShipToModel
>;

export const AddOrUpdateShipTo: HandlerType = async props => {
    if (props.parameter.shipTo.isNew) {
        props.apiResult = await createShipTo({
            shipTo: props.parameter.shipTo,
        });
    } else {
        props.apiResult = await updateShipToApi({
            billToId: props.parameter.billToId,
            shipTo: props.parameter.shipTo,
        });
    }

    // reload to make sure we get validation
    await makeHandlerChainAwaitable(loadShipTo)({
        billToId: props.parameter.billToId,
        shipToId: props.apiResult.id,
    })(props.dispatch, props.getState);
};

export const DispatchShipTosResetDataViews: HandlerType = props => {
    props.dispatch({
        type: "Data/ShipTos/ResetDataViews",
    });
};

export const UpdateContext: HandlerType = props => {
    const state = props.getState();
    const { cartId } = state.pages.checkoutShipping;
    if (!cartId && props.apiResult) {
        updateContext({
            billToId: props.parameter.billToId,
            shipToId: props.apiResult.id,
        });
    }
};

export const UpdateSession: HandlerType = async props => {
    const state = props.getState();
    const { cartId } = state.pages.checkoutShipping;
    if (!cartId && props.apiResult) {
        await updateSession({
            session: {
                billToId: props.parameter.billToId,
                shipToId: props.apiResult.id,
                customerWasUpdated: true,
            },
        });
    }
};

export const LoadSession: HandlerType = props => {
    const state = props.getState();
    const { cartId } = state.pages.checkoutShipping;
    if (!cartId && props.apiResult) {
        props.dispatch(loadSession());
    }
};

export const UpdateCart: HandlerType = async props => {
    const state = props.getState();
    const { cartId } = state.pages.checkoutShipping;
    if (cartId && props.apiResult) {
        const cart = getCartState(state, cartId).value!;
        await updateCartApi({
            cart: {
                ...cart,
                shipToId: props.apiResult.id,
            },
        });
    }
};

export const LoadCart: HandlerType = async props => {
    const state = props.getState();
    const { cartId } = state.pages.checkoutShipping;
    if (cartId) {
        props.dispatch(loadCart({ cartId }));
    } else {
        await makeHandlerChainAwaitable(loadCurrentCart)({ OnSuccess: () => {}, getPromotions: true })(
            props.dispatch,
            props.getState,
        );
    }
};

export const DispatchCompleteUpdateShipTo: HandlerType = props => {
    const shipToState = getShipToState(props.getState(), props.apiResult.id);

    props.dispatch({
        type: "Pages/CheckoutShipping/CompleteUpdateShipTo",
        shipTo: shipToState.value!,
    });
};

export const DispatchSetLastSelectedShipTo: HandlerType = props => {
    const state = props.getState();
    const {
        pages: {
            checkoutShipping: { useOneTimeAddress },
        },
    } = state;
    if (useOneTimeAddress) {
        return;
    }

    const shipToState = getShipToState(state, props.apiResult.id);

    props.dispatch({
        type: "Pages/CheckoutShipping/SetLastSelectedShipTo",
        shipTo: shipToState.value!,
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    const state = props.getState();
    const { cartId } = state.pages.checkoutShipping;
    const cart = cartId ? getCartState(state, cartId).value : getCurrentCartState(state).value;
    const hasCartlines = (cart?.cartLines?.length || 0) > 0;
    props.parameter.onSuccess?.(hasCartlines);
};

export const chain = [
    AddOrUpdateShipTo,
    DispatchShipTosResetDataViews,
    UpdateContext,
    UpdateSession,
    LoadSession,
    UpdateCart,
    LoadCart,
    DispatchCompleteUpdateShipTo,
    DispatchSetLastSelectedShipTo,
    ExecuteOnSuccessCallback,
];

const updateShipTo = createHandlerChainRunner(chain, "UpdateShipTo");
export default updateShipTo;
