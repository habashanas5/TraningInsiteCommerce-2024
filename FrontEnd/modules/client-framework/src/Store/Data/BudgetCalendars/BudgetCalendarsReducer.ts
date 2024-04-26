import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { BudgetCalendarsState } from "@insite/client-framework/Store/Data/BudgetCalendars/BudgetCalendarsState";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import { BudgetCalendarCollectionModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: BudgetCalendarsState = {
    dataViews: {},
};

const reducer = {
    "Data/Budget/BeginLoadBudgetCalendarCollection": (
        draft: Draft<BudgetCalendarsState>,
        action: { parameter: object },
    ) => {
        draft.dataViews[getDataViewKey(action.parameter)] = {
            isLoading: true,
            fetchedDate: new Date(),
        };
    },
    "Data/Budget/CompleteLoadBudgetCalendarCollection": (
        draft: Draft<BudgetCalendarsState>,
        action: { parameter: object; collection: BudgetCalendarCollectionModel },
    ) => {
        const dataView = {
            isLoading: false,
            value: action.collection.budgetCalendarCollection!,
            fetchedDate: new Date(),
        };

        draft.dataViews[getDataViewKey(action.parameter)] = dataView;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
