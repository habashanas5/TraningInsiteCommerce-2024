import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnError,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import { CartCollectionResult, getCarts, GetCartsApiParameter } from "@insite/client-framework/Services/CartService";

type GetCartsParameter = {
    apiParameter: GetCartsApiParameter;
} & HasOnSuccess &
    HasOnError<string>;

type HandlerType = ApiHandlerDiscreteParameter<GetCartsParameter, GetCartsApiParameter, CartCollectionResult>;

export const DispatchBeginLoadOrders: HandlerType = props => {
    props.dispatch({
        type: "Data/Carts/BeginLoadCarts",
        parameter: props.parameter.apiParameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter.apiParameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    const apiResult = await getCarts(props.apiParameter);
    if (apiResult.successful) {
        props.apiResult = apiResult.result;
    } else {
        props.parameter.onError?.(apiResult.errorMessage);
    }
};

export const DispatchCompleteLoadOrders: HandlerType = props => {
    props.dispatch({
        type: "Data/Carts/CompleteLoadCarts",
        collection: props.apiResult,
        parameter: props.apiParameter,
    });
};

export const chain = [DispatchBeginLoadOrders, PopulateApiParameter, RequestDataFromApi, DispatchCompleteLoadOrders];

const loadCarts = createHandlerChainRunner(chain, "LoadCarts");
export default loadCarts;
