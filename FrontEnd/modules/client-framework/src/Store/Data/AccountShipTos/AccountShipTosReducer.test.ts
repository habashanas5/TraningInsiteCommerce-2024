import AccountShipTosReducer from "@insite/client-framework/Store/Data/AccountShipTos/AccountShipTosReducer";
import { AccountShipTosState } from "@insite/client-framework/Store/Data/AccountShipTos/AccountShipTosState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import {
    AccountShipToCollectionModel,
    AccountShipToModel,
    CustomerCostCodeDto,
} from "@insite/client-framework/Types/ApiModels";

describe("AccountShipTos Reducer", () => {
    const mockCostCodeCollection = returnCustomerCostCodeDto();
    const mockUserShipToCollection = returnAccountShipToModel();
    const parameter = { testPara: "test" };
    const collection: AccountShipToCollectionModel = {
        uri: "testURI",
        properties: {},
        costCodeCollection: [mockCostCodeCollection],
        userShipToCollection: [mockUserShipToCollection],
        pagination: null,
    };
    let initialState: AccountShipTosState;
    beforeEach(() => {
        initialState = {
            dataViews: {},
        };
    });

    test("state object with dataViews.isLoading true", () => {
        const type = "Data/AccountShipTos/BeginLoadAccountShipToCollection";
        const action = {
            type,
            parameter,
        } as any;

        const expectedState = new ExpectedState(initialState).addDataViewIsLoading(parameter).getState();

        const actualState = AccountShipTosReducer(undefined, action);

        expect(actualState).toEqual(expectedState);
    });

    test("State object with a loaded dataViews property", () => {
        const type = "Data/AccountShipTos/CompleteLoadAccountShipToCollection";
        const action = {
            type,
            parameter,
            collection,
        } as any;
        const valueName = ["userShipToCollection"];
        const expectedState = new ExpectedState(initialState)
            .addDataViewWithValue(parameter, collection, valueName)
            .getState();

        const actualState = AccountShipTosReducer(undefined, action);

        expect(actualState).toEqual(expectedState);
    });
});

function returnCustomerCostCodeDto(): CustomerCostCodeDto {
    return {
        costCode: "test",
        customerCostCodeId: "testID",
        description: "description",
        isActive: true,
    };
}

function returnAccountShipToModel(): AccountShipToModel {
    return {
        address: "address",
        assign: false,
        city: "city",
        costCode: "123456789",
        isDefaultShipTo: true,
        id: "testID",
        shipToNumber: "ShipTo",
        state: "state",
    };
}
