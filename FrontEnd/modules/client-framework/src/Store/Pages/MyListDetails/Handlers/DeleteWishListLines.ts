import {
    createHandlerChainRunner,
    Handler,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { deleteWishListLines as deleteWishListLinesApi } from "@insite/client-framework/Services/WishListService";
import loadWishListLines from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListLines";

type HandlerType = Handler<{
    wishListId: string;
    wishListLineIds: string[];
    reloadWishListLines?: boolean;
    onSuccess?: () => void;
}>;

export const RequestRemoveWishListLine: HandlerType = async props => {
    await deleteWishListLinesApi({
        wishListId: props.parameter.wishListId,
        wishListLineIds: props.parameter.wishListLineIds,
    });
};

export const ResetWishListData: HandlerType = props => {
    props.dispatch({
        type: "Data/WishListLines/Reset",
    });
    props.dispatch({
        type: "Data/WishLists/Reset",
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.();
};

export const DispatchLoadWishLists: HandlerType = props => {
    if (props.parameter.reloadWishListLines) {
        props.dispatch(loadWishListLines());
    }
};

export const chain = [RequestRemoveWishListLine, ResetWishListData, ExecuteOnSuccessCallback, DispatchLoadWishLists];

const deleteWishListLines = createHandlerChainRunner(chain, "DeleteWishListLines");
export default deleteWishListLines;
