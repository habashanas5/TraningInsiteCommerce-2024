import isApiError from "@insite/client-framework/Common/isApiError";
import {
    createHandlerChainRunner,
    HandlerWithResult,
    HasOnError,
    HasOnSuccess,
    markSkipOnCompleteIfOnErrorIsSet,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { activateInvite as activateInviteApi } from "@insite/client-framework/Services/WishListService";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = HandlerWithResult<
    {
        invite: string;
    } & HasOnSuccess<WishListModel> &
        HasOnError<string>,
    {
        wishList?: WishListModel;
        errorMessage?: string;
    }
>;

export const RequestActivateInvite: HandlerType = async props => {
    props.result = {};
    try {
        props.result.wishList = await activateInviteApi({ invite: props.parameter.invite });
    } catch (error) {
        if (error.status === 404) {
            props.result.errorMessage = error.errorMessage;
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
    if (props.result.wishList) {
        markSkipOnCompleteIfOnSuccessIsSet(props);
        props.parameter.onSuccess?.(props.result.wishList);
    }
};

export const ExecuteOnErrorCallback: HandlerType = props => {
    if (props.result.errorMessage) {
        markSkipOnCompleteIfOnErrorIsSet(props);
        props.parameter.onError?.(props.result.errorMessage);
    }
};

export const chain = [RequestActivateInvite, ResetWishListsData, ExecuteOnSuccessCallback, ExecuteOnErrorCallback];

const activateInvite = createHandlerChainRunner(chain, "ActivateInvite");
export default activateInvite;
