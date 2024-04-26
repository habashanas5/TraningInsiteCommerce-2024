import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { BudgetsState } from "@insite/client-framework/Store/Data/Budgets/BudgetsState";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import { BudgetModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: BudgetsState = {
    dataViews: {},
};

const reducer = {
    "Data/Budget/BeginLoadBudget": (draft: Draft<BudgetsState>, action: { parameter: object }) => {
        draft.dataViews[getDataViewKey(action.parameter)] = {
            isLoading: true,
            fetchedDate: new Date(),
        };
    },
    "Data/Budget/CompleteLoadBudget": (
        draft: Draft<BudgetsState>,
        action: { parameter: object; model: BudgetModel },
    ) => {
        const dataView = {
            isLoading: false,
            value: action.model,
            fetchedDate: new Date(),
        };

        draft.dataViews[getDataViewKey(action.parameter)] = dataView;
    },
    "Data/Budget/CompleteUpdateBudget": (draft: Draft<BudgetsState>) => {
        draft.dataViews = initialState.dataViews;
    },
    "Pages/BudgetManagement/CompleteSaveBudgetConfiguration": (draft: Draft<BudgetsState>) => {
        draft.dataViews = initialState.dataViews;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
