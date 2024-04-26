import { GetQuotesApiParameter } from "@insite/client-framework/Services/QuoteService";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import QuotesReducer from "@insite/client-framework/Store/Data/Quotes/QuotesReducer";
import { QuotesState } from "@insite/client-framework/Store/Data/Quotes/QuotesState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import { QuoteCollectionModel, QuoteModel } from "@insite/client-framework/Types/ApiModels";

describe("QuotesReducer", () => {
    const mockQuotesModel = returnQuoteModel();
    const parameter: GetQuotesApiParameter = {
        userId: "testID",
    };
    const key = getDataViewKey(parameter);
    const collection: QuoteCollectionModel = {
        uri: "testURI",
        properties: {},
        pagination: null,
        quotes: [mockQuotesModel],
        salespersonList: null,
    };
    const extraData = {
        salespersonList: collection.salespersonList,
    };
    let initialState: QuotesState;
    beforeEach(() => {
        initialState = {
            isLoading: {},
            byId: {},
            dataViews: {},
            errorStatusCodeById: {},
        };
    });

    test("Should return a QuoteState object with dataViews whose isLoading is true", () => {
        const type = "Data/Quotes/BeginLoadQuotes";
        const action = {
            type,
            parameter,
        } as any;
        const expectedState = new ExpectedState(initialState).setStateDataViewLoading(parameter).getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = QuotesReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("State object should contain a loaded dataViews property", () => {
        const type = "Data/Quotes/CompleteLoadQuotes";
        const action = {
            type,
            parameter,
            collection,
        } as any;
        const expectedState = new ExpectedState(initialState)
            .setStateDataViewLoaded(parameter, collection, "quotes", undefined, extraData)
            .getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = QuotesReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews).toBeTruthy();
        expect(actualState.dataViews[key].salespersonList).toEqual(collection.salespersonList);
        expect(actualState).toEqual(expectedState);
    });

    test("SisLoading property whose quoteId value is true", () => {
        const type = "Data/Quotes/BeginLoadQuote";
        const action = {
            type,
            quoteId: "testID",
        } as any;
        const expectedState = new ExpectedState(initialState).addIsLoading(action.quoteId).getState();

        const actualState = QuotesReducer(undefined, action);

        expect(actualState.isLoading[action.quoteId]).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("byId property should contain a QuoteModel", () => {
        const type = "Data/Quotes/CompleteLoadQuote";
        const action = {
            type,
            quote: mockQuotesModel,
        } as any;
        const expectedState = new ExpectedState(initialState).addById(action.quote).getState();

        const actualState = QuotesReducer(undefined, action);

        expect(actualState.byId[mockQuotesModel.id]).toEqual(mockQuotesModel);
        expect(actualState).toEqual(expectedState);
    });

    test("State object has errorStatusCodeById property containing a status code", () => {
        const type = "Data/Quotes/FailedToLoadQuote";
        const action = {
            type,
            quoteId: "testID",
            status: 404,
        } as any;
        const value = { [action.quoteId]: action.status };
        const expectedState = new ExpectedState(initialState).setState("errorStatusCodeById", value).getState();

        const actualState = QuotesReducer(undefined, action);

        expect(actualState.errorStatusCodeById![action.quoteId]).toEqual(action.status);
        expect(actualState).toEqual(expectedState);
    });

    test("Reset should return initialState", () => {
        const type = "Data/Orders/Reset";
        const action = {
            type,
        } as any;

        const actualState = QuotesReducer(undefined, action);

        expect(actualState).toEqual(initialState);
    });
});

function returnQuoteModel(): QuoteModel {
    return {
        uri: "testURI",
        properties: {},
        alsoPurchasedProducts: null,
        approverReason: "test",
        calculationMethods: null,
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
        customerNumber: "test",
        customerOrderTaxes: null,
        customerVatNumber: "test",
        displayContinueShoppingLink: false,
        erpOrderNumber: "test",
        expirationDate: null,
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
        isJobQuote: false,
        isSalesperson: false,
        isSubscribed: false,
        jobName: "test",
        lineCount: 1,
        messageCollection: null,
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
        poNumber: "test",
        promotionCode: "test",
        quoteLineCollection: null,
        quoteLinesUri: "test",
        quoteNumber: "test",
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
        userName: "test",
        userRoles: "test",
        warehouses: null,
    };
}
