import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetInvoicesApiParameter } from "@insite/client-framework/Services/InvoiceService";
import InvoiceHistoryState from "@insite/client-framework/Store/Pages/InvoiceHistory/InvoiceHistoryState";
import { UpdateSearchFieldsType } from "@insite/client-framework/Types/UpdateSearchFieldsType";
import { Draft } from "immer";

const initialState: InvoiceHistoryState = {
    getInvoicesParameter: {
        customerSequence: "-1",
    },
    filtersOpen: false,
};

const reducer = {
    "Pages/InvoiceHistory/UpdateSearchFields": (
        draft: Draft<InvoiceHistoryState>,
        action: { parameter: GetInvoicesApiParameter & UpdateSearchFieldsType },
    ) => {
        const { type } = action.parameter;
        delete action.parameter.type;
        if (type === "Replace") {
            draft.getInvoicesParameter = action.parameter;
        } else if (type === "Initialize") {
            draft.getInvoicesParameter = { ...initialState.getInvoicesParameter, ...action.parameter };
        } else {
            draft.getInvoicesParameter = { ...draft.getInvoicesParameter, ...action.parameter };

            for (const key in draft.getInvoicesParameter) {
                const value = (<any>draft.getInvoicesParameter)[key];

                // remove empty parameters
                if (value === "" || value === undefined) {
                    delete (<any>draft.getInvoicesParameter)[key];
                }
            }

            for (const key in action.parameter) {
                // go back to page 1 if any other parameters changed
                if (
                    draft.getInvoicesParameter.page &&
                    draft.getInvoicesParameter.page > 1 &&
                    key !== "page" &&
                    key !== "pageSize"
                ) {
                    draft.getInvoicesParameter.page = 1;
                }
            }
        }
    },
    "Pages/InvoiceHistory/ClearParameter": (draft: Draft<InvoiceHistoryState>) => {
        draft.getInvoicesParameter = {
            ...initialState.getInvoicesParameter,
            pageSize: draft.getInvoicesParameter.pageSize,
        };
    },
    "Pages/InvoiceHistory/ToggleFiltersOpen": (draft: Draft<InvoiceHistoryState>) => {
        draft.filtersOpen = !draft.filtersOpen;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
