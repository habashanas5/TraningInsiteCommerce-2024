import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import CartState from "@insite/client-framework/Store/Pages/Cart/CartState";
import { Draft } from "immer";

const initialState: CartState = {
    isClearingCart: false,
    isSavingOrder: false,
    isRemovingCartLine: {},
    isUpdatingCartLine: false,
};

const reducer = {
    "Pages/Cart/BeginClearCart": (draft: Draft<CartState>) => {
        draft.isClearingCart = true;
    },
    "Pages/Cart/CompleteClearCart": (draft: Draft<CartState>) => {
        draft.isClearingCart = false;
    },
    "Pages/Cart/BeginRemoveCartLine": (draft: Draft<CartState>, action: { cartLineId: string }) => {
        draft.isRemovingCartLine[action.cartLineId] = true;
    },
    "Pages/Cart/CompleteRemoveCartLine": (draft: Draft<CartState>, action: { cartLineId: string }) => {
        delete draft.isRemovingCartLine[action.cartLineId];
    },
    "Pages/Cart/BeginSavingOrder": (draft: Draft<CartState>) => {
        draft.isSavingOrder = true;
    },
    "Pages/Cart/CompleteSavingOrder": (draft: Draft<CartState>) => {
        draft.isSavingOrder = false;
    },
    "Pages/Cart/BeginUpdateCartLine": (draft: Draft<CartState>) => {
        draft.isUpdatingCartLine = true;
    },
    "Pages/Cart/CompleteUpdateCartLine": (draft: Draft<CartState>) => {
        draft.isUpdatingCartLine = false;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
