import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { getWishList, GetWishListApiParameter } from "@insite/client-framework/Services/WishListService";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";

export interface LoadWishListResult {
    apiResult: WishListModel;
}

type HandlerType = Handler<GetWishListApiParameter, LoadWishListResult>;

export const DispatchBeginLoadWishList: HandlerType = props => {
    props.dispatch({
        type: "Data/WishLists/BeginLoadWishList",
        wishListId: props.parameter.wishListId,
    });
};

export const RequestDataFromApi: HandlerType = async props => {
    try {
        props.apiResult = await getWishList(props.parameter);
    } catch (error) {
        if ("status" in error && error.status === 404) {
            props.dispatch({
                type: "Data/WishLists/FailedToLoadWishList",
                wishListId: props.parameter.wishListId,
                status: 404,
            });
            return false;
        }
        throw error;
    }
};

export const DispatchCompleteLoadWishList: HandlerType = ({ dispatch, apiResult }) => {
    dispatch({
        type: "Data/WishLists/CompleteLoadWishList",
        wishList: apiResult,
    });
};

export const chain = [DispatchBeginLoadWishList, RequestDataFromApi, DispatchCompleteLoadWishList];

const loadWishList = createHandlerChainRunner(chain, "LoadWishList");
export default loadWishList;
