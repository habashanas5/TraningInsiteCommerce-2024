import {
    createHandlerChainRunner,
    HandlerWithResult,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { updateWishListSchedule as updateWishListScheduleApi } from "@insite/client-framework/Services/WishListService";
import loadWishList from "@insite/client-framework/Store/Data/WishLists/Handlers/LoadWishList";
import { WishListEmailScheduleModel, WishListModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = HandlerWithResult<
    {
        wishListId: string;
        schedule: WishListEmailScheduleModel | null;
        onSuccess?: () => void;
    },
    {
        wishList?: WishListModel;
    }
>;

export const RequestDataFromApi: HandlerType = async props => {
    const wishList = await updateWishListScheduleApi({
        wishList: {
            id: props.parameter.wishListId,
            schedule: props.parameter.schedule,
        } as WishListModel,
    });
    props.result = { wishList };
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

export const LoadWishList: HandlerType = props => {
    if (props.result.wishList) {
        props.dispatch(
            loadWishList({
                wishListId: props.result.wishList.id,
                exclude: ["listLines"],
                expand: ["schedule", "sharedUsers"],
            }),
        );
    }
};

export const chain = [RequestDataFromApi, ResetWishListsData, ExecuteOnSuccessCallback, LoadWishList];

const updateWishListSchedule = createHandlerChainRunner(chain, "UpdateWishListSchedule");
export default updateWishListSchedule;
