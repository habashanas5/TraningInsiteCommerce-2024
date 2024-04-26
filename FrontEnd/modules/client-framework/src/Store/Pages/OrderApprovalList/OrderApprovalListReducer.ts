import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetOrderApprovalsApiParameter } from "@insite/client-framework/Services/OrderApprovalService";
import OrderApprovalListState from "@insite/client-framework/Store/Pages/OrderApprovalList/OrderApprovalListState";
import { UpdateSearchFieldsType } from "@insite/client-framework/Types/UpdateSearchFieldsType";

import { Draft } from "immer";

const initialState: OrderApprovalListState = {
    filtersOpen: false,
    getOrderApprovalsParameter: {},
};

const reducer = {
    "Pages/OrderApprovalList/ClearParameter": (draft: Draft<OrderApprovalListState>) => {
        draft.getOrderApprovalsParameter = {
            ...initialState.getOrderApprovalsParameter,
            pageSize: draft.getOrderApprovalsParameter.pageSize,
        };
    },
    "Pages/OrderApprovalList/ToggleFiltersOpen": (draft: Draft<OrderApprovalListState>) => {
        draft.filtersOpen = !draft.filtersOpen;
    },
    "Pages/OrderApprovalList/UpdateSearchFields": (
        draft: Draft<OrderApprovalListState>,
        action: {
            parameter: GetOrderApprovalsApiParameter & UpdateSearchFieldsType;
        },
    ) => {
        const { type } = action.parameter;
        delete action.parameter.type;
        if (type === "Replace") {
            draft.getOrderApprovalsParameter = action.parameter;
        } else if (type === "Initialize") {
            draft.getOrderApprovalsParameter = { ...initialState.getOrderApprovalsParameter, ...action.parameter };
        } else {
            draft.getOrderApprovalsParameter = { ...draft.getOrderApprovalsParameter, ...action.parameter };

            for (const key in draft.getOrderApprovalsParameter) {
                const value = (<any>draft.getOrderApprovalsParameter)[key];

                // remove empty parameters
                if (value === "" || value === undefined) {
                    delete (<any>draft.getOrderApprovalsParameter)[key];
                }
            }

            for (const key in action.parameter) {
                // go back to page 1 if any other parameters changed
                if (
                    draft.getOrderApprovalsParameter.page &&
                    draft.getOrderApprovalsParameter.page > 1 &&
                    key !== "page" &&
                    key !== "pageSize"
                ) {
                    draft.getOrderApprovalsParameter.page = 1;
                }
            }
        }
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
