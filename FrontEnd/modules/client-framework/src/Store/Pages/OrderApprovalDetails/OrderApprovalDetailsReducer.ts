import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import OrderApprovalDetailsState from "@insite/client-framework/Store/Pages/OrderApprovalDetails/OrderApprovalDetailsState";
import { Draft } from "immer";

const initialState: OrderApprovalDetailsState = {
    isApproving: false,
    isDeleting: false,
};

const reducer = {
    "Pages/OrderApprovalDetails/SetCartId": (draft: Draft<OrderApprovalDetailsState>, action: { cartId: string }) => {
        draft.cartId = action.cartId;
    },

    "Pages/OrderApprovalDetails/BeginApproveOrder": (draft: Draft<OrderApprovalDetailsState>) => {
        draft.isApproving = true;
    },
    "Pages/OrderApprovalDetails/CompleteApproveOrder": (draft: Draft<OrderApprovalDetailsState>) => {
        draft.isApproving = false;
    },
    "Pages/OrderApprovalDetails/BeginDeleteOrder": (draft: Draft<OrderApprovalDetailsState>) => {
        draft.isDeleting = true;
    },
    "Pages/OrderApprovalDetails/CompleteDeleteOrder": (draft: Draft<OrderApprovalDetailsState>) => {
        draft.isDeleting = false;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
