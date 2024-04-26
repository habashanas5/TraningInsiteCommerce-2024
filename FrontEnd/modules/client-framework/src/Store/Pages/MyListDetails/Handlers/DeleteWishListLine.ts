import {
    createHandlerChainRunner,
    Handler,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { deleteWishListLine as deleteWishListLineApi } from "@insite/client-framework/Services/WishListService";
import loadWishListLines from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListLines";
import setAllWishListLinesIsSelected from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/SetAllWishListLinesIsSelected";

type HandlerType = Handler<{
    wishListId: string;
    wishListLineId: string;
    reloadWishListLines?: boolean;
    onSuccess?: () => void;
}>;

export const RequestRemoveWishListLine: HandlerType = async props => {
    await deleteWishListLineApi({
        wishListId: props.parameter.wishListId,
        wishListLineId: props.parameter.wishListLineId,
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

export const DispatchSetAllWishListLinesIsSelected: HandlerType = props => {
    props.dispatch(setAllWishListLinesIsSelected({ isSelected: false }));
};

export const DispatchLoadWishListLines: HandlerType = props => {
    if (props.parameter.reloadWishListLines) {
        props.dispatch(loadWishListLines());
    }
};

export const chain = [
    RequestRemoveWishListLine,
    ResetWishListData,
    ExecuteOnSuccessCallback,
    DispatchSetAllWishListLinesIsSelected,
    DispatchLoadWishListLines,
];

const deleteWishListLine = createHandlerChainRunner(chain, "DeleteWishListLine");
export default deleteWishListLine;
