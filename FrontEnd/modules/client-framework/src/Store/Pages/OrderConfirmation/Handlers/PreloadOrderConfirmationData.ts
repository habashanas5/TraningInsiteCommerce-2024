import waitFor from "@insite/client-framework/Common/Utilities/waitFor";
import { createHandlerChainRunner, Handler, HasOnError } from "@insite/client-framework/HandlerCreator";
import siteMessage from "@insite/client-framework/SiteMessage";
import { getCartState } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import loadCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCart";
import loadPromotions from "@insite/client-framework/Store/Data/Promotions/Handlers/LoadPromotions";
import { getPromotionsDataView } from "@insite/client-framework/Store/Data/Promotions/PromotionsSelectors";

type HandlerType = Handler<
    {
        cartId: string;
        onSuccess: () => void;
    } & HasOnError<string>
>;

export const DispatchBeginPreloadingData: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderConfirmation/BeginLoadCart",
        cartId: props.parameter.cartId,
    });
    props.dispatch({
        type: "Pages/OrderConfirmation/SetIsPreloadingData",
        isPreloadingData: true,
    });
};

export const DispatchBeginLoadCart: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderConfirmation/BeginLoadCart",
        cartId: props.parameter.cartId,
    });
};

export const PreloadData: HandlerType = props => {
    const state = props.getState();
    const cartState = getCartState(state, props.parameter.cartId);
    if (!cartState.value && !cartState.isLoading) {
        props.dispatch(loadCart({ cartId: props.parameter.cartId }));
    }
    const promotionsState = getPromotionsDataView(state, props.parameter.cartId);
    if (!promotionsState.value && !promotionsState.isLoading) {
        props.dispatch(loadPromotions({ cartId: props.parameter.cartId }));
    }
};

export const WaitForData: HandlerType = async props => {
    const checkData = () => {
        const state = props.getState();
        const cartState = getCartState(state, props.parameter.cartId);
        if (cartState.errorStatusCode === 404) {
            props.parameter.onError?.(siteMessage("Cart_CartNotFound") as string);
            return true;
        }
        if (cartState.errorStatusCode === 403) {
            props.parameter.onError?.(siteMessage("Forbidden") as string);
            return true;
        }
        if (!cartState.value) {
            return false;
        }
        const promotionsDataView = getPromotionsDataView(state, props.parameter.cartId);
        if (!promotionsDataView.value) {
            return false;
        }

        return true;
    };

    await waitFor(checkData);
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess();
};

export const chain = [
    DispatchBeginPreloadingData,
    DispatchBeginLoadCart,
    PreloadData,
    WaitForData,
    ExecuteOnSuccessCallback,
];

const preloadOrderConfirmationData = createHandlerChainRunner(chain, "PreloadOrderConfirmationData");
export default preloadOrderConfirmationData;
