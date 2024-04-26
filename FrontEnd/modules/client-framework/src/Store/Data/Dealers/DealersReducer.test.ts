import { GetDealersApiParameter } from "@insite/client-framework/Services/DealerService";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import DealersReducer from "@insite/client-framework/Store/Data/Dealers/DealersReducer";
import { DealersState } from "@insite/client-framework/Store/Data/Dealers/DealersState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import { DealerCollectionModel, DealerModel } from "@insite/client-framework/Types/ApiModels";

describe("DealersReducer", () => {
    const mockDealerModel = returnDealerModel();
    const parameter: GetDealersApiParameter = {
        name: "testName",
        latitude: 1,
        longitude: 1,
    };
    const key = getDataViewKey(parameter);
    const collection: DealerCollectionModel = {
        uri: "testURI",
        properties: {},
        dealers: [mockDealerModel],
        defaultLatitude: 1,
        defaultLongitude: 1,
        defaultRadius: 1,
        distanceUnitOfMeasure: "test",
        formattedAddress: "test",
        pagination: null,
        startDealerNumber: 1,
    };
    const extraData = {
        defaultLatitude: collection.defaultLatitude,
        defaultLongitude: collection.defaultLongitude,
        defaultRadius: collection.defaultRadius,
        distanceUnitOfMeasure: collection.distanceUnitOfMeasure,
    };
    let initialState: DealersState;
    beforeEach(() => {
        initialState = {
            isLoading: {},
            byId: {},
            dataViews: {},
            defaultLocation: {
                latitude: 0,
                longitude: 0,
            },
        };
    });

    test("dataViews property whose isLoading is true", () => {
        const type = "Data/Dealers/BeginLoadDealers";
        const action = {
            type,
            parameter,
        } as any;
        const expectedState = new ExpectedState(initialState).setStateDataViewLoading(parameter).getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = DealersReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("state object with a loaded dataViews property", () => {
        const type = "Data/Dealers/CompleteLoadDealers";
        const action = {
            type,
            parameter,
            collection,
        } as any;
        const value = { latitude: collection.defaultLatitude, longitude: collection.defaultLongitude };
        const expectedState = new ExpectedState(initialState)
            .setState("defaultLocation", value)
            .setStateDataViewLoaded(parameter, collection, "dealers", undefined, extraData)
            .getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = DealersReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews).toBeTruthy();
        expect(actualState).toEqual(expectedState);
    });

    test("isLoading property whose id value is true", () => {
        const type = "Data/Dealers/BeginLoadDealer";
        const action = {
            type,
            id: "testID",
        } as any;
        const expectedState = new ExpectedState(initialState).addIsLoading(action.id).getState();

        const actualState = DealersReducer(undefined, action);

        expect(actualState.isLoading[action.id]).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("byId property should contain a dealerModel", () => {
        const type = "Data/Dealers/CompleteLoadDealer";
        const action = {
            type,
            model: mockDealerModel,
        } as any;
        const expectedState = new ExpectedState(initialState).addById(action.model).getState();

        const actualState = DealersReducer(undefined, action);

        expect(actualState.byId[mockDealerModel.id]).toEqual(mockDealerModel);
        expect(actualState).toEqual(expectedState);
    });

    test("Reset return initialState", () => {
        const type = "Data/Dealers/Reset";
        const action = {
            type,
        } as any;

        const actualState = DealersReducer(undefined, action);

        expect(actualState).toEqual(initialState);
    });
});

function returnDealerModel(): DealerModel {
    return {
        uri: "testURI",
        properties: {},
        address1: "test",
        address2: "test",
        city: "test",
        countryId: "test",
        distance: 1,
        distanceUnitOfMeasure: "test",
        htmlContent: "test",
        id: "testID",
        latitude: 1,
        longitude: 1,
        name: "test",
        phone: "test",
        postalCode: "test",
        state: "test",
        webSiteUrl: "test",
    };
}
