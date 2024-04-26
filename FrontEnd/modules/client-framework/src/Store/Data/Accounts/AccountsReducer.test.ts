import { GetAccountsApiParameter } from "@insite/client-framework/Services/AccountService";
import AccountsReducer from "@insite/client-framework/Store/Data/Accounts/AccountsReducer";
import { AccountsState } from "@insite/client-framework/Store/Data/Accounts/AccountsState";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import { AccountCollectionModel, AccountModel } from "@insite/client-framework/Types/ApiModels";

describe("AccountsReducer", () => {
    const mockModel1 = returnMockModel("testID-1", "test1");
    const mockModel2 = returnMockModel("testID-2", "test2");
    const parameter: GetAccountsApiParameter = {
        searchText: "test",
    };
    const key = getDataViewKey(parameter);
    const collection: AccountCollectionModel = {
        uri: "testURI",
        properties: {},
        accounts: [mockModel1, mockModel2],
        pagination: null,
    };
    let initialState: AccountsState;
    beforeEach(() => {
        initialState = {
            isLoading: {},
            byId: {},
            dataViews: {},
        };
    });

    test("isLoading property whose id value is true", () => {
        const type = "Data/Accounts/BeginLoadAccount";
        const id = "test";
        const action = {
            type,
            id,
        } as any;

        const expectedState = new ExpectedState(initialState).addIsLoading(id).getState();

        const actualState = AccountsReducer(undefined, action);

        expect(actualState).toEqual(expectedState);
        expect(actualState.isLoading.test).toEqual(true);
    });

    test("byId property containing a AccountModel", () => {
        const type = "Data/Accounts/CompleteLoadAccount";
        const id = "testID-1";
        const action = {
            type,
            id,
            model: mockModel1,
        } as any;

        const expectedState = new ExpectedState(initialState).addById(mockModel1).getState();

        const actualState = AccountsReducer(undefined, action);

        expect(actualState).toEqual(expectedState);
    });

    test("state object with dataViews.isLoading true", () => {
        const type = "Data/Accounts/BeginLoadAccounts";
        const action = {
            type,
            parameter,
        } as any;

        const expectedState = new ExpectedState(initialState).setStateDataViewLoading(parameter).getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = AccountsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("State object with a loaded dataViews property", () => {
        const type = "Data/Accounts/CompleteLoadAccounts";
        const action = {
            type,
            parameter,
            collection,
        } as any;

        const expectedState = new ExpectedState(initialState)
            .setStateDataViewLoaded(parameter, collection, "accounts")
            .getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = AccountsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState).toEqual(expectedState);
    });

    test("Reset returns initial state", () => {
        const type = "Data/Accounts/Reset";
        const action = {
            type,
        } as any;

        const actualState = AccountsReducer(undefined, action);

        expect(actualState).toEqual(initialState);
    });
});

function returnMockModel(id: string, str: string): AccountModel {
    return {
        uri: "testURI",
        properties: {},
        accessToken: str,
        activationStatus: str,
        approver: str,
        availableApprovers: null,
        availableRoles: null,
        billToId: null,
        canApproveOrders: true,
        canViewApprovalOrders: true,
        defaultCustomerId: null,
        defaultFulfillmentMethod: str,
        defaultWarehouse: null,
        defaultWarehouseId: null,
        email: "test@optimizely.com",
        firstName: str,
        id,
        isApproved: null,
        isGuest: false,
        isSubscribed: true,
        lastLoginOn: null,
        lastName: str,
        password: str,
        requiresActivation: null,
        role: str,
        setDefaultCustomer: false,
        shipToId: null,
        vmiRole: str,
        userName: str,
    };
}
