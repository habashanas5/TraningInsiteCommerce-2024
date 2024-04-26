import {
    GetWishListLinesApiParameter,
    GetWishListsApiParameter,
} from "@insite/client-framework/Services/WishListService";
import { mockWishListLineModel } from "@insite/client-framework/Store/Data//WishListLines/WishListLinesReducer.test";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import WishListsReducer from "@insite/client-framework/Store/Data/WishLists/WishListsReducer";
import { WishListsState } from "@insite/client-framework/Store/Data/WishLists/WishListsState";
import {
    WishListCollectionModel,
    WishListLineCollectionModel,
    WishListModel,
} from "@insite/client-framework/Types/ApiModels";

describe("WishListsReducer", () => {
    const mockWishListModel = returnWishListModel();
    const parameter: GetWishListsApiParameter = {};
    const key = getDataViewKey(parameter);
    const collection: WishListCollectionModel = {
        uri: "testURI",
        properties: {},
        pagination: null,
        wishListCollection: [mockWishListModel],
    };
    let initialState: WishListsState;
    beforeEach(() => {
        initialState = {
            isLoading: {},
            byId: {},
            dataViews: {},
            errorStatusCodeById: {},
        };
    });

    test("State object contains a dataViews property whose isLoading is true", () => {
        const type = "Data/WishLists/BeginLoadWishLists";
        const action = {
            type,
            parameter,
        } as any;
        const expectedState = new ExpectedState(initialState).setStateDataViewLoading(parameter).getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = WishListsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("State object should contain a loaded dataViews property", () => {
        const type = "Data/WishLists/CompleteLoadWishLists";
        const action = {
            type,
            parameter,
            result: collection,
        } as any;
        const expectedState = new ExpectedState(initialState)
            .setStateDataViewLoaded(parameter, collection, "wishListCollection")
            .getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = WishListsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews).toBeTruthy();
        expect(actualState).toEqual(expectedState);
    });

    test("isLoading property should contain a wishListId whose value is true", () => {
        const type = "Data/WishLists/BeginLoadWishList";
        const action = {
            type,
            wishListId: "testID",
        } as any;
        const expectedState = new ExpectedState(initialState).addIsLoading(action.wishListId).getState();

        const actualState = WishListsReducer(undefined, action);

        expect(actualState.isLoading[action.wishListId]).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("byId property should contain a WishListModel", () => {
        const type = "Data/WishLists/CompleteLoadWishList";
        const action = {
            type,
            wishList: mockWishListModel,
        } as any;
        const expectedState = new ExpectedState(initialState).addById(action.wishList).getState();

        const actualState = WishListsReducer(undefined, action);

        expect(actualState.byId[mockWishListModel.id]).toEqual(mockWishListModel);
        expect(actualState).toEqual(expectedState);
    });

    test("Should return a WishListstate object with errorStatusCodeById property containing a status code", () => {
        const type = "Data/WishLists/FailedToLoadWishList";
        const action = {
            type,
            wishListId: "testID",
            status: 404,
        } as any;
        const value = { [action.wishListId]: action.status };
        const expectedState = new ExpectedState(initialState).setState("errorStatusCodeById", value).getState();

        const actualState = WishListsReducer(undefined, action);

        expect(actualState.errorStatusCodeById![action.wishListId]).toEqual(action.status);
        expect(actualState).toEqual(expectedState);
    });

    test("Reset should return initialState", () => {
        const type = "Data/WishLists/Reset";
        const action = {
            type,
        } as any;

        const actualState = WishListsReducer(undefined, action);

        expect(actualState).toEqual(initialState);
    });

    test("State object's byId property should contain a WishListLineModel", () => {
        const typeBeforeCompleteLoad = "Data/WishLists/CompleteLoadWishList";
        const actionBeforeCompleteLoad = {
            type: typeBeforeCompleteLoad,
            wishList: mockWishListModel,
        } as any;
        const actualStateBeforeCompleteLoad = WishListsReducer(undefined, actionBeforeCompleteLoad);
        const type = "Data/WishLists/CompleteLoadWishListLines";
        const action = {
            type,
            parameter: <GetWishListLinesApiParameter>{
                wishListId: "test",
            },
            result: <WishListLineCollectionModel>{
                uri: "testURI",
                properties: {},
                pagination: null,
                wishListLines: [mockWishListLineModel],
                changedListLineQuantities: null,
            },
        } as any;

        const actualState = WishListsReducer(actualStateBeforeCompleteLoad, action);

        expect(actualState.byId[action.parameter.wishListId].wishListLineCollection).toEqual(
            action.result.wishListLines,
        );
    });
});

function returnWishListModel(): WishListModel {
    return {
        uri: "testURI",
        properties: {},
        allowEdit: false,
        canAddAllToCart: false,
        canAddToCart: false,
        description: "test",
        hasAnyLines: false,
        id: "test",
        isGlobal: false,
        isSharedList: false,
        message: "test",
        name: "test",
        pagination: null,
        recipientEmailAddress: "test",
        schedule: null,
        sendDayOfMonthPossibleValues: null,
        sendDayOfWeekPossibleValues: null,
        sendEmail: false,
        senderName: "test",
        sharedByDisplayName: "test",
        sharedUsers: null,
        shareOption: "test",
        updatedByDisplayName: "test",
        updatedOn: new Date(),
        wishListLineCollection: null,
        wishListLinesCount: 1,
        wishListLinesUri: "test",
        wishListSharesCount: 1,
    };
}
