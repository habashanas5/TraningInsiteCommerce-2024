import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import SavedOrderDetailsState from "@insite/client-framework/Store/Pages/SavedOrderDetails/SavedOrderDetailsState";
import { Draft } from "immer";

const initialState: SavedOrderDetailsState = { isPlacingOrder: false, isDeletingOrder: false };

const reducer = {
    "Pages/SavedOrderDetails/BeginPlaceOrder": (draft: Draft<SavedOrderDetailsState>) => {
        draft.isPlacingOrder = true;
    },
    "Pages/SavedOrderDetails/CompletePlaceOrder": (draft: Draft<SavedOrderDetailsState>) => {
        draft.isPlacingOrder = false;
    },
    "Pages/SavedOrderDetails/BeginDeleteOrder": (draft: Draft<SavedOrderDetailsState>) => {
        draft.isDeletingOrder = true;
    },
    "Pages/SavedOrderDetails/CompleteDeleteOrder": (draft: Draft<SavedOrderDetailsState>) => {
        draft.isDeletingOrder = false;
    },
    "Pages/SavedOrderDetails/SetCartId": (draft: Draft<SavedOrderDetailsState>, action: { cartId: string }) => {
        draft.cartId = action.cartId;
    },
    "Pages/SavedOrderDetails/Reset": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
