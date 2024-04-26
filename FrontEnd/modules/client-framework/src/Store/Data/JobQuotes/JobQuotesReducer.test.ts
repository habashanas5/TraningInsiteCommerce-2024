import { GetJobQuotesApiParameter } from "@insite/client-framework/Services/JobQuoteService";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import JobQuotesReducer from "@insite/client-framework/Store/Data/JobQuotes/JobQuotesReducer";
import { JobQuotesState } from "@insite/client-framework/Store/Data/JobQuotes/JobQuotesState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import { JobQuoteCollectionModel, JobQuoteModel } from "@insite/client-framework/Types/ApiModels";

describe("JobQuotesReducer", () => {
    const mockJobQuotesModel = returnJobQuoteModel();
    const parameter: GetJobQuotesApiParameter = {
        page: 1,
    };
    const key = getDataViewKey(parameter);
    const collection: JobQuoteCollectionModel = {
        uri: "testURI",
        properties: {},
        jobQuotes: [mockJobQuotesModel],
        pagination: null,
    };
    let initialState: JobQuotesState;
    beforeEach(() => {
        initialState = {
            isLoading: {},
            byId: {},
            dataViews: {},
        };
    });

    test("dataViews property whose isLoading is true", () => {
        const type = "Data/JobQuotes/BeginLoadJobQuotes";
        const action = {
            type,
            parameter,
        } as any;
        const expectedState = new ExpectedState(initialState).setStateDataViewLoading(parameter).getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = JobQuotesReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("State object with a loaded dataViews property", () => {
        const type = "Data/JobQuotes/CompleteLoadJobQuotes";
        const action = {
            type,
            parameter,
            collection,
        } as any;
        const expectedState = new ExpectedState(initialState)
            .setStateDataViewLoaded(parameter, collection, "jobQuotes")
            .getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = JobQuotesReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews).toBeTruthy();
        expect(actualState).toEqual(expectedState);
    });

    test("isLoading property whose jobQuoteId value is true", () => {
        const type = "Data/JobQuotes/BeginLoadJobQuote";
        const action = {
            type,
            jobQuoteId: "testID",
        } as any;
        const expectedState = new ExpectedState(initialState).addIsLoading(action.jobQuoteId).getState();

        const actualState = JobQuotesReducer(undefined, action);

        expect(actualState.isLoading[action.jobQuoteId]).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("byId property should contain a InvoicesModel", () => {
        const type = "Data/JobQuotes/CompleteLoadJobQuote";
        const action = {
            type,
            jobQuote: mockJobQuotesModel,
        } as any;
        const expectedState = new ExpectedState(initialState).addById(action.jobQuote).getState();

        const actualState = JobQuotesReducer(undefined, action);

        expect(actualState.byId[mockJobQuotesModel.id]).toEqual(mockJobQuotesModel);
        expect(actualState).toEqual(expectedState);
    });

    test("Reset should return initialState", () => {
        const type = "Data/JobQuotes/Reset";
        const action = {
            type,
        } as any;

        const actualState = JobQuotesReducer(undefined, action);

        expect(actualState).toEqual(initialState);
    });
});

function returnJobQuoteModel(): JobQuoteModel {
    return {
        uri: "testURI",
        properties: {},
        alsoPurchasedProducts: null,
        approverReason: "test",
        canBypassCheckoutAddress: false,
        canCheckOut: false,
        canEditCostCode: false,
        canModifyOrder: false,
        canRequestQuote: false,
        canRequisition: false,
        canSaveOrder: false,
        carrier: null,
        cartLinesUri: "test",
        cartNotPriced: false,
        costCodeLabel: "test",
        costCodes: null,
        creditCardBillingAddress: null,
        currencySymbol: "test",
        customerName: "test",
        customerOrderTaxes: null,
        customerVatNumber: "test",
        displayContinueShoppingLink: false,
        erpOrderNumber: "test",
        expirationDate: new Date(),
        failedToGetRealTimeInventory: false,
        fulfillmentMethod: "test",
        hasApprover: false,
        hasInsufficientInventory: false,
        id: "test",
        initiatedByUserName: "test",
        isAuthenticated: false,
        isAwaitingApproval: false,
        isEditable: false,
        isGuestOrder: false,
        isSalesperson: false,
        isSubscribed: false,
        jobName: "test",
        jobQuoteId: "test",
        jobQuoteLineCollection: null,
        lineCount: 1,
        messages: null,
        notes: "test",
        orderDate: null,
        orderGrandTotal: 1,
        orderGrandTotalDisplay: "test",
        orderNumber: "test",
        orderSubTotal: 1,
        orderSubTotalDisplay: "test",
        orderSubTotalWithOutProductDiscounts: 1,
        orderSubTotalWithOutProductDiscountsDisplay: "test",
        orderTotal: 1,
        orderTotalDisplay: "test",
        poNumber: "test",
        promotionCode: "test",
        quoteRequiredCount: 1,
        requestedDeliveryDate: "test",
        requestedDeliveryDateDisplay: null,
        requestedPickupDate: "test",
        requestedPickupDateDisplay: null,
        requiresApproval: false,
        requiresPoNumber: false,
        salespersonName: "test",
        shippingAndHandling: 1,
        shippingAndHandlingDisplay: "test",
        shipToFullAddress: "test",
        shipToLabel: "test",
        shipVia: null,
        showCostCode: false,
        showCreditCard: false,
        showECheck: false,
        showLineNotes: false,
        showNewsletterSignup: false,
        showPayPal: false,
        showPoNumber: false,
        showTaxAndShipping: false,
        status: "test",
        statusDisplay: "test",
        taxFailureReason: "test",
        totalCountDisplay: 1,
        totalQtyOrdered: 1,
        totalTax: 1,
        totalTaxDisplay: "test",
        type: "test",
        typeDisplay: "test",
        unassignCart: false,
        userLabel: "test",
        userRoles: "test",
        warehouses: null,
    };
}
