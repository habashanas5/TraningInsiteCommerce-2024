import { GetAddressFieldsApiParameter } from "@insite/client-framework/Services/WebsiteService";
import AddressFieldsReducer from "@insite/client-framework/Store/Data/AddressFields/AddressFieldsReducer";
import { AddressFieldsState } from "@insite/client-framework/Store/Data/AddressFields/AddressFieldsState";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import {
    AddressFieldCollectionModel,
    AddressFieldDisplayCollectionModel,
} from "@insite/client-framework/Types/ApiModels";

describe("AddressFieldsReducer", () => {
    const mockShipToAddressFieldsModel = returnShipToAddressFieldsModel();
    const mockBillToAddressFieldsModel = returnBillToAddressFieldsModel();
    const parameter: GetAddressFieldsApiParameter = {
        additionalExpands: ["testExpand"],
    };
    const key = getDataViewKey(parameter);
    const collection: AddressFieldCollectionModel = {
        uri: "testURI",
        properties: {},
        shipToAddressFields: mockShipToAddressFieldsModel,
        billToAddressFields: mockBillToAddressFieldsModel,
    };
    let initialState: AddressFieldsState;
    beforeEach(() => {
        initialState = {
            dataViews: {},
        };
    });

    test("state object with dataViews.isLoading true", () => {
        const type = "Data/AddressFields/BeginLoadAddressFields";
        const action = {
            type,
            parameter,
        } as any;
        const expectedState = new ExpectedState(initialState).addDataViewIsLoading(parameter).getState();
        delete expectedState.dataViews[key].pagination;

        const actualState = AddressFieldsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toEqual(true);
        expect(actualState).toEqual(expectedState);
    });

    test("State object with a loaded dataViews property", () => {
        const type = "Data/AddressFields/CompleteLoadAddressFields";
        const action = {
            type,
            parameter,
            collection,
        } as any;
        const valueNames = ["shipToAddressFields", "billToAddressFields"];
        const expectedState = new ExpectedState(initialState)
            .addDataViewWithValue(parameter, collection, valueNames)
            .getState();
        delete expectedState.dataViews[key].pagination;

        const actualState = AddressFieldsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(Object.keys(actualState.dataViews[key])).toEqual(Object.keys(expectedState.dataViews[key]));
        expect(actualState.dataViews[key].isLoading).toEqual(false);
        expect(actualState.dataViews[key].value).toEqual(expectedState.dataViews[key].value);
        expect(actualState).toEqual(expectedState);
    });

    test("Reset returns initial state", () => {
        const type = "Data/AddressFields/Reset";
        const action = {
            type,
        } as any;

        const actualState = AddressFieldsReducer(undefined, action);

        expect(actualState).toEqual(initialState);
    });
});

function returnShipToAddressFieldsModel(): AddressFieldDisplayCollectionModel {
    return {
        uri: "testURI",
        properties: {},
        address1: {
            uri: "testURI",
            properties: {},
            displayName: "testShipToAddress",
            isVisible: true,
        },
        address2: null,
        address3: null,
        address4: null,
        attention: null,
        city: null,
        companyName: null,
        contactFullName: null,
        country: null,
        email: null,
        fax: null,
        firstName: null,
        lastName: null,
        phone: null,
        postalCode: null,
        state: null,
    };
}

function returnBillToAddressFieldsModel(): AddressFieldDisplayCollectionModel {
    return {
        uri: "testURI",
        properties: {},
        address1: {
            uri: "testURI",
            properties: {},
            displayName: "testBillToAddress",
            isVisible: true,
        },
        address2: null,
        address3: null,
        address4: null,
        attention: null,
        city: null,
        companyName: null,
        contactFullName: null,
        country: null,
        email: null,
        fax: null,
        firstName: null,
        lastName: null,
        phone: null,
        postalCode: null,
        state: null,
    };
}
