import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { AddCartLinesApiParameter, addLineCollection } from "@insite/client-framework/Services/CartService";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import loadCurrentPromotions from "@insite/client-framework/Store/Data/Promotions/Handlers/LoadCurrentPromotions";
import { CartLineCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    {
        apiParameter: AddCartLinesApiParameter;
        onSuccess?: () => void;
    },
    AddCartLinesApiParameter,
    CartLineCollectionModel
>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = props.parameter.apiParameter;
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await addLineCollection(props.apiParameter);
};

export const LoadCart: HandlerType = props => {
    props.dispatch(loadCurrentCart());
};

export const LoadPromotions: HandlerType = props => {
    props.dispatch(loadCurrentPromotions());
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.();
};

export const chain = [PopulateApiParameter, RequestDataFromApi, LoadCart, LoadPromotions, ExecuteOnSuccessCallback];

export const addLinesToCart = createHandlerChainRunner(chain, "AddLinesToCart");
export default addLinesToCart;
