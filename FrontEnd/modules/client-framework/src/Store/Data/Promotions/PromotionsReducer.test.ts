import { GetCartPromotionsApiParameter } from "@insite/client-framework/Services/CartService";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import PromotionsReducer from "@insite/client-framework/Store/Data/Promotions/PromotionsReducer";
import { PromotionsState } from "@insite/client-framework/Store/Data/Promotions/PromotionsState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import { PromotionCollectionModel, PromotionModel } from "@insite/client-framework/Types/ApiModels";

describe("PromotionsReducer", () => {
    const mockPromotionModel = returnPromotionModel();
    const parameter: GetCartPromotionsApiParameter = {
        cartId: "testID",
    };
    const key = getDataViewKey(parameter);
    const collection: PromotionCollectionModel = {
        uri: "testURI",
        properties: {},
        promotions: [mockPromotionModel],
    };
    let initialState: PromotionsState;
    beforeEach(() => {
        initialState = {
            isLoading: {},
            byId: {},
            dataViews: {},
            errorStatusCodeById: {},
        };
    });

    test("dataViews property whose isLoading is true", () => {
        const type = "Data/Promotions/BeginLoadPromotions";
        const action = {
            type,
            parameter,
        } as any;
        const expectedState = new ExpectedState(initialState).setStateDataViewLoading(parameter).getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = PromotionsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("State object contains a loaded dataViews property", () => {
        const type = "Data/Promotions/CompleteLoadPromotions";
        const action = {
            type,
            parameter,
            collection,
        } as any;
        const expectedState = new ExpectedState(initialState)
            .setStateDataViewLoaded(parameter, collection, "promotions")
            .getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = PromotionsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews).toBeTruthy();
        expect(actualState).toEqual(expectedState);
    });

    test("State object has errorStatusCodeById property containing a status code", () => {
        const type = "Data/Promotions/FailedToLoadPromotions";
        const action = {
            type,
            cartId: "testID",
            status: 404,
        } as any;
        const value = { [action.cartId]: action.status };
        const expectedState = new ExpectedState(initialState).setState("errorStatusCodeById", value).getState();

        const actualState = PromotionsReducer(undefined, action);

        expect(actualState.errorStatusCodeById![action.cartId]).toEqual(action.status);
        expect(actualState).toEqual(expectedState);
    });

    test("Reset should return initialState", () => {
        const type = "Data/Orders/Reset";
        const action = {
            type,
        } as any;

        const actualState = PromotionsReducer(undefined, action);

        expect(actualState).toEqual(initialState);
    });
});

function returnPromotionModel(): PromotionModel {
    return {
        uri: "testURI",
        properties: {},
        amount: 1,
        amountDisplay: "test",
        id: "test",
        message: "test",
        name: "test",
        orderLineId: null,
        promotionApplied: false,
        promotionCode: "test",
        promotionResultType: "test",
    };
}
