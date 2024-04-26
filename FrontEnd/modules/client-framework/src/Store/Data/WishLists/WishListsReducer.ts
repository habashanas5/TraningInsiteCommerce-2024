import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import {
    GetWishListLinesApiParameter,
    GetWishListsApiParameter,
} from "@insite/client-framework/Services/WishListService";
import { assignById, setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { WishListsState } from "@insite/client-framework/Store/Data/WishLists/WishListsState";
import {
    WishListCollectionModel,
    WishListLineCollectionModel,
    WishListModel,
} from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: WishListsState = {
    isLoading: {},
    byId: {},
    dataViews: {},
    errorStatusCodeById: {},
};

const reducer = {
    "Data/WishLists/BeginLoadWishLists": (
        draft: Draft<WishListsState>,
        action: { parameter: GetWishListsApiParameter },
    ) => {
        setDataViewLoading(draft, action.parameter);
    },
    "Data/WishLists/CompleteLoadWishLists": (
        draft: Draft<WishListsState>,
        action: { parameter: GetWishListsApiParameter; result: WishListCollectionModel },
    ) => {
        setDataViewLoaded(draft, action.parameter, action.result, collection => collection.wishListCollection!);
    },
    "Data/WishLists/BeginLoadWishList": (draft: Draft<WishListsState>, action: { wishListId: string }) => {
        draft.isLoading[action.wishListId] = true;
    },
    "Data/WishLists/CompleteLoadWishList": (draft: Draft<WishListsState>, action: { wishList: WishListModel }) => {
        delete draft.isLoading[action.wishList.id];
        assignById(draft, action.wishList);
        if (draft.errorStatusCodeById) {
            delete draft.errorStatusCodeById[action.wishList.id];
        }
    },
    "Data/WishLists/FailedToLoadWishList": (
        draft: Draft<WishListsState>,
        action: { wishListId: string; status: number },
    ) => {
        delete draft.isLoading[action.wishListId];
        if (draft.errorStatusCodeById) {
            draft.errorStatusCodeById[action.wishListId] = action.status;
        }
    },
    "Data/WishLists/Reset": () => {
        return initialState;
    },
    "Data/WishLists/ResetDataViews": (draft: Draft<WishListsState>) => {
        draft.dataViews = {};
    },
    "Data/WishLists/CompleteLoadWishListLines": (
        draft: Draft<WishListsState>,
        action: { parameter: GetWishListLinesApiParameter; result: WishListLineCollectionModel },
    ) => {
        if (!draft.byId[action.parameter.wishListId]) {
            return;
        }
        draft.byId[action.parameter.wishListId].wishListLineCollection = action.result.wishListLines;
        if (action.result.pagination) {
            draft.byId[action.parameter.wishListId].wishListLinesCount = action.result.pagination.totalItemCount;
        }
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
