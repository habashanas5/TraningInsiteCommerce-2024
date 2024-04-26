import {
    createHandlerChainRunner,
    HandlerWithResult,
    HasOnSuccess,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { updateWishListLine as updateWishListLineApi } from "@insite/client-framework/Services/WishListService";
import loadWishListLines from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListLines";
import { WishListLineModel } from "@insite/client-framework/Types/ApiModels";

export interface UpdateWishListLineResult {
    wishListLine?: WishListLineModel;
    errorMessage?: string;
}

type HandlerType = HandlerWithResult<
    {
        wishListId: string;
        wishListLineId: string;
        wishListLine: WishListLineModel;
        reloadWishListLines?: boolean;
        skipResettingData?: boolean;
    } & HasOnSuccess,
    UpdateWishListLineResult
>;

export const DispatchBeginLoadWishListLinesIfNeeded: HandlerType = props => {
    if (props.parameter.reloadWishListLines) {
        const dataViewParameter = props.getState().pages.myListDetails.loadWishListLinesParameter;
        props.dispatch({
            type: "Data/WishListLines/BeginLoadWishListLines",
            parameter: dataViewParameter,
        });
    }
};

export const RequestUpdateWishListLine: HandlerType = async props => {
    const wishListLine = await updateWishListLineApi({
        wishListId: props.parameter.wishListId,
        wishListLineId: props.parameter.wishListLineId,
        wishListLine: props.parameter.wishListLine,
    });
    props.result = { wishListLine };
};

export const ResetWishListsData: HandlerType = props => {
    if (!props.parameter.skipResettingData) {
        props.dispatch({
            type: "Data/WishListLines/Reset",
        });
        props.dispatch({
            type: "Data/WishLists/Reset",
        });
    }
};

export const DispatchUpdateWishListLine: HandlerType = props => {
    if (props.result.wishListLine) {
        props.dispatch({
            type: "Data/WishListLines/UpdateWishListLine",
            model: props.result.wishListLine,
        });
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.();
};

export const DispatchLoadWishListLines: HandlerType = props => {
    if (props.parameter.reloadWishListLines) {
        props.dispatch(loadWishListLines());
    }
};

export const chain = [
    DispatchBeginLoadWishListLinesIfNeeded,
    RequestUpdateWishListLine,
    ResetWishListsData,
    DispatchUpdateWishListLine,
    ExecuteOnSuccessCallback,
    DispatchLoadWishListLines,
];

const updateWishListLine = createHandlerChainRunner(chain, "UpdateWishListLine");
export default updateWishListLine;
