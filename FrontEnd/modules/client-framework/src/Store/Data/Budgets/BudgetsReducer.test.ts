import BudgetsReducer from "@insite/client-framework/Store/Data/Budgets/BudgetsReducer";
import { BudgetsState } from "@insite/client-framework/Store/Data/Budgets/BudgetsState";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import { BudgetModel } from "@insite/client-framework/Types/ApiModels";

describe("BudgetReducer", () => {
    const mockBudgetModel = returnBudgetModel();
    const parameter: object = {
        testParameter: "budget",
    };
    const key = getDataViewKey(parameter);
    let initialState: BudgetsState;
    beforeEach(() => {
        initialState = {
            dataViews: {},
        };
    });

    test("dataViews property whose isLoading is true", () => {
        const type = "Data/Budget/BeginLoadBudget";
        const action = {
            type,
            parameter,
        } as any;

        const expectedState = new ExpectedState(initialState).addDataViewIsLoading(parameter).getState();
        delete expectedState.dataViews[key].pagination;

        const actualState = BudgetsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toEqual(true);
        expect(actualState).toEqual(expectedState);
    });

    test("dataViews property should contain value property which is an array of budegetCalendarModel", () => {
        const type = "Data/Budget/CompleteLoadBudget";
        const action = {
            type,
            parameter,
            model: mockBudgetModel,
        } as any;
        const valueNames = ["model"];
        const expectedState = new ExpectedState(initialState)
            .addDataViewWithValue(parameter, action, valueNames)
            .getState();
        delete expectedState.dataViews[key].pagination;

        const actualState = BudgetsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].value).toEqual(mockBudgetModel);
        expect(actualState).toEqual(expectedState);
    });

    test("state object with dataViews which equals to initialState.dataViews", () => {
        const type = "Data/Budget/CompleteUpdateBudget";
        const action = {
            type,
        } as any;
        const expectedState = new ExpectedState(initialState).getState();
        expectedState.dataViews = initialState.dataViews;

        const actualState = BudgetsReducer(undefined, action) as any;

        expect(actualState.dataViews).toEqual(expectedState.dataViews);
        expect(actualState).toEqual(expectedState);
    });

    test("state object with dataViews which equals to initialState.dataViews", () => {
        const type = "Pages/BudgetManagement/CompleteSaveBudgetConfiguration";
        const action = {
            type,
        } as any;
        const expectedState = new ExpectedState(initialState).getState();
        expectedState.dataViews = initialState.dataViews;

        const actualState = BudgetsReducer(undefined, action) as any;

        expect(actualState.dataViews).toEqual(expectedState.dataViews);
        expect(actualState).toEqual(expectedState);
    });
});

function returnBudgetModel(): BudgetModel {
    return {
        uri: "testURI",
        properties: {},
        budgetLineCollection: null,
        fiscalYear: 2021,
        fiscalYearEndDate: null,
        shipToId: "test",
        userProfileId: "test",
    };
}
