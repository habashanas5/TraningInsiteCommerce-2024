import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { GetWishListsApiParameter } from "@insite/client-framework/Services/WishListService";
import { getWishListLinesDataView } from "@insite/client-framework/Store/Data/WishListLines/WishListLinesSelectors";
import loadWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/LoadWishList";
import { getWishListState } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import loadWishListLines from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListLines";
import updateLoadWishListLinesParameter from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/UpdateLoadWishListLinesParameter";
import { OrderModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<{ wishListId: string }, GetWishListsApiParameter, OrderModel>;

export const DispatchSetWishListId: HandlerType = props => {
    props.dispatch({
        type: "Pages/MyListDetails/SetWishListId",
        wishListId: props.parameter.wishListId,
    });
};

export const DispatchLoadWishListIfNeeded: HandlerType = props => {
    const wishListState = getWishListState(props.getState(), props.parameter.wishListId);
    if (!wishListState.value || wishListState.value.schedule === undefined) {
        props.dispatch(
            loadWishList({
                wishListId: props.parameter.wishListId,
                exclude: ["listLines"],
                expand: ["schedule", "sharedUsers"],
            }),
        );
    }
};

export const DispatchLoadWishListLinesIfNeeded: HandlerType = props => {
    props.dispatch(
        updateLoadWishListLinesParameter({
            wishListId: props.parameter.wishListId,
            defaultPageSize: props.getState().context.settings.settingsCollection.wishListSettings.productsPerPage,
            query: "",
        }),
    );

    props.dispatch(loadWishListLines());
};

export const chain = [DispatchSetWishListId, DispatchLoadWishListIfNeeded, DispatchLoadWishListLinesIfNeeded];

const loadWishListIfNeeded = createHandlerChainRunner(chain, "LoadWishListIfNeeded");
export default loadWishListIfNeeded;
