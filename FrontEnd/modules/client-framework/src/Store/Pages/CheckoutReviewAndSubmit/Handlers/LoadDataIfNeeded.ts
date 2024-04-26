import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { getCartState, getCurrentCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCart";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { getCurrentCountries } from "@insite/client-framework/Store/Data/Countries/CountriesSelectors";
import loadCurrentCountries from "@insite/client-framework/Store/Data/Countries/Handlers/LoadCurrentCountries";
import loadCurrentPromotions from "@insite/client-framework/Store/Data/Promotions/Handlers/LoadCurrentPromotions";
import loadPromotions from "@insite/client-framework/Store/Data/Promotions/Handlers/LoadPromotions";
import {
    getCurrentPromotionsDataView,
    getPromotionsDataView,
} from "@insite/client-framework/Store/Data/Promotions/PromotionsSelectors";

type HandlerType = Handler<{
    cartId?: string;
    onSuccess?: () => void;
}>;

export const DispatchSetCartId: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutReviewAndSubmit/SetCartId",
        cartId: props.parameter.cartId,
    });
};

export const LoadData: HandlerType = props => {
    const state = props.getState();
    if (!getCurrentCountries(state)) {
        props.dispatch(loadCurrentCountries());
    }
    if (props.parameter.cartId) {
        const cartState = getCartState(state, props.parameter.cartId);
        if (!cartState.value && !cartState.isLoading) {
            props.dispatch(loadCart({ cartId: props.parameter.cartId }));
        }
        const promotionsState = getPromotionsDataView(state, props.parameter.cartId);
        if (!promotionsState.value && !promotionsState.isLoading) {
            props.dispatch(loadPromotions({ cartId: props.parameter.cartId }));
        }
    } else {
        const currentCartState = getCurrentCartState(state);
        if (!currentCartState.value && !currentCartState.isLoading) {
            props.dispatch(loadCurrentCart());
        }
        const currentPromotionsState = getCurrentPromotionsDataView(state);
        if (!currentPromotionsState.value && !currentPromotionsState.isLoading) {
            props.dispatch(loadCurrentPromotions());
        }
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.();
};

export const chain = [DispatchSetCartId, LoadData, ExecuteOnSuccessCallback];

const loadDataIfNeeded = createHandlerChainRunner(chain, "LoadDataIfNeeded");
export default loadDataIfNeeded;
