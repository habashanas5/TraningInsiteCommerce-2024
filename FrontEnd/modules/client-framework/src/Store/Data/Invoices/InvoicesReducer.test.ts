import { GetInvoicesApiParameter } from "@insite/client-framework/Services/InvoiceService";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import InvoicesReducer from "@insite/client-framework/Store/Data/Invoices/InvoicesReducer";
import { InvoicesState } from "@insite/client-framework/Store/Data/Invoices/InvoicesState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import { InvoiceCollectionModel, InvoiceModel } from "@insite/client-framework/Types/ApiModels";

describe("InvoicesReducer", () => {
    const mockInvoiceModel = returnInvoiceModel();
    const parameter: GetInvoicesApiParameter = {
        invoiceNumber: "test",
        orderNumber: "test",
    };
    const key = getDataViewKey(parameter);
    const collection: InvoiceCollectionModel = {
        uri: "testURI",
        properties: {},
        invoices: [mockInvoiceModel],
        pagination: null,
        showErpOrderNumber: false,
    };
    let initialState: InvoicesState;
    beforeEach(() => {
        initialState = {
            isLoading: {},
            idByInvoiceNumber: {},
            byId: {},
            dataViews: {},
            errorStatusCodeById: {},
        };
    });

    test("dataViews property whose isLoading is true", () => {
        const type = "Data/Invoices/BeginLoadInvoices";
        const action = {
            type,
            parameter,
        } as any;
        const expectedState = new ExpectedState(initialState).setStateDataViewLoading(parameter).getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = InvoicesReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("Should return a InvoicesState object with a loaded dataViews property", () => {
        const type = "Data/Invoices/CompleteLoadInvoices";
        const action = {
            type,
            parameter,
            collection,
        } as any;
        const value = { [mockInvoiceModel.invoiceNumber]: mockInvoiceModel.id };
        const expectedState = new ExpectedState(initialState)
            .setStateDataViewLoaded(parameter, collection, "invoices")
            .setState("idByInvoiceNumber", value)
            .getState();

        delete expectedState.dataViews[key].fetchedDate;

        const actualState = InvoicesReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews).toBeTruthy();
        expect(actualState).toEqual(expectedState);
    });

    test("isLoading property whose invoiceNumber value is true", () => {
        const type = "Data/Invoices/BeginLoadInvoiceByInvoiceNumber";
        const action = {
            type,
            invoiceNumber: "testID",
        } as any;
        const expectedState = new ExpectedState(initialState).addIsLoading(action.invoiceNumber).getState();

        const actualState = InvoicesReducer(undefined, action);

        expect(actualState.isLoading[action.invoiceNumber]).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("byId property should contain a InvoicesModel", () => {
        const type = "Data/Invoices/CompleteLoadInvoiceByInvoiceNumber";
        const action = {
            type,
            model: mockInvoiceModel,
        } as any;
        const value = { [mockInvoiceModel.invoiceNumber]: mockInvoiceModel.id };
        const expectedState = new ExpectedState(initialState)
            .addById(action.model)
            .setState("idByInvoiceNumber", value)
            .getState();

        const actualState = InvoicesReducer(undefined, action);

        expect(actualState.byId[mockInvoiceModel.id]).toEqual(mockInvoiceModel);
        expect(actualState).toEqual(expectedState);
    });

    test("State object has errorStatusCodeById property containing a status code", () => {
        const type = "Data/Invoices/FailedToLoadInvoiceByInvoiceNumber";
        const action = {
            type,
            invoiceNumber: "testID",
            status: 404,
        } as any;
        const value = { [action.invoiceNumber]: action.status };
        const expectedState = new ExpectedState(initialState).setState("errorStatusCodeById", value).getState();

        const actualState = InvoicesReducer(undefined, action);

        expect(actualState.errorStatusCodeById![action.invoiceNumber]).toEqual(action.status);
        expect(actualState).toEqual(expectedState);
    });

    test("Reset return initialState", () => {
        const type = "Data/Invoices/Reset";
        const action = {
            type,
        } as any;

        const actualState = InvoicesReducer(undefined, action);

        expect(actualState).toEqual(initialState);
    });
});

function returnInvoiceModel(): InvoiceModel {
    return {
        uri: "testURI",
        properties: {},
        billToCity: "test",
        billToPostalCode: "test",
        billToState: "test",
        btAddress1: "test",
        btAddress2: "test",
        btCompanyName: "test",
        btCountry: "test",
        currencyCode: "test",
        currentBalance: 1,
        currentBalanceDisplay: "test",
        customerNumber: "test",
        customerPO: "test",
        customerSequence: "test",
        customerVatNumber: "test",
        discountAmount: 1,
        discountAmountDisplay: "test",
        dueDate: new Date(),
        id: "test",
        invoiceDate: new Date(),
        invoiceHistoryTaxes: null,
        invoiceLines: null,
        invoiceNumber: "test",
        invoiceTotal: 1,
        invoiceTotalDisplay: "test",
        invoiceType: "test",
        isOpen: false,
        notes: "test",
        orderTotalDisplay: "test",
        otherCharges: 1,
        otherChargesDisplay: "test",
        productTotal: 1,
        productTotalDisplay: "test",
        salesperson: "test",
        shipCode: "test",
        shippingAndHandling: 1,
        shippingAndHandlingDisplay: "test",
        shipToCity: "test",
        shipToPostalCode: "test",
        shipToState: "test",
        shipViaDescription: "test",
        stAddress1: "test",
        stAddress2: "test",
        status: "test",
        stCompanyName: "test",
        stCountry: "test",
        taxAmount: 1,
        taxAmountDisplay: "test",
        terms: "test",
    };
}
