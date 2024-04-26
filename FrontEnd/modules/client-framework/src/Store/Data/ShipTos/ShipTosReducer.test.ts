import { GetShipTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import ShipTosReducer from "@insite/client-framework/Store/Data/ShipTos/ShipTosReducer";
import { ShipTosState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosState";
import { ShipToCollectionModel, ShipToModel } from "@insite/client-framework/Types/ApiModels";

describe("ShipTosReducer", () => {
    const mockShipToModel = returnShipToModel();
    const parameter: GetShipTosApiParameter = {};
    const key = getDataViewKey(parameter);
    const collection: ShipToCollectionModel = {
        uri: "testURI",
        properties: {},
        pagination: null,
        shipTos: [mockShipToModel],
    };
    let initialState: ShipTosState;
    beforeEach(() => {
        initialState = {
            isLoading: {},
            byId: {},
            dataViews: {},
        };
    });

    test("dataViews property has isLoading property whose value is true", () => {
        const type = "Data/ShipTos/BeginLoadShipTos";
        const action = {
            type,
            parameter,
        } as any;
        const expectedState = new ExpectedState(initialState).setStateDataViewLoading(parameter).getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = ShipTosReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("state object should contain a loaded dataViews property", () => {
        const type = "Data/ShipTos/CompleteLoadShipTos";
        const action = {
            type,
            parameter,
            collection,
        } as any;
        const expectedState = new ExpectedState(initialState)
            .setStateDataViewLoaded(parameter, collection, "shipTos")
            .getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = ShipTosReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews).toBeTruthy();
        expect(actualState).toEqual(expectedState);
    });

    test("isLoading property should contain id property whose value is true", () => {
        const type = "Data/ShipTos/BeginLoadShipTo";
        const action = {
            type,
            id: "testID",
        } as any;
        const expectedState = new ExpectedState(initialState).addIsLoading(action.id).getState();

        const actualState = ShipTosReducer(undefined, action);

        expect(actualState.isLoading[action.id]).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("byId property should contain a ShipToModel", () => {
        const type = "Data/ShipTos/CompleteLoadShipTo";
        const action = {
            type,
            model: mockShipToModel,
        } as any;
        const expectedState = new ExpectedState(initialState).addById(action.model).getState();

        const actualState = ShipTosReducer(undefined, action);

        expect(actualState.byId[mockShipToModel.id]).toEqual(mockShipToModel);
        expect(actualState).toEqual(expectedState);
    });

    test("State object should have an empty dataViews property", () => {
        const type = "Data/ShipTos/ResetDataViews";
        const action = {
            type,
        } as any;

        const actualState = ShipTosReducer(undefined, action);

        expect(actualState.dataViews).toEqual({});
    });

    test("Reset should return initialState", () => {
        const type = "Data/ShipTos/Reset";
        const action = {
            type,
        } as any;

        const actualState = ShipTosReducer(undefined, action);

        expect(actualState).toEqual(initialState);
    });
});

function returnShipToModel(): ShipToModel {
    return {
        uri: "testURI",
        properties: {},
        address1: "test",
        address2: "test",
        address3: "test",
        address4: "test",
        attention: "test",
        city: "test",
        companyName: "test",
        contactFullName: "test",
        country: null,
        customerName: "test",
        customerNumber: "test",
        customerSequence: "test",
        email: "test",
        fax: "test",
        firstName: "test",
        fullAddress: "test",
        id: "test",
        isDefault: false,
        isNew: false,
        isVmiLocation: false,
        label: "test",
        lastName: "test",
        oneTimeAddress: false,
        phone: "test",
        postalCode: "test",
        state: null,
        validation: null,
    };
}
