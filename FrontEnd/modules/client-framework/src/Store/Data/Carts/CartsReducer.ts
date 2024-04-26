import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { Cart, CartCollectionResult, GetCartsApiParameter } from "@insite/client-framework/Services/CartService";
import { CartsState } from "@insite/client-framework/Store/Data/Carts/CartsState";
import { assignById, setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { CartCollectionModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: CartsState = {
    isLoading: {},
    byId: {},
    dataViews: {},
    errorStatusCodeById: {},
};

const reducer = {
    "Data/Carts/BeginLoadCart": (draft: Draft<CartsState>, action: { id: string }) => {
        draft.isLoading[action.id] = true;
    },

    "Data/Carts/CompleteLoadCart": (
        draft: Draft<CartsState>,
        action: { model: Cart; isCurrent?: boolean; replaceCart?: boolean },
    ) => {
        draft.cartLoadedTime = Date.now();
        if (action.isCurrent) {
            delete draft.isLoading[API_URL_CURRENT_FRAGMENT];
            draft.currentId = action.model.id;
        } else {
            delete draft.isLoading[action.model.id];
        }

        if (action.replaceCart) {
            draft.byId[action.model.id] = action.model;
        } else {
            assignById(draft, action.model);
        }
    },

    "Data/Carts/ResetCurrentCartId": (draft: Draft<CartsState>, action: { cartId: string }) => {
        draft.currentId = action.cartId;
    },

    "Data/Carts/Reset": () => {
        return initialState;
    },

    "Data/Carts/ResetCart": (draft: Draft<CartsState>, action: { id: string }) => {
        delete draft.byId[action.id];
        draft.dataViews = {};
    },

    "Data/Carts/FailedToLoadCart": (draft: Draft<CartsState>, action: { cartId: string; status: number }) => {
        delete draft.isLoading[action.cartId];
        if (draft.errorStatusCodeById) {
            draft.errorStatusCodeById[action.cartId] = action.status;
        }
    },

    "Data/Carts/BeginLoadCarts": (draft: Draft<CartsState>, action: { parameter: GetCartsApiParameter }) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/Carts/CompleteLoadCarts": (
        draft: Draft<CartsState>,
        action: { parameter: GetCartsApiParameter; collection: CartCollectionResult },
    ) => {
        setDataViewLoaded(draft, action.parameter, action.collection, collection => collection.carts!);
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
