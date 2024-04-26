import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetPagesByParentApiParameter } from "@insite/client-framework/Services/ContentService";
import NewsListState from "@insite/client-framework/Store/Pages/NewsList/NewsListState";
import { Draft } from "immer";

const initialState: NewsListState = {
    getNewsPagesParameters: {},
};

const reducer = {
    "Pages/NewsList/UpdateLoadParameter": (
        draft: Draft<NewsListState>,
        { parameter }: { parameter: GetPagesByParentApiParameter },
    ) => {
        let existingParameter = draft.getNewsPagesParameters[parameter.parentNodeId];
        if (!existingParameter) {
            existingParameter = {
                parentNodeId: parameter.parentNodeId,
            };
        }

        existingParameter = { ...existingParameter, ...parameter };
        draft.getNewsPagesParameters[parameter.parentNodeId] = existingParameter;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
