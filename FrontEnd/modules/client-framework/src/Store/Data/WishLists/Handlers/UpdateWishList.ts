import isApiError from "@insite/client-framework/Common/isApiError";
import {
    createHandlerChainRunner,
    HandlerWithResult,
    markSkipOnCompleteIfOnErrorIsSet,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import {
    updateWishList as updateWishListApi,
    UpdateWishListApiParameter,
} from "@insite/client-framework/Services/WishListService";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";

export interface UpdateWishListResult {
    wishList?: WishListModel;
    errorMessage?: string;
}

type HandlerType = HandlerWithResult<
    {
        apiParameter: UpdateWishListApiParameter;
        onSuccess?: () => void;
        onError?: (errorMessage: string) => void;
    },
    UpdateWishListResult
>;

export const DispatchBeginUpdateWishList: HandlerType = props => {
    const wishListId = props.parameter.apiParameter.wishListId || props.parameter.apiParameter.wishList?.id;
    if (!wishListId) {
        return false;
    }

    props.result = {};
    props.dispatch({
        type: "Data/WishLists/BeginLoadWishList",
        wishListId,
    });
};

export const CallUpdateWishListApi: HandlerType = async props => {
    try {
        props.result.wishList = await updateWishListApi(props.parameter.apiParameter);
    } catch (error) {
        if (isApiError(error) && error.status === 400) {
            props.result.errorMessage = error.errorJson.message;
            return;
        }
        throw error;
    }
};

export const ResetWishListsData: HandlerType = props => {
    if (props.result.errorMessage) {
        return;
    }

    props.dispatch({
        type: "Data/WishLists/Reset",
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    if (props.result.wishList) {
        markSkipOnCompleteIfOnSuccessIsSet(props);
        props.parameter.onSuccess?.();
    }
};

export const ExecuteOnErrorCallback: HandlerType = props => {
    if (props.result.errorMessage) {
        markSkipOnCompleteIfOnErrorIsSet(props);
        props.parameter.onError?.(props.result.errorMessage);
    }
};

export const DispatchCompleteUpdateWishList: HandlerType = props => {
    if (props.result.wishList) {
        props.dispatch({
            wishList: props.result.wishList,
            type: "Data/WishLists/CompleteLoadWishList",
        });
    }
};

export const chain = [
    DispatchBeginUpdateWishList,
    CallUpdateWishListApi,
    ResetWishListsData,
    ExecuteOnSuccessCallback,
    ExecuteOnErrorCallback,
    DispatchCompleteUpdateWishList,
];

const updateWishList = createHandlerChainRunner(chain, "UpdateWishList");
export default updateWishList;
