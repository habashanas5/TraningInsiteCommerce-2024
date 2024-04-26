import {
    createHandlerChainRunner,
    Handler,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { deleteWishList as deleteWishListApi } from "@insite/client-framework/Services/WishListService";

type HandlerType = Handler<{ wishListId: string; onSuccess?: () => void }, {}>;

export const RequestRemoveWishlist: HandlerType = async props => {
    await deleteWishListApi({ wishListId: props.parameter.wishListId });
};

export const ResetWishListsData: HandlerType = props => {
    props.dispatch({
        type: "Data/WishLists/Reset",
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.();
};

export const chain = [RequestRemoveWishlist, ResetWishListsData, ExecuteOnSuccessCallback];

const deleteWishList = createHandlerChainRunner(chain, "DeleteWishList");
export default deleteWishList;
