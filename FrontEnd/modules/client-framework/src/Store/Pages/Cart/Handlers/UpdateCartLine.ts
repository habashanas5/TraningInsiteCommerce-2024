import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import {
    UpdateCartLineApiParameter,
    updateCartLineWithResult as updateCartLineApi,
} from "@insite/client-framework/Services/CartService";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import loadCurrentPromotions from "@insite/client-framework/Store/Data/Promotions/Handlers/LoadCurrentPromotions";
import { CartLineModel } from "@insite/client-framework/Types/ApiModels";

interface UpdateCartLineParameter {
    onSuccess?: () => void;
    cartLine: CartLineModel;
    shouldNotReloadPromotions?: boolean;
}

type HandlerType = ApiHandlerDiscreteParameter<UpdateCartLineParameter, UpdateCartLineApiParameter>;

export const DispatchBeginUpdateCartLine: HandlerType = props => {
    props.dispatch({
        type: "Pages/Cart/BeginUpdateCartLine",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        ...props.parameter,
        cartId: API_URL_CURRENT_FRAGMENT,
    };
};

export const UpdateCartLine: HandlerType = async props => {
    await updateCartLineApi(props.apiParameter);
};

export const LoadCart: HandlerType = props => {
    props.dispatch(loadCurrentCart());
};

export const LoadPromotions: HandlerType = props => {
    if (!props.parameter.shouldNotReloadPromotions) {
        props.dispatch(loadCurrentPromotions());
    }
};

export const DispatchCompleteUpdateCartLine: HandlerType = props => {
    props.dispatch({
        type: "Pages/Cart/CompleteUpdateCartLine",
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.();
};

export const chain = [
    DispatchBeginUpdateCartLine,
    PopulateApiParameter,
    UpdateCartLine,
    LoadCart,
    LoadPromotions,
    DispatchCompleteUpdateCartLine,
    ExecuteOnSuccessCallback,
];

const updateCartLine = createHandlerChainRunner(chain, "UpdateCartLine");
export default updateCartLine;
