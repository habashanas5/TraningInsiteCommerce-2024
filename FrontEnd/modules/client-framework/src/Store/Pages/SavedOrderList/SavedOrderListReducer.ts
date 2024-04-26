import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetCartsApiParameter } from "@insite/client-framework/Services/CartService";
import SavedOrderListState from "@insite/client-framework/Store/Pages/SavedOrderList/SavedOrderListState";
import { UpdateSearchFieldsType } from "@insite/client-framework/Types/UpdateSearchFieldsType";
import { Draft } from "immer";

const initialState: SavedOrderListState = {
    isFilterOpen: true,
    getCartsApiParameter: {
        sort: "OrderDate DESC",
        status: "Saved",
    },
};

const reducer = {
    "Pages/SavedOrderList/ClearParameter": (draft: Draft<SavedOrderListState>) => {
        draft.getCartsApiParameter = {
            ...initialState.getCartsApiParameter,
            pageSize: draft.getCartsApiParameter.pageSize,
        };
    },
    "Pages/SavedOrderList/ToggleFiltersOpen": (draft: Draft<SavedOrderListState>) => {
        draft.isFilterOpen = !draft.isFilterOpen;
    },
    "Pages/SavedOrderList/UpdateSearchFields": (
        draft: Draft<SavedOrderListState>,
        action: {
            parameter: GetCartsApiParameter & UpdateSearchFieldsType;
        },
    ) => {
        const { type } = action.parameter;
        delete action.parameter.type;
        if (type === "Replace") {
            draft.getCartsApiParameter = action.parameter;
        } else if (type === "Initialize") {
            draft.getCartsApiParameter = { ...initialState.getCartsApiParameter, ...action.parameter };
        } else {
            draft.getCartsApiParameter = { ...draft.getCartsApiParameter, ...action.parameter };

            for (const key in draft.getCartsApiParameter) {
                const value = (<any>draft.getCartsApiParameter)[key];

                // remove empty parameters
                if (value === "" || value === undefined) {
                    delete (<any>draft.getCartsApiParameter)[key];
                }
            }

            for (const key in action.parameter) {
                // go back to page 1 if any other parameters changed
                if (
                    draft.getCartsApiParameter.page &&
                    draft.getCartsApiParameter.page > 1 &&
                    key !== "page" &&
                    key !== "pageSize"
                ) {
                    draft.getCartsApiParameter.page = 1;
                }
            }
        }
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
