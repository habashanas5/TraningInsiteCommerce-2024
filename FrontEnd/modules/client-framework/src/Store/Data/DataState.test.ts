import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import {
    assignById,
    dataViewNotFound,
    DataViewState,
    getById,
    getDataView,
    getDataViewKey,
    getOrStoreCachedResult,
    idNotFound,
} from "@insite/client-framework/Store/Data/DataState";
import { WarehousesDataView } from "@insite/client-framework/Store/Data/Warehouses/WarehousesState";
import { WarehouseModel } from "@insite/client-framework/Types/ApiModels";
import RecursivePartial from "@insite/mobius/utilities/RecursivePartial";

describe("DataState", () => {
    describe("assignById function", () => {
        test("Should merge null values into existing value", () => {
            const testId = "6eb675c2-8aff-4a06-82c9-110ed62d35d8";
            const existingValue = {
                id: testId,
                value1: "value1",
                value2: "value2",
            };
            const expected = {
                id: testId,
                value1: null,
                value2: null,
            };

            const currentState = {
                byId: {
                    [testId]: existingValue,
                },
            } as any;
            const value = {
                id: testId,
                value1: null,
                value2: null,
            };

            assignById(currentState, value);
            const actual = currentState.byId[testId];

            expect(actual).toEqual(expected);
        });

        test("Should merge 'undefined' values into existing value", () => {
            const id = "6eb675c2-8aff-4a06-82c9-110ed62d35d8";
            const existingValue = {
                id,
                value1: "value1",
                value2: "value2",
            };
            const expected = {
                id,
                value1: undefined,
                value2: undefined,
            };

            const currentState = {
                byId: {
                    [id]: existingValue,
                },
            } as any;
            const value = {
                id,
                value1: undefined,
                value2: undefined,
            };
            assignById(currentState, value);
            const actual = currentState.byId[id];

            expect(actual).toEqual(expected);
        });
    });

    describe("getDataViewKey function", () => {
        test("should return a SORTED string of a valid parameter", () => {
            const testParameter = { id: 1, model: 2, a: 3, b: 4 };
            const expectedKey = "a=3&b=4&id=1&model=2";

            const key = getDataViewKey(testParameter);

            expect(key).toEqual(expectedKey);
        });

        test("Should return EMPTY_KEY if parameter is undefined", () => {
            const expectedKey = "EMPTY_KEY";

            const key = getDataViewKey();

            expect(key).toEqual(expectedKey);
        });
    });

    // comments for explaining the test order
    const testDate = new Date();
    const initializeState = () => {
        const returnState: RecursivePartial<ApplicationState> = {
            data: {
                accounts: {
                    isLoading: {},
                    byId: {
                        "testID-123465789": {
                            uri: "testID-123456789-uri",
                        },
                        "testID-987654321": {
                            uri: "testID-987654321-uri",
                        },
                    },
                    dataViews: {
                        "a=2&test=1": {
                            ids: ["testID-123465789", "testID-987654321"],
                            isLoading: false,
                            fetchedDate: testDate,
                            properties: {},
                        },
                    },
                },
            },
        };
        return returnState as ApplicationState;
    };
    const testDataViewState = initializeState();

    describe("getDataView function", () => {
        test("Should return dataViewNotFound Object if no dataview is returned from dataViewState", () => {
            const testParameter = { test: 1 };
            const noDataViewState = {
                dataViews: {},
            } as DataViewState<WarehouseModel, WarehousesDataView>;

            const notFoundDataView = getDataView(noDataViewState, testParameter);

            expect(notFoundDataView).toEqual(dataViewNotFound);
        });

        test("Should return valid dataview if passing a valid dataViewState", () => {
            const testParameter = { test: 1, a: 2 };

            const testDataView = getDataView(testDataViewState.data.accounts, testParameter) as any;

            expect(testDataView.isLoading).toEqual(false);
            expect(testDataView.fetchedDate).toEqual(testDate);
            expect(testDataView.value.length).toEqual(2);
        });
    });

    describe("getOrStoreCachedResult function", () => {
        test("Should return an object from createResult callback if the key does not exist in dataViewState", () => {
            const createResult = () => {
                return {
                    testProp1: 123456,
                    testProp2: "testData",
                    testProp3: ["name", "address"],
                };
            };
            const testParameter = { test: "notFoundKey" };
            const key = getDataViewKey(testParameter);

            const testResult = getOrStoreCachedResult(testDataViewState.data.accounts, key, createResult);

            expect(testResult).toEqual(createResult());
        });

        test("should return cached object if the key exist in dataViewState", () => {
            const testParameter = { test: 1, a: 2 };
            const key = getDataViewKey(testParameter);
            const expectedCachedValueFromInitializeState = {
                value: [{ uri: "testID-123456789-uri" }, { uri: "testID-987654321-uri" }],
                isLoading: false,
                fetchedDate: testDate,
                properties: {},
            };
            const createResult = () => {
                return {};
            };

            const testResult = getOrStoreCachedResult(testDataViewState.data.accounts, key, createResult);

            expect(testResult).toEqual(expectedCachedValueFromInitializeState);
        });
    });

    describe("getById function", () => {
        test("should return idNotFound object if id is undefined", () => {
            const testDataViewState = initializeState();

            const testResult = getById(testDataViewState.data.accounts, undefined);

            expect(testResult).toEqual(idNotFound);
        });

        test("should return an object with four properties if a valid id is passed", () => {
            const testId = "testID-12345689";
            const testDataViewState = initializeState();

            const testResult = getById(testDataViewState.data.accounts, testId);

            expect(Object.keys(testResult).length).toEqual(4);
            expect(testResult.id).toEqual(testId);
            expect(testResult.value).toEqual(undefined);
            expect(testResult.errorStatusCode).toEqual(undefined);
            expect(testResult.isLoading).toEqual(false);
        });
    });
});
