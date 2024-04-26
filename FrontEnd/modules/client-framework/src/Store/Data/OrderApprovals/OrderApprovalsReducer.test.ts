import { GetOrderApprovalsApiParameter } from "@insite/client-framework/Services/OrderApprovalService";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import OrderApprovalsReducer from "@insite/client-framework/Store/Data/OrderApprovals/OrderApprovalsReducer";
import { OrderApprovalsState } from "@insite/client-framework/Store/Data/OrderApprovals/OrderApprovalsState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import { CartModel, OrderApprovalCollectionModel } from "@insite/client-framework/Types/ApiModels";

describe("OrderApprovalsReducer", () => {
    const mockCartmodel = returnCartModel();
    const parameter: GetOrderApprovalsApiParameter = {
        page: 1,
    };
    const key = getDataViewKey(parameter);
    const collection: OrderApprovalCollectionModel = {
        uri: "testURI",
        properties: {},
        cartCollection: [mockCartmodel],
        pagination: null,
    };
    let initialState: OrderApprovalsState;
    beforeEach(() => {
        initialState = {
            isLoading: {},
            byId: {},
            dataViews: {},
        };
    });

    test("dataViews property whose isLoading is true", () => {
        const type = "Data/OrderApprovals/BeginLoadingOrderApprovals";
        const action = {
            type,
            parameter,
        } as any;
        const expectedState = new ExpectedState(initialState).setStateDataViewLoading(parameter).getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = OrderApprovalsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("State object with a loaded dataViews property", () => {
        const type = "Data/OrderApprovals/CompleteLoadingOrderApprovals";
        const action = {
            type,
            parameter,
            collection,
        } as any;
        const expectedState = new ExpectedState(initialState)
            .setStateDataViewLoaded(parameter, collection, "cartCollection")
            .getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = OrderApprovalsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews).toBeTruthy();
        expect(actualState).toEqual(expectedState);
    });

    test("isLoading property whose cartId value is true", () => {
        const type = "Data/OrderApprovals/BeginLoadingOrderApproval";
        const action = {
            type,
            cartId: "testID",
        } as any;
        const expectedState = new ExpectedState(initialState).addIsLoading(action.cartId).getState();

        const actualState = OrderApprovalsReducer(undefined, action);

        expect(actualState.isLoading[action.cartId]).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("byId property containing a MessageModel", () => {
        const type = "Data/OrderApprovals/CompleteLoadingOrderApproval";
        const action = {
            type,
            model: mockCartmodel,
        } as any;
        const expectedState = new ExpectedState(initialState).addById(action.model).getState();

        const actualState = OrderApprovalsReducer(undefined, action);

        expect(actualState.byId[mockCartmodel.id]).toEqual(mockCartmodel);
        expect(actualState).toEqual(expectedState);
    });

    test("Reset should return initialState", () => {
        const type = "Data/OrderApprovals/Reset";
        const action = {
            type,
        } as any;

        const actualState = OrderApprovalsReducer(undefined, action);

        expect(actualState).toEqual(initialState);
    });
});

function returnCartModel(): CartModel {
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
        customerOrderTaxes: null,
        customerVatNumber: "test",
        displayContinueShoppingLink: false,
        erpOrderNumber: "test",
        failedToGetRealTimeInventory: false,
        fulfillmentMethod: "test",
        hasApprover: false,
        hasInsufficientInventory: false,
        id: "test",
        initiatedByUserName: "test",
        isAuthenticated: false,
        isAwaitingApproval: false,
        isGuestOrder: false,
        isSalesperson: false,
        isSubscribed: false,
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
