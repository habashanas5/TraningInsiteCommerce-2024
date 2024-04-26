import BudgetCalendarsReducer from "@insite/client-framework/Store/Data/BudgetCalendars/BudgetCalendarsReducer";
import { BudgetCalendarsState } from "@insite/client-framework/Store/Data/BudgetCalendars/BudgetCalendarsState";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import { BudgetCalendarCollectionModel, BudgetCalendarModel } from "@insite/client-framework/Types/ApiModels";

describe("BudgetCalendarsReducer", () => {
    const mockBudgetCalendarModel = returnBudgetCalendarModel();
    const parameter: object = {
        testParameter: "budgetCalendars",
    };
    const key = getDataViewKey(parameter);
    const collection: BudgetCalendarCollectionModel = {
        uri: "testURI",
        properties: {},
        budgetCalendarCollection: [mockBudgetCalendarModel],
    };
    let initialState: BudgetCalendarsState;
    beforeEach(() => {
        initialState = {
            dataViews: {},
        };
    });

    test("dataViews property whose isLoading is true", () => {
        const type = "Data/Budget/BeginLoadBudgetCalendarCollection";
        const action = {
            type,
            parameter,
        } as any;

        const expectedState = new ExpectedState(initialState).addDataViewIsLoading(parameter).getState();
        delete expectedState.dataViews[key].pagination;

        const actualState = BudgetCalendarsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toEqual(true);
        expect(actualState).toEqual(expectedState);
    });

    test("dataViews property should contain value property which is an array of budegetCalendarModel", () => {
        const type = "Data/Budget/CompleteLoadBudgetCalendarCollection";
        const action = {
            type,
            parameter,
            collection,
        } as any;
        const valueNames = ["budgetCalendarCollection"];
        const expectedState = new ExpectedState(initialState)
            .addDataViewWithValue(parameter, collection, valueNames)
            .getState();
        delete expectedState.dataViews[key].pagination;

        const actualState = BudgetCalendarsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].value).toEqual(collection.budgetCalendarCollection);
        expect(actualState).toEqual(expectedState);
    });
});

function returnBudgetCalendarModel(): BudgetCalendarModel {
    return {
        uri: "testURI",
        properties: {},
        budgetPeriods: null,
        fiscalYear: 2021,
        fiscalYearEndDate: null,
    };
}
