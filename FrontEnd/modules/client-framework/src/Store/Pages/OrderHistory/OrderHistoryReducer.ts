import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetOrdersApiParameter } from "@insite/client-framework/Services/OrderService";
import OrderHistoryState from "@insite/client-framework/Store/Pages/OrderHistory/OrderHistoryState";
import { UpdateSearchFieldsType } from "@insite/client-framework/Types/UpdateSearchFieldsType";
import { Draft } from "immer";

const initialState: OrderHistoryState = {
    isReordering: {},
    getOrdersParameter: {
        customerSequence: "-1",
    },
    filtersOpen: false,
};

const reducer = {
    "Pages/OrderHistory/UpdateSearchFields": (
        draft: Draft<OrderHistoryState>,
        action: { parameter: GetOrdersApiParameter & UpdateSearchFieldsType },
    ) => {
        const { type } = action.parameter;
        delete action.parameter.type;
        if (type === "Replace") {
            draft.getOrdersParameter = action.parameter;
        } else if (type === "Initialize") {
            draft.getOrdersParameter = { ...initialState.getOrdersParameter, ...action.parameter };
        } else {
            draft.getOrdersParameter = { ...draft.getOrdersParameter, ...action.parameter };

            for (const key in draft.getOrdersParameter) {
                const value = (<any>draft.getOrdersParameter)[key];

                // remove empty parameters
                if (value === "" || value === undefined) {
                    delete (<any>draft.getOrdersParameter)[key];
                }
            }

            for (const key in action.parameter) {
                // go back to page 1 if any other parameters changed
                if (
                    draft.getOrdersParameter.page &&
                    draft.getOrdersParameter.page > 1 &&
                    key !== "page" &&
                    key !== "pageSize"
                ) {
                    draft.getOrdersParameter.page = 1;
                }
            }
        }
    },
    "Pages/OrderHistory/ClearParameter": (draft: Draft<OrderHistoryState>) => {
        draft.getOrdersParameter = { ...initialState.getOrdersParameter, pageSize: draft.getOrdersParameter.pageSize };
    },
    "Pages/OrderHistory/BeginReorder": (draft: Draft<OrderHistoryState>, action: { orderNumber: string }) => {
        draft.isReordering[action.orderNumber] = true;
    },
    "Pages/OrderHistory/CompleteReorder": (draft: Draft<OrderHistoryState>, action: { orderNumber: string }) => {
        delete draft.isReordering[action.orderNumber];
    },
    "Pages/OrderHistory/ToggleFiltersOpen": (draft: Draft<OrderHistoryState>) => {
        draft.filtersOpen = !draft.filtersOpen;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
