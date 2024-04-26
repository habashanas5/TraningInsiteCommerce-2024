import { GetWishListLinesApiParameter } from "@insite/client-framework/Services/WishListService";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import WishListLinesReducer from "@insite/client-framework/Store/Data/WishListLines/WishListLinesReducer";
import { WishListLinesState } from "@insite/client-framework/Store/Data/WishListLines/WishListLinesState";
import { WishListLineCollectionModel, WishListLineModel } from "@insite/client-framework/Types/ApiModels";

export const mockWishListLineModel = returnWishListLineModel();

describe("WishListLineReducer", () => {
    const collection: WishListLineCollectionModel = {
        uri: "testURI",
        properties: {},
        pagination: null,
        wishListLines: [mockWishListLineModel],
        changedListLineQuantities: null,
    };
    const parameter: GetWishListLinesApiParameter = {
        wishListId: "testId",
    };
    const key = getDataViewKey(parameter);
    let initialState: WishListLinesState;
    beforeEach(() => {
        initialState = {
            isLoading: {},
            byId: {},
            dataViews: {},
        };
    });

    test("State object should contain a dataViews property whose isLoading is true", () => {
        const type = "Data/WishListLines/BeginLoadWishListLines";
        const action = {
            type,
            parameter,
        } as any;
        const expectedState = new ExpectedState(initialState).setStateDataViewLoading(parameter).getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = WishListLinesReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("State object contains a loaded dataViews property", () => {
        const type = "Data/WishListLines/CompleteLoadWishListLines";
        const action = {
            type,
            parameter,
            result: collection,
        } as any;
        const expectedState = new ExpectedState(initialState)
            .setStateDataViewLoaded(parameter, collection, "wishListLines")
            .getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = WishListLinesReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews).toBeTruthy();
        expect(actualState).toEqual(expectedState);
    });

    test("Reset should return initialState", () => {
        const type = "Data/WishListLines/Reset";
        const action = {
            type,
        } as any;

        const actualState = WishListLinesReducer(undefined, action);

        expect(actualState).toEqual(initialState);
    });

    test("State object has byId property containing a WishListLineModel", () => {
        const type = "Data/WishListLines/UpdateWishListLine";
        const action = {
            type,
            model: mockWishListLineModel,
        } as any;
        const expectedState = new ExpectedState(initialState).addById(action.model).getState();

        const actualState = WishListLinesReducer(undefined, action);

        expect(actualState.byId[mockWishListLineModel.id]).toEqual(mockWishListLineModel);
        expect(actualState).toEqual(expectedState);
    });
});

function returnWishListLineModel(): WishListLineModel {
    return {
        uri: "testURI",
        properties: {},
        allowZeroPricing: false,
        altText: "test",
        availability: null,
        baseUnitOfMeasure: "test",
        baseUnitOfMeasureDisplay: "test",
        brand: null,
        breakPrices: null,
        canAddToCart: false,
        canBackOrder: false,
        canEnterQuantity: false,
        canShowPrice: false,
        canShowUnitOfMeasure: false,
        createdByDisplayName: "test",
        createdOn: new Date(),
        customerName: "test",
        erpNumber: "test",
        id: "test",
        isActive: false,
        isDiscontinued: false,
        isQtyAdjusted: false,
        isSharedLine: false,
        isVisible: false,
        manufacturerItem: "test",
        notes: "test",
        packDescription: "test",
        pricing: null,
        productId: "test",
        productName: "test",
        productUnitOfMeasures: null,
        productUri: "test",
        qtyOnHand: 1,
        qtyOrdered: 1,
        qtyPerBaseUnitOfMeasure: 1,
        quoteRequired: false,
        selectedUnitOfMeasure: "test",
        shortDescription: "test",
        smallImagePath: "test",
        sortOrder: 1,
        trackInventory: false,
        unitOfMeasure: "test",
        unitOfMeasureDescription: "test",
        unitOfMeasureDisplay: "test",
    };
}
