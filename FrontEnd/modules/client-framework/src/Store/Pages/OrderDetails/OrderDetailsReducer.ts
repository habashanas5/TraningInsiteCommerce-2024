import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import OrderDetailsState from "@insite/client-framework/Store/Pages/OrderDetails/OrderDetailsState";
import { CartLineCollectionModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: OrderDetailsState = {
    isReordering: false,
    isCanceling: false,
};

const reducer = {
    "Pages/OrderDetails/SetOrderNumber": (draft: Draft<OrderDetailsState>, action: { orderNumber: string }) => {
        draft.orderNumber = action.orderNumber;
    },
    "Pages/OrderDetails/BeginReorder": (draft: Draft<OrderDetailsState>) => {
        draft.isReordering = true;
    },
    "Pages/OrderDetails/CompleteReorder": (
        draft: Draft<OrderDetailsState>,
        action: { cartLineCollection: CartLineCollectionModel },
    ) => {
        draft.isReordering = false;
    },
    "Pages/OrderDetails/BeginCancelOrder": (draft: Draft<OrderDetailsState>) => {
        draft.isCanceling = true;
    },
    "Pages/OrderDetails/CompleteCancelOrder": (draft: Draft<OrderDetailsState>) => {
        draft.isCanceling = false;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
