import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getWishLists, GetWishListsApiParameter } from "@insite/client-framework/Services/WishListService";
import { WishListCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetWishListsApiParameter, WishListCollectionModel>;

export const DispatchBeginLoadWishLists: HandlerType = props => {
    props.dispatch({
        type: "Data/WishLists/BeginLoadWishLists",
        parameter: props.parameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getWishLists(props.apiParameter);
};

export const DispatchCompleteLoadWishLists: HandlerType = props => {
    props.dispatch({
        type: "Data/WishLists/CompleteLoadWishLists",
        result: props.apiResult,
        parameter: props.parameter,
    });
};

export const chain = [
    DispatchBeginLoadWishLists,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadWishLists,
];

const loadWishLists = createHandlerChainRunner(chain, "LoadWishLists");
export default loadWishLists;
