import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import {
    deleteWishListShare,
    DeleteWishListShareApiParameter,
} from "@insite/client-framework/Services/WishListService";
import loadWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/LoadWishList";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = Handler<{ wishList: WishListModel; userId: string }>;

export const SendDataToApi: HandlerType = async props => {
    const apiParameter: DeleteWishListShareApiParameter = {
        wishListId: props.parameter.wishList.id,
        wishListShareId: props.parameter.userId,
    };

    await deleteWishListShare(apiParameter);
};

export const LoadWishList: HandlerType = props => {
    props.dispatch(
        loadWishList({
            wishListId: props.parameter.wishList.id,
            exclude: ["listLines"],
            expand: ["schedule", "sharedUsers"],
        }),
    );
};

export const chain = [SendDataToApi, LoadWishList];

const removeWishListShare = createHandlerChainRunner(chain, "RemoveWishListShare");
export default removeWishListShare;
