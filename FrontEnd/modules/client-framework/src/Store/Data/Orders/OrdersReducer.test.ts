import { GetOrdersApiParameter } from "@insite/client-framework/Services/OrderService";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import OrdersReducer from "@insite/client-framework/Store/Data/Orders/OrdersReducer";
import { OrdersState } from "@insite/client-framework/Store/Data/Orders/OrdersState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import { OrderCollectionModel, OrderModel } from "@insite/client-framework/Types/ApiModels";

describe("OrdersReducer", () => {
    const mockOrderModel = returnOrderModel();
    const parameter: GetOrdersApiParameter = {
        page: 1,
    };
    const key = getDataViewKey(parameter);
    const collection: OrderCollectionModel = {
        uri: "testURI",
        properties: {},
        orders: [mockOrderModel],
        showErpOrderNumber: false,
        pagination: null,
    };
    const value = {
        [mockOrderModel.erpOrderNumber]: mockOrderModel.id,
        [mockOrderModel.webOrderNumber]: mockOrderModel.id,
    };
    let initialState: OrdersState;
    beforeEach(() => {
        initialState = {
            isLoading: {},
            idByOrderNumber: {},
            byId: {},
            dataViews: {},
            errorStatusCodeById: {},
        };
    });

    test("dataViews property whose isLoading is true", () => {
        const type = "Data/Orders/BeginLoadOrders";
        const action = {
            type,
            parameter,
        } as any;
        const expectedState = new ExpectedState(initialState).setStateDataViewLoading(parameter).getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = OrdersReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("State object with a loaded dataViews property", () => {
        const type = "Data/Orders/CompleteLoadOrders";
        const action = {
            type,
            parameter,
            collection,
        } as any;

        const expectedState = new ExpectedState(initialState)
            .setStateDataViewLoaded(parameter, collection, "orders")
            .setState("idByOrderNumber", value)
            .getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = OrdersReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews).toBeTruthy();
        expect(actualState).toEqual(expectedState);
    });

    test("isLoading property whose orderNumber value is true", () => {
        const type = "Data/Orders/BeginLoadOrder";
        const action = {
            type,
            orderNumber: "testID",
        } as any;
        const expectedState = new ExpectedState(initialState).addIsLoading(action.orderNumber).getState();

        const actualState = OrdersReducer(undefined, action);

        expect(actualState.isLoading[action.orderNumber]).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("byId property containing a MessageModel", () => {
        const type = "Data/Orders/CompleteLoadOrder";
        const action = {
            type,
            model: mockOrderModel,
        } as any;
        const expectedState = new ExpectedState(initialState)
            .addById(action.model)
            .setState("idByOrderNumber", value)
            .getState();

        const actualState = OrdersReducer(undefined, action);

        expect(actualState.byId[mockOrderModel.id]).toEqual(mockOrderModel);
        expect(actualState).toEqual(expectedState);
    });

    test("State object has errorStatusCodeById property containing a status code", () => {
        const type = "Data/Orders/FailedToLoadOrder";
        const action = {
            type,
            orderNumber: "testOrderNumber",
            status: 404,
        } as any;
        const errorValue = {
            [action.orderNumber]: action.status,
        };
        const expectedState = new ExpectedState(initialState).setState("errorStatusCodeById", errorValue).getState();

        const actualState = OrdersReducer(undefined, action);

        expect(actualState.errorStatusCodeById![action.orderNumber]).toEqual(action.status);
        expect(actualState).toEqual(expectedState);
    });

    test("Reset should return initialState", () => {
        const type = "Data/Orders/Reset";
        const action = {
            type,
        } as any;

        const actualState = OrdersReducer(undefined, action);

        expect(actualState).toEqual(initialState);
    });
});

function returnOrderModel(): OrderModel {
    return {
        uri: "testURI",
        properties: {},
        billToCity: "test",
        billToPostalCode: "test",
        billToState: "test",
        btAddress1: "test",
        btAddress2: "test",
        btAddress3: "test",
        btAddress4: "test",
        btCompanyName: "test",
        btCountry: "test",
        canAddAllToCart: false,
        canAddToCart: false,
        currencyCode: "test",
        currencySymbol: "test",
        customerNumber: "test",
        customerPO: "test",
        customerSequence: "test",
        customerVatNumber: "test",
        discountAmount: 1,
        discountAmountDisplay: "test",
        erpOrderNumber: "testERPOder",
        fulfillmentMethod: "test",
        handlingCharges: 1,
        handlingChargesDisplay: "test",
        id: "testID",
        modifyDate: new Date(),
        notes: "test",
        orderDate: new Date(),
        orderDiscountAmount: 1,
        orderDiscountAmountDisplay: "test",
        orderGrandTotalDisplay: "test",
        orderHistoryTaxes: null,
        orderPromotions: null,
        orderSubTotal: 1,
        orderSubTotalDisplay: "test",
        orderTotal: 1,
        orderTotalDisplay: "test",
        otherCharges: 1,
        otherChargesDisplay: "test",
        productDiscountAmount: 1,
        productDiscountAmountDisplay: "test",
        productTotal: 1,
        productTotalDisplay: "test",
        requestedDeliveryDateDisplay: null,
        returnReasons: null,
        salesperson: "test",
        shipCode: "test",
        shipmentPackages: null,
        shippingAndHandling: 1,
        shippingAndHandlingDisplay: "test",
        shippingCharges: 1,
        shippingChargesDisplay: "test",
        shipToCity: "test",
        shipToPostalCode: "test",
        shipToState: "test",
        shipViaDescription: "test",
        showTaxAndShipping: false,
        stAddress1: "test",
        stAddress2: "test",
        stAddress3: "test",
        stAddress4: "test",
        status: "test",
        statusDisplay: "test",
        stCompanyName: "test",
        stCountry: "test",
        taxAmount: 1,
        taxAmountDisplay: "test",
        terms: "test",
        totalTaxDisplay: "test",
        webOrderNumber: "testWebOrder",
    };
}
