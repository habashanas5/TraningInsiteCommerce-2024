import waitFor from "@insite/client-framework/Common/Utilities/waitFor";
import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { getAddressFieldsDataView } from "@insite/client-framework/Store/Data/AddressFields/AddressFieldsSelector";
import loadAddressFields from "@insite/client-framework/Store/Data/AddressFields/Handlers/LoadAddressFields";
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
    onSuccess: () => void;
}>;

export const DispatchBeginPreloadingData: HandlerType = props => {
    props.dispatch({
        type: "Pages/CheckoutShipping/SetCartId",
        cartId: props.parameter.cartId,
    });
    props.dispatch({
        type: "Pages/CheckoutShipping/SetIsPreloadingData",
        isPreloadingData: true,
    });
};

export const PreloadData: HandlerType = props => {
    const state = props.getState();
    if (!getCurrentCountries(state)) {
        props.dispatch(loadCurrentCountries());
    }
    if (!getAddressFieldsDataView(state).value) {
        props.dispatch(loadAddressFields());
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

export const WaitForData: HandlerType = async props => {
    const checkData = () => {
        const state = props.getState();
        if (!getCurrentCountries(state)) {
            return false;
        }
        if (!getAddressFieldsDataView(state).value) {
            return false;
        }
        if (props.parameter.cartId) {
            const promotions = getPromotionsDataView(state, props.parameter.cartId);
            if (!promotions || promotions.isLoading) {
                return false;
            }
            const cartState = getCartState(state, props.parameter.cartId);
            if (!cartState || cartState.isLoading) {
                return false;
            }
        } else {
            const currentPromotions = getCurrentPromotionsDataView(state);
            if (!currentPromotions || currentPromotions.isLoading) {
                return false;
            }
            const currentCart = getCurrentCartState(state);
            if (!currentCart || currentCart.isLoading) {
                return false;
            }
        }

        return true;
    };

    await waitFor(checkData);
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess();
};

export const chain = [DispatchBeginPreloadingData, PreloadData, WaitForData, ExecuteOnSuccessCallback];

const preloadCheckoutShippingData = createHandlerChainRunner(chain, "PreloadCheckoutShippingData");
export default preloadCheckoutShippingData;
