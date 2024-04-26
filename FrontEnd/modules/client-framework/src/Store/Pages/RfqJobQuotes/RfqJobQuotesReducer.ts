import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetJobQuotesApiParameter } from "@insite/client-framework/Services/JobQuoteService";
import RfqJobQuotesState from "@insite/client-framework/Store/Pages/RfqJobQuotes/RfqJobQuotesState";
import { UpdateSearchFieldsType } from "@insite/client-framework/Types/UpdateSearchFieldsType";
import { Draft } from "immer";

const initialState: RfqJobQuotesState = {
    getJobQuotesParameter: {},
};

const reducer = {
    "Pages/RfqJobQuotes/UpdateSearchFields": (
        draft: Draft<RfqJobQuotesState>,
        action: { parameter: GetJobQuotesApiParameter & UpdateSearchFieldsType },
    ) => {
        const { type } = action.parameter;
        delete action.parameter.type;
        if (type === "Replace") {
            draft.getJobQuotesParameter = action.parameter;
        } else if (type === "Initialize") {
            draft.getJobQuotesParameter = { ...initialState.getJobQuotesParameter, ...action.parameter };
        } else {
            draft.getJobQuotesParameter = { ...draft.getJobQuotesParameter, ...action.parameter };

            for (const key in draft.getJobQuotesParameter) {
                const value = (<any>draft.getJobQuotesParameter)[key];

                // remove empty parameters
                if (value === "" || value === undefined) {
                    delete (<any>draft.getJobQuotesParameter)[key];
                }
            }

            for (const key in action.parameter) {
                // go back to page 1 if any other parameters changed
                if (
                    draft.getJobQuotesParameter.page &&
                    draft.getJobQuotesParameter.page > 1 &&
                    key !== "page" &&
                    key !== "pageSize"
                ) {
                    draft.getJobQuotesParameter.page = 1;
                }
            }
        }
    },
    "Pages/RfqJobQuotes/ClearParameter": (draft: Draft<RfqJobQuotesState>, action: { isSalesPerson?: boolean }) => {
        draft.getJobQuotesParameter = {
            ...initialState.getJobQuotesParameter,
            pageSize: draft.getJobQuotesParameter.pageSize,
        };
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
