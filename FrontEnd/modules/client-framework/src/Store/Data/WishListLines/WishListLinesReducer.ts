import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetWishListLinesApiParameter } from "@insite/client-framework/Services/WishListService";
import { assignById, setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { WishListLinesState } from "@insite/client-framework/Store/Data/WishListLines/WishListLinesState";
import { WishListLineCollectionModel, WishListLineModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: WishListLinesState = {
    isLoading: {},
    byId: {},
    dataViews: {},
};

const reducer = {
    "Data/WishListLines/BeginLoadWishListLines": (
        draft: Draft<WishListLinesState>,
        action: { parameter: GetWishListLinesApiParameter },
    ) => {
        setDataViewLoading(draft, action.parameter);
    },
    "Data/WishListLines/CompleteLoadWishListLines": (
        draft: Draft<WishListLinesState>,
        action: { parameter: GetWishListLinesApiParameter; result: WishListLineCollectionModel },
    ) => {
        setDataViewLoaded(draft, action.parameter, action.result, collection => collection.wishListLines!);
    },
    "Data/WishListLines/Reset": () => {
        return initialState;
    },
    "Data/WishListLines/UpdateWishListLine": (
        draft: Draft<WishListLinesState>,
        action: { model: WishListLineModel },
    ) => {
        assignById(draft, action.model);
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
