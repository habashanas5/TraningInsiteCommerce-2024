import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import loadWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/LoadWishList";
import { getWishListState } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";

type HandlerType = Handler<{ wishListId?: string; modalIsOpen: boolean; fromManage?: boolean }>;

export const LoadWishListIfNeeded: HandlerType = ({ parameter, getState, dispatch }) => {
    if (!parameter.modalIsOpen || !parameter.wishListId) {
        return;
    }

    const wishList = getWishListState(getState(), parameter.wishListId).value;
    if (typeof wishList?.sharedUsers !== "undefined") {
        return;
    }

    dispatch(
        loadWishList({
            wishListId: parameter.wishListId,
            exclude: ["listLines"],
            expand: ["sharedUsers"],
        }),
    );
};

export const DispatchCompleteSetIsOpen: HandlerType = props => {
    props.dispatch({
        type: "Components/ShareListModal/CompleteSetIsOpen",
        isOpen: props.parameter.modalIsOpen,
        wishListId: props.parameter.wishListId,
        fromManage: props.parameter.fromManage ?? false,
    });
};

export const chain = [LoadWishListIfNeeded, DispatchCompleteSetIsOpen];

const setShareListModalIsOpen = createHandlerChainRunner(chain, "SetShareListModalIsOpen");
export default setShareListModalIsOpen;
