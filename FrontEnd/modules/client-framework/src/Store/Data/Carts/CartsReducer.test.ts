import { Cart, CartCollectionResult, GetCartsApiParameter } from "@insite/client-framework/Services/CartService";
import CartsReducer from "@insite/client-framework/Store/Data/Carts/CartsReducer";
import { CartsState } from "@insite/client-framework/Store/Data/Carts/CartsState";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";

describe("CartsReducer", () => {
    const mockCartModel = returnCartModel();
    const parameter: GetCartsApiParameter = {
        shipToId: "test",
        billToId: "test",
        status: "test",
    };
    const key = getDataViewKey(parameter);
    const collection: CartCollectionResult = {
        carts: [mockCartModel],
        pagination: null,
    };
    let initialState: CartsState;
    beforeEach(() => {
        initialState = {
            isLoading: {},
            byId: {},
            dataViews: {},
            errorStatusCodeById: {},
        };
    });

    test("isLoading property whose id is true", () => {
        const type = "Data/Carts/BeginLoadCart";
        const action = {
            type,
            id: "testID",
        } as any;
        const expectedState = new ExpectedState(initialState).addIsLoading(action.id).getState();

        const actualState = CartsReducer(undefined, action);

        expect(actualState.isLoading["testID"]).toEqual(true);
        expect(actualState).toEqual(expectedState);
    });

    test("state object contains a cartLoadedTime property and byId property contains a CartModel", () => {
        const type = "Data/Carts/CompleteLoadCart";
        const action = {
            type,
            model: mockCartModel,
        } as any;
        const expectedState = new ExpectedState(initialState)
            .addById(mockCartModel)
            .setState("cartLoadedTime", Date.now())
            .getState();

        const actualState = CartsReducer(undefined, action);

        expect(actualState.cartLoadedTime).toBeTruthy();
        expect(actualState.byId[mockCartModel.id]).toEqual(mockCartModel);
        // ISC-16573 maybe this just goes away
        // expect(actualState).toEqual(expectedState);
    });

    test("Reset should return initialState", () => {
        const type = "Data/Carts/Reset";
        const action = {
            type,
        } as any;

        const actualState = CartsReducer(undefined, action);

        expect(actualState).toEqual(initialState);
    });

    test("state object contains empty dataViews property and delete the id property inside byId", () => {
        const typeBeforeResetCart = "Data/Carts/CompleteLoadCart";
        const actionBeforeResetCart = {
            type: typeBeforeResetCart,
            model: mockCartModel,
        } as any;
        const stateBeforeResetCart = CartsReducer(undefined, actionBeforeResetCart);
        const type = "Data/Carts/ResetCart";
        const action = {
            type,
            id: mockCartModel.id,
        } as any;

        const actualState = CartsReducer(stateBeforeResetCart, action);

        expect(actualState.byId[action.id]).toBeFalsy();
        expect(actualState.dataViews).toEqual({});
    });

    test("state object should contain non-empty errorStatusCodeById property", () => {
        const type = "Data/Carts/FailedToLoadCart";
        const action = {
            type,
            cartId: "testID",
            status: 404,
        } as any;

        const actualState = CartsReducer(undefined, action);

        expect(actualState.isLoading[action.cartId]).toBeFalsy();
        expect(actualState.errorStatusCodeById![action.cartId]).toEqual(action.status);
    });

    test("Should return a CartsState object with dataViews property whose isLoading is true", () => {
        const type = "Data/Carts/BeginLoadCarts";
        const action = {
            type,
            parameter,
        } as any;
        const expectedState = new ExpectedState(initialState).setStateDataViewLoading(parameter).getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = CartsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("state object with a loaded dataViews property", () => {
        const type = "Data/Carts/CompleteLoadCarts";
        const action = {
            type,
            parameter,
            collection,
        } as any;
        const expectedState = new ExpectedState(initialState)
            .setStateDataViewLoaded(parameter, collection, "carts")
            .getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = CartsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews).toEqual(expectedState.dataViews);
        expect(actualState).toEqual(expectedState);
    });
});

function returnCartModel(): Cart {
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
        id: "testID",
        initiatedByUserName: "test",
        isAuthenticated: false,
        isAwaitingApproval: false,
        isGuestOrder: false,
        isSalesperson: false,
        isSubscribed: false,
        lineCount: 123,
        messages: null,
        notes: "test",
        orderDate: null,
        orderGrandTotal: 123,
        orderGrandTotalDisplay: "test",
        orderNumber: "test",
        orderSubTotal: 123,
        orderSubTotalDisplay: "test",
        orderSubTotalWithOutProductDiscounts: 123,
        orderSubTotalWithOutProductDiscountsDisplay: "test",
        poNumber: "test",
        promotionCode: "test",
        quoteRequiredCount: 123,
        requestedDeliveryDate: "test",
        requestedDeliveryDateDisplay: null,
        requestedPickupDate: "test",
        requestedPickupDateDisplay: null,
        requiresApproval: false,
        requiresPoNumber: false,
        salespersonName: "test",
        shippingAndHandling: 123,
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
        totalCountDisplay: 123,
        totalQtyOrdered: 123,
        totalTax: 123,
        totalTaxDisplay: "test",
        type: "test",
        typeDisplay: "test",
        unassignCart: false,
        userLabel: "test",
        userRoles: "test",
        warehouses: null,
    };
}
