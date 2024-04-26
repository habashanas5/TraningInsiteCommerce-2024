import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getBudgetCalendarsDataView } from "@insite/client-framework/Store/Data/BudgetCalendars/BudgetCalendarsSelectors";
import { DataView } from "@insite/client-framework/Store/Data/DataState";
import RecursivePartial from "@insite/mobius/utilities/RecursivePartial";

describe("getAddressFieldsDataView selector", () => {
    const date = new Date();
    const initializeState = () => {
        const returnState: RecursivePartial<ApplicationState> = {
            data: {
                budgetCalendars: {
                    dataViews: {
                        EMPTY_KEY: {
                            fetchedDate: date,
                            isLoading: false,
                            value: [
                                {
                                    budgetPeriods: [date],
                                    fiscalYear: 1,
                                    fiscalYearEndDate: date,
                                    uri: "text",
                                    properties: {
                                        key: "text",
                                    },
                                },
                            ],
                        },
                    },
                },
            },
        };
        return returnState as ApplicationState;
    };

    test("Dataview isLoading property is false", () => {
        const state = initializeState();

        const dataView = getBudgetCalendarsDataView(state);
        expect(dataView.isLoading).toBe(false);
    });

    test("DataView fetchedDate property is Date", () => {
        const state = initializeState();

        const dataView = getBudgetCalendarsDataView(state) as DataView;
        expect(dataView.fetchedDate).toBe(date);
    });

    test("Dataview value property", () => {
        const state = initializeState();

        const dataView = getBudgetCalendarsDataView(state);
        expect(Array.isArray(dataView.value)).toBe(true);
    });
});
