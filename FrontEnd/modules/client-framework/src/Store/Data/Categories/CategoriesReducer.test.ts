import { emptyGuid } from "@insite/client-framework/Common/StringHelpers";
import { CategoryCollection, GetCategoriesApiParameter } from "@insite/client-framework/Services/CategoryService";
import CategoriesReducer from "@insite/client-framework/Store/Data/Categories/CategoriesReducer";
import { CategoriesState } from "@insite/client-framework/Store/Data/Categories/CategoriesState";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import { CategoryModel } from "@insite/client-framework/Types/ApiModels";

describe("CategoriesReducer", () => {
    const mockCategoryModel = retrunCategoryModel();
    const parameter: GetCategoriesApiParameter = {
        maxDepth: 1,
        startCategoryId: "testCategoryID",
    };
    const key = getDataViewKey(parameter);
    const collection: CategoryCollection = {
        uri: "testURI",
        properties: {},
        categoryIds: ["testID-1", "testID-2"],
        categoriesById: { "testID-1": mockCategoryModel, "testID-2": mockCategoryModel },
    };
    let initialState: CategoriesState;
    beforeEach(() => {
        initialState = {
            isLoading: {},
            byId: {},
            dataViews: {},
            parentCategoryIdToChildrenIds: {},
            categoryDepthLoaded: {},
            errorStatusCodeById: {},
        };
    });

    test("dataViews property whose isLoading is true", () => {
        const type = "Data/Categories/BeginLoadCategories";
        const action = {
            type,
            parameter,
        } as any;
        const expectedState = new ExpectedState(initialState).setStateDataViewLoading(parameter).getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = CategoriesReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toEqual(true);
        expect(actualState).toEqual(expectedState);
    });

    const type = "Data/Categories/CompleteLoadCategories";
    test("byId property should contain a CategoryModel", () => {
        const action = {
            type,
            parameter,
            collection,
        } as any;
        const value = {
            ids: ["testID-1", "testID-1"],
            isLoading: false,
            pagination: undefined,
            properties: {},
        };
        const expectedState = new ExpectedState(initialState)
            .addById(mockCategoryModel)
            .setStateWithParameter("dataViews", parameter, value)
            .getState();

        const actualState = CategoriesReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.byId["testID-1"]).toEqual(mockCategoryModel);
        expect(actualState).toEqual(expectedState);
    });

    test("Should not try to load more categories when no root categories", () => {
        const actualState = CategoriesReducer(undefined, {
            type,
            collection: {
                categoriesById: {},
                categoryIds: [],
                uri: "",
                properties: {},
            },
            parameter: {
                maxDepth: 2,
            },
        });

        expect(actualState).toBeTruthy();
        const { parentCategoryIdToChildrenIds } = actualState;
        expect(parentCategoryIdToChildrenIds).toBeTruthy();
        expect(parentCategoryIdToChildrenIds[emptyGuid]).toBeTruthy();
    });

    test("byId property whose categoriesId containing a CategoryModel", () => {
        const type = "Data/Categories/CompleteLoadCategoriesById";
        const action = {
            type,
            categoriesById: { "testID-1": mockCategoryModel },
        } as any;
        const expectedState = new ExpectedState(initialState).addById(mockCategoryModel).getState();

        const actualState = CategoriesReducer(initialState, action);

        expect(actualState.byId["testID-1"]).toEqual(mockCategoryModel);
        expect(actualState).toEqual(expectedState);
    });

    test("isLoading property whose id value is true", () => {
        const type = "Data/Categories/BeginLoadCategory";
        const action = {
            type,
            id: "testID",
        } as any;
        const expectedState = new ExpectedState(initialState).addIsLoading(action.id).getState();

        const actualState = CategoriesReducer(undefined, action);

        expect(actualState.isLoading[action.id]).toEqual(true);
        expect(actualState).toEqual(expectedState);
    });

    test("byId property whose model's id contains a CategoryModel", () => {
        const type = "Data/Categories/CompleteLoadCategory";
        const action = {
            type,
            model: mockCategoryModel,
        } as any;
        const expectedState = new ExpectedState(initialState).addById(mockCategoryModel).getState();

        const actualState = CategoriesReducer(initialState, action);

        expect(actualState.byId["testID-1"]).toEqual(mockCategoryModel);
        expect(actualState).toEqual(expectedState);
    });

    test("state object contains non-empty errorStatusCodeById property", () => {
        const type = "Data/Categories/FailedToLoadCategory";
        const action = {
            type,
            categoryId: "testID",
            status: 404,
        } as any;

        const actualState = CategoriesReducer(undefined, action);

        expect(actualState.isLoading[action.cartId]).toBeFalsy();
        expect(actualState.errorStatusCodeById![action.categoryId]).toEqual(action.status);
    });
});

function retrunCategoryModel(): CategoryModel {
    return {
        uri: "testURI",
        properties: {},
        activateOn: new Date(),
        deactivateOn: null,
        htmlContent: "test",
        id: "testID-1",
        imageAltText: "test",
        isDynamic: false,
        isFeatured: false,
        largeImagePath: "test",
        metaDescription: "test",
        metaKeywords: "test",
        mobileBannerImageUrl: "test",
        mobilePrimaryText: "test",
        mobileSecondaryText: "test",
        mobileTextColor: "test",
        mobileTextJustification: "test",
        name: "testName",
        path: "testPath",
        shortDescription: "test",
        smallImagePath: "test",
        sortOrder: 1,
        subCategories: null,
        urlSegment: "test",
    };
}
