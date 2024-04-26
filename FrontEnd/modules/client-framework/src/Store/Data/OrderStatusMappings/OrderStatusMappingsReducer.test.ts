import { GetOrderStatusMappingsApiParameter } from "@insite/client-framework/Services/OrderService";
import OrderStatusMappingsReducer from "@insite/client-framework/Store/Data/OrderStatusMappings/OrderStatusMappingsReducer";
import { OrderStatusMappingsState } from "@insite/client-framework/Store/Data/OrderStatusMappings/OrderStatusMappingsState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import { OrderStatusMappingCollectionModel, OrderStatusMappingModel } from "@insite/client-framework/Types/ApiModels";

describe("OrderStatusMappingReducer", () => {
    const mockOrderStatusMappingModel = returnOrderStatusMappingModel();
    const parameter: GetOrderStatusMappingsApiParameter = {};
    const key = "EMPTY_KEY";
    const collection: OrderStatusMappingCollectionModel = {
        uri: "testURI",
        properties: {},
        orderStatusMappings: [mockOrderStatusMappingModel],
    };
    let initialState: OrderStatusMappingsState;
    beforeEach(() => {
        initialState = {
            isLoading: {},
            byId: {},
            dataViews: {},
        };
    });

    test("dataViews property whose isLoading is true", () => {
        const type = "Data/OrderStatusMappings/BeginLoadOrderStatusMappings";
        const action = {
            type,
            parameter,
        } as any;
        const expectedState = new ExpectedState(initialState).setStateDataViewLoading(parameter).getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = OrderStatusMappingsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("State object with a loaded dataViews property", () => {
        const type = "Data/OrderStatusMappings/CompleteLoadOrderStatusMappings";
        const action = {
            type,
            parameter,
            collection,
        } as any;
        const expectedState = new ExpectedState(initialState)
            .setStateDataViewLoaded(parameter, collection, "orderStatusMappings")
            .getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = OrderStatusMappingsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews).toBeTruthy();
        expect(actualState.byId[mockOrderStatusMappingModel.id]).toEqual(mockOrderStatusMappingModel);
        expect(actualState).toEqual(expectedState);
    });

    test("Reset should return initialState", () => {
        const type = "Data/OrderStatusMappings/Reset";
        const action = {
            type,
        } as any;

        const actualState = OrderStatusMappingsReducer(undefined, action);

        expect(actualState).toEqual(initialState);
    });
});

function returnOrderStatusMappingModel(): OrderStatusMappingModel {
    return {
        uri: "testURI",
        properties: {},
        allowCancellation: false,
        allowRma: false,
        displayName: "test",
        erpOrderStatus: "test",
        id: "testID",
        isDefault: false,
    };
}
