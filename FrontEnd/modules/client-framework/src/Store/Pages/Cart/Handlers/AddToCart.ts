import throwErrorIfTesting from "@insite/client-framework/Common/ThrowErrorIfTesting";
import {
    ApiHandler,
    createHandlerChainRunner,
    HasOnSuccess,
    makeHandlerChainAwaitable,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { AddProductApiParameter, addProductWithResult } from "@insite/client-framework/Services/CartService";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import loadCurrentPromotions from "@insite/client-framework/Store/Data/Promotions/Handlers/LoadCurrentPromotions";
import { CartLineModel } from "@insite/client-framework/Types/ApiModels";

type AddToCartParameter = {
    onError?: (error: string) => void;
} & AddProductApiParameter &
    HasOnSuccess<CartLineModel>;

type HandlerType = ApiHandler<AddToCartParameter, CartLineModel>;

export const PopulateApiParameter: HandlerType = props => {
    throwErrorIfTesting();

    props.apiParameter = props.parameter;
};

export const DispatchBeginAddingProductToCart: HandlerType = props => {
    props.dispatch({
        type: "Context/BeginAddingProductToCart",
    });
};

export const SendDataToApi: HandlerType = async props => {
    const result = await addProductWithResult(props.apiParameter);
    if (result.successful) {
        props.apiResult = result.result;
    } else {
        if (result.statusCode === 403) {
            const { isAuthenticated, rememberMe } = props.getState().context.session;
            (isAuthenticated || rememberMe) && window.location.reload();
            return false;
        }

        props.parameter.onError?.(result.errorMessage);
        return false;
    }
};

export const DispatchCompleteAddingProductToCart: HandlerType = props => {
    props.dispatch({
        type: "Context/CompleteAddingProductToCart",
    });
};

export const LoadCart: HandlerType = async props => {
    const awaitableLoadCurrentCart = makeHandlerChainAwaitable(loadCurrentCart);
    await awaitableLoadCurrentCart({})(props.dispatch, props.getState);
};

export const LoadPromotions: HandlerType = props => {
    props.dispatch(loadCurrentPromotions());
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.(props.apiResult);
};

export const chain = [
    PopulateApiParameter,
    DispatchBeginAddingProductToCart,
    SendDataToApi,
    LoadCart,
    LoadPromotions,
    DispatchCompleteAddingProductToCart,
    ExecuteOnSuccessCallback,
];

const addToCart = createHandlerChainRunner(chain, "AddToCart");
export default addToCart;
