import { createHandlerChainRunnerOptionalParameter, Handler } from "@insite/client-framework/HandlerCreator";
import loadWishListsData from "@insite/client-framework/Store/Data/WishLists/Handlers/LoadWishLists";

type HandlerType = Handler;

export const wishListsParameter = {
    filter: "availableToAdd",
    pageSize: 999,
};

export const DispatchLoadWishLists: HandlerType = props => {
    props.dispatch(loadWishListsData(wishListsParameter));
};

export const chain = [DispatchLoadWishLists];

const loadWishLists = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadWishLists");
export default loadWishLists;
