import isApiError from "@insite/client-framework/Common/isApiError";
import {
    createHandlerChainRunner,
    HandlerWithResult,
    markSkipOnCompleteIfOnErrorIsSet,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import {
    addWishList as addWishListApi,
    AddWishListApiParameter,
} from "@insite/client-framework/Services/WishListService";
import loadWishLists from "@insite/client-framework/Store/Pages/MyLists/Handlers/LoadWishLists";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";

export interface AddWishListResult {
    wishListModel?: WishListModel;
    errorMessage?: string;
}

type HandlerType = HandlerWithResult<
    {
        apiParameter: AddWishListApiParameter;
        reloadWishLists?: boolean;
        onSuccess?: (addedWishList: WishListModel) => void;
        onError?: (errorMessage: string) => void;
    },
    AddWishListResult
>;

export const DispatchBeginAddWishList: HandlerType = props => {
    props.result = {};
    props.dispatch({
        type: "Pages/MyLists/BeginAddWishList",
    });
};

export const CallAddWishListApi: HandlerType = async props => {
    try {
        props.result.wishListModel = await addWishListApi(props.parameter.apiParameter);
    } catch (error) {
        if (isApiError(error) && error.status === 400) {
            props.result.errorMessage = error.errorJson.message;
            return;
        }
        throw error;
    }
};

export const ResetWishListsData: HandlerType = props => {
    props.dispatch({
        type: "Data/WishLists/Reset",
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    if (!props.result.errorMessage && props.result.wishListModel && props.parameter.onSuccess) {
        markSkipOnCompleteIfOnSuccessIsSet(props);
        props.parameter.onSuccess(props.result.wishListModel);
    }
};

export const ExecuteOnErrorCallback: HandlerType = props => {
    if (props.result.errorMessage) {
        markSkipOnCompleteIfOnErrorIsSet(props);
        props.parameter.onError?.(props.result.errorMessage);
    }
};

export const DispatchCompleteAddWishList: HandlerType = props => {
    props.dispatch({
        type: "Pages/MyLists/CompleteAddWishList",
        result: props.result,
    });
};

export const DispatchLoadWishLists: HandlerType = props => {
    if (!props.result.errorMessage && props.result.wishListModel && props.parameter.reloadWishLists) {
        props.dispatch(loadWishLists());
    }
};

export const chain = [
    DispatchBeginAddWishList,
    CallAddWishListApi,
    ResetWishListsData,
    ExecuteOnSuccessCallback,
    ExecuteOnErrorCallback,
    DispatchCompleteAddWishList,
    DispatchLoadWishLists,
];

const addWishList = createHandlerChainRunner(chain, "AddWishList");
export default addWishList;
