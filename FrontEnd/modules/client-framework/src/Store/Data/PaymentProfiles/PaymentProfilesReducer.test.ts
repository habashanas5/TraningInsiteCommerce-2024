import { GetPaymentProfilesApiParameter } from "@insite/client-framework/Services/AccountService";
import PaymentProfilesReducer from "@insite/client-framework/Store/Data/PaymentProfiles/PaymentProfilesReducer";
import { PaymentProfilesState } from "@insite/client-framework/Store/Data/PaymentProfiles/PaymentProfilesState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import {
    AccountPaymentProfileCollectionModel,
    AccountPaymentProfileModel,
} from "@insite/client-framework/Types/ApiModels";

describe("PaymentProfilesReducer", () => {
    const mockAccountPaymentProfileModel = returnAccountPaymentProfileModel();
    const parameter: GetPaymentProfilesApiParameter = {};
    const key = "EMPTY_KEY";
    const collection: AccountPaymentProfileCollectionModel = {
        uri: "testURI",
        properties: {},
        accountPaymentProfiles: [mockAccountPaymentProfileModel],
        pagination: null,
    };
    let initialState: PaymentProfilesState;
    beforeEach(() => {
        initialState = {
            isLoading: {},
            byId: {},
            dataViews: {},
        };
    });

    test("dataViews property whose isLoading is true", () => {
        const type = "Data/PaymentProfiles/BeginLoadPaymentProfiles";
        const action = {
            type,
            parameter,
        } as any;
        const expectedState = new ExpectedState(initialState).setStateDataViewLoading(parameter).getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = PaymentProfilesReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("State object contains a loaded dataViews property", () => {
        const type = "Data/PaymentProfiles/CompleteLoadPaymentProfiles";
        const action = {
            type,
            parameter,
            collection,
        } as any;
        const expectedState = new ExpectedState(initialState)
            .setStateDataViewLoaded(parameter, collection, "accountPaymentProfiles")
            .getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = PaymentProfilesReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews).toBeTruthy();
        expect(actualState.byId[mockAccountPaymentProfileModel.id]).toEqual(mockAccountPaymentProfileModel);
        expect(actualState).toEqual(expectedState);
    });

    test("Reset should return initialState", () => {
        const type = "Data/PaymentProfiles/Reset";
        const action = {
            type,
        } as any;

        const actualState = PaymentProfilesReducer(undefined, action);

        expect(actualState).toEqual(initialState);
    });
});

function returnAccountPaymentProfileModel(): AccountPaymentProfileModel {
    return {
        uri: "testURI",
        properties: {},
        address1: "test",
        address2: "test",
        address3: "test",
        address4: "test",
        cardHolderName: "test",
        cardIdentifier: "test",
        cardType: "test",
        city: "test",
        country: "test",
        description: "test",
        expirationDate: "test",
        id: "test",
        isDefault: false,
        maskedCardNumber: "test",
        postalCode: "test",
        state: "test",
        tokenScheme: "test",
    };
}
