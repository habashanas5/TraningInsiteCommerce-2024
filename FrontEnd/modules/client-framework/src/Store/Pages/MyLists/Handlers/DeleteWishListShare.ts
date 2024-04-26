import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnSuccess,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import {
    deleteWishListShare as deleteWishListShareApi,
    DeleteWishListShareApiParameter,
} from "@insite/client-framework/Services/WishListService";
import loadWishLists from "@insite/client-framework/Store/Pages/MyLists/Handlers/LoadWishLists";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    { wishList: WishListModel } & HasOnSuccess,
    DeleteWishListShareApiParameter
>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        wishListId: props.parameter.wishList.id,
    };
};

export const SendDataToApi: HandlerType = async props => {
    await deleteWishListShareApi(props.apiParameter);
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

export const DispatchLoadWishLists: HandlerType = props => {
    props.dispatch(loadWishLists());
};

export const chain = [
    PopulateApiParameter,
    SendDataToApi,
    ResetWishListsData,
    ExecuteOnSuccessCallback,
    DispatchLoadWishLists,
];

const deleteWishListShare = createHandlerChainRunner(chain, "DeleteWishListShare");
export default deleteWishListShare;
