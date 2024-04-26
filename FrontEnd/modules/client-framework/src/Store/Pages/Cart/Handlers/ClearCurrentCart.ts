import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { clearCart, ClearCartApiParameter } from "@insite/client-framework/Services/CartService";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import loadCurrentPromotions from "@insite/client-framework/Store/Data/Promotions/Handlers/LoadCurrentPromotions";

type HandlerType = Handler<
    {
        /**
         * @deprecated this is not supported. It is here to prevent build errors because previously it could be passed in without causing a failure.
         */
        cartId?: string;
    },
    {
        apiParameter: ClearCartApiParameter;
    }
>;

export const DispatchBeginRemoveCart: HandlerType = props => {
    props.dispatch({
        type: "Pages/Cart/BeginClearCart",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        cartId: API_URL_CURRENT_FRAGMENT,
    };
};

export const CallClearCart: HandlerType = props => clearCart(props.apiParameter);

export const LoadCart: HandlerType = props => {
    props.dispatch(
        loadCurrentCart({
            onSuccess: () => {
                props.dispatch({
                    type: "Pages/Cart/CompleteClearCart",
                });
            },
        }),
    );
};

export const LoadPromotions: HandlerType = props => {
    props.dispatch(loadCurrentPromotions());
};

export const chain = [DispatchBeginRemoveCart, PopulateApiParameter, CallClearCart, LoadCart, LoadPromotions];

const clearCurrentCart = createHandlerChainRunnerOptionalParameter(chain, {}, "ClearCurrentCart");
export default clearCurrentCart;
