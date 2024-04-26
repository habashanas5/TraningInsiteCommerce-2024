import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import {
    RemoveCartLineApiParameter,
    removeCartLineWithResult as removeCartLineApi,
} from "@insite/client-framework/Services/CartService";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import loadCurrentPromotions from "@insite/client-framework/Store/Data/Promotions/Handlers/LoadCurrentPromotions";

type HandlerType = ApiHandlerDiscreteParameter<
    {
        cartLineId: string;
    },
    RemoveCartLineApiParameter
>;

export const DispatchBeginRemoveCartLine: HandlerType = props => {
    props.dispatch({
        type: "Pages/Cart/BeginRemoveCartLine",
        cartLineId: props.parameter.cartLineId,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        cartLineId: props.parameter.cartLineId,
        cartId: API_URL_CURRENT_FRAGMENT,
    };
};

export const RemoveCartLine: HandlerType = async props => {
    await removeCartLineApi(props.apiParameter);
};

export const LoadCart: HandlerType = props => {
    props.dispatch(loadCurrentCart());
};

export const LoadPromotions: HandlerType = props => {
    props.dispatch(loadCurrentPromotions());
};

export const DispatchCompleteRemoveCartLine: HandlerType = props => {
    props.dispatch({
        type: "Pages/Cart/CompleteRemoveCartLine",
        cartLineId: props.parameter.cartLineId,
    });
};

export const chain = [
    DispatchBeginRemoveCartLine,
    PopulateApiParameter,
    RemoveCartLine,
    LoadCart,
    LoadPromotions,
    DispatchCompleteRemoveCartLine,
];

const removeCartLine = createHandlerChainRunner(chain, "RemoveCartLine");
export default removeCartLine;
