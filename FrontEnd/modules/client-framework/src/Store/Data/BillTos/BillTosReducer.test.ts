import { GetBillTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import BillTosReducer from "@insite/client-framework/Store/Data/BillTos/BillTosReducer";
import { BillTosState } from "@insite/client-framework/Store/Data/BillTos/BillTosState";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import { BillToCollectionModel, BillToModel } from "@insite/client-framework/Types/ApiModels";

describe("BillTosReducer", () => {
    const mockBillToModel1 = returnBillToModel("testID-1", "test");
    const mockBillToModel2 = returnBillToModel("testID-2", "test2");
    const mockUpdateBillToModel1 = returnBillToModel("testID-1", "updateTest");
    const parameter: GetBillTosApiParameter = {
        expand: ["shipTos"],
        additionalExpands: ["testExpand"],
        filter: "testFilter",
    };
    const collection: BillToCollectionModel = {
        uri: "testURI",
        properties: {},
        billTos: [mockBillToModel1, mockBillToModel2],
        pagination: null,
    };
    const key = getDataViewKey(parameter);
    let initialState: BillTosState;
    beforeEach(() => {
        initialState = {
            isLoading: {},
            byId: {},
            dataViews: {},
        };
    });

    test("state object with dataViews.isLoading true", () => {
        const type = "Data/BillTos/BeginLoadBillTos";
        const action = {
            type,
            parameter,
        } as any;
        const expectedState = new ExpectedState(initialState).setStateDataViewLoading(parameter).getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = BillTosReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toEqual(true);
        expect(actualState).toEqual(expectedState);
    });

    test("State object with a loaded dataViews property", () => {
        const type = "Data/BillTos/CompleteLoadBillTos";
        const action = {
            type,
            parameter,
            collection,
        } as any;
        const valueNames = "billTos";
        const expectedState = new ExpectedState(initialState)
            .setStateDataViewLoaded(parameter, collection, valueNames)
            .getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = BillTosReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState).toEqual(expectedState);
    });

    test("isLoading property whose id value is true", () => {
        const type = "Data/BillTos/BeginLoadBillTo";
        const id = "testID";
        const action = {
            type,
            id,
        } as any;

        const actualState = BillTosReducer(undefined, action);

        expect(actualState.isLoading["testID"]).toEqual(true);
    });

    test("byId property containing a BillToModel", () => {
        const type = "Data/BillTos/CompleteLoadBillTo";
        const id = "testID-1";
        const action = {
            type,
            id,
            model: mockBillToModel1,
        } as any;
        const expectedState = new ExpectedState(initialState).addById(mockBillToModel1).getState();

        const actualState = BillTosReducer(undefined, action);
        expect(actualState.byId[id]).toEqual(mockBillToModel1);
        expect(actualState).toEqual(expectedState);
    });

    test("update BillToModel in byId property", () => {
        const type = "Data/BillTos/CompleteUpdateBillTo";
        const id = "testID-1";
        const action = {
            type,
            id,
            model: mockUpdateBillToModel1,
        } as any;
        const mockState = new ExpectedState(initialState).addById(mockBillToModel1).getState();
        const expectedState = new ExpectedState(mockState).addById(mockUpdateBillToModel1).getState();

        const actualState = BillTosReducer(mockState, action);

        expect(actualState).toEqual(expectedState);
    });

    test("Reset returns initial state", () => {
        const type = "Data/BillTos/Reset";
        const action = {
            type,
        } as any;

        const actualState = BillTosReducer(undefined, action);

        expect(actualState).toEqual(initialState);
    });
});

function returnBillToModel(id: string, str: string): BillToModel {
    return {
        uri: "testURI",
        properties: {},
        accountsReceivable: null,
        address1: str,
        address2: str,
        address3: str,
        address4: str,
        attention: str,
        budgetEnforcementLevel: str,
        city: str,
        companyName: str,
        contactFullName: str,
        costCodes: null,
        costCodeTitle: str,
        country: null,
        customerCurrencySymbol: str,
        customerName: str,
        customerNumber: str,
        customerSequence: str,
        email: "test@optimizely.com",
        fax: str,
        firstName: str,
        fullAddress: str,
        id,
        isDefault: true,
        isGuest: true,
        label: str,
        lastName: str,
        phone: str,
        postalCode: str,
        shipTos: null,
        shipTosUri: str,
        state: null,
        validation: null,
    };
}
