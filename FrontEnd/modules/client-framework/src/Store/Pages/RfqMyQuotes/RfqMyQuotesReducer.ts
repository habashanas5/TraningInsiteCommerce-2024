import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetQuotesApiParameter } from "@insite/client-framework/Services/QuoteService";
import RfqMyQuotesState from "@insite/client-framework/Store/Pages/RfqMyQuotes/RfqMyQuotesState";
import { UpdateSearchFieldsType } from "@insite/client-framework/Types/UpdateSearchFieldsType";
import { Draft } from "immer";

const initialState: RfqMyQuotesState = {
    getQuotesParameter: {},
    filtersOpen: false,
};

const reducer = {
    "Pages/RfqMyQuotes/UpdateSearchFields": (
        draft: Draft<RfqMyQuotesState>,
        action: { parameter: GetQuotesApiParameter & UpdateSearchFieldsType },
    ) => {
        const { type } = action.parameter;
        delete action.parameter.type;
        if (type === "Replace") {
            draft.getQuotesParameter = action.parameter;
        } else if (type === "Initialize") {
            draft.getQuotesParameter = { ...initialState.getQuotesParameter, ...action.parameter };
        } else {
            draft.getQuotesParameter = { ...draft.getQuotesParameter, ...action.parameter };

            for (const key in draft.getQuotesParameter) {
                const value = (<any>draft.getQuotesParameter)[key];

                // remove empty parameters
                if (value === "" || value === undefined) {
                    delete (<any>draft.getQuotesParameter)[key];
                }
            }

            for (const key in action.parameter) {
                // go back to page 1 if any other parameters changed
                if (
                    draft.getQuotesParameter.page &&
                    draft.getQuotesParameter.page > 1 &&
                    key !== "page" &&
                    key !== "pageSize"
                ) {
                    draft.getQuotesParameter.page = 1;
                }
            }
        }
    },
    "Pages/RfqMyQuotes/ClearParameter": (draft: Draft<RfqMyQuotesState>, action: { isSalesPerson?: boolean }) => {
        draft.getQuotesParameter = {
            ...initialState.getQuotesParameter,
            expand: action.isSalesPerson ? ["salesList"] : undefined,
            pageSize: draft.getQuotesParameter.pageSize,
        };
    },
    "Pages/RfqMyQuotes/ToggleFiltersOpen": (draft: Draft<RfqMyQuotesState>) => {
        draft.filtersOpen = !draft.filtersOpen;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
