import BrandsReducer from "@insite/client-framework/Store/Data/Brands/BrandsReducer";
import { BrandsState } from "@insite/client-framework/Store/Data/Brands/BrandsState";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import {
    BrandCategoryCollectionModel,
    BrandCategoryModel,
    BrandCollectionModel,
    BrandModel,
    BrandProductLineCollectionModel,
    BrandProductLineModel,
} from "@insite/client-framework/Types/ApiModels";

describe("BrandsReducer", () => {
    const mockBrandModel = returnBrandModel();
    const mockBrandCategoryModel = returnBrandCategoryModel();
    const mockBrandProductLineModel = returnBrandProductLineModel();
    const parameter = {
        brandId: "testID",
        maximumDepth: 1,
    };
    const key = getDataViewKey(parameter);
    const brandCollection: BrandCollectionModel = {
        uri: "testURI",
        properties: {},
        brands: [mockBrandModel],
        pagination: null,
    };
    const brandCategoryCollection: BrandCategoryCollectionModel = {
        uri: "testURI",
        properties: {},
        brandCategories: [mockBrandCategoryModel],
        pagination: null,
    };
    const brandProductLineCollection: BrandProductLineCollectionModel = {
        uri: "testURI",
        properties: {},
        pagination: null,
        productLines: [mockBrandProductLineModel],
    };
    let initialState: BrandsState;
    beforeEach(() => {
        initialState = {
            isLoading: {},
            byId: {},
            idByPath: {},
            dataViews: {},
            brandCategoryDataView: {},
            brandProductLineDataView: {},
        };
    });

    test("state object with dataViews.isLoading true", () => {
        const type = "Data/Brands/BeginLoadBrands";
        const action = {
            type,
            parameter,
        } as any;
        const expectedState = new ExpectedState(initialState).setStateDataViewLoading(parameter).getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = BrandsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toEqual(true);
        expect(actualState).toEqual(expectedState);
    });

    test("state object with a loaded dataViews property", () => {
        const type = "Data/Brands/CompleteLoadBrands";
        const action = {
            type,
            parameter,
            collection: brandCollection,
        } as any;
        const expectedState = new ExpectedState(initialState)
            .setStateDataViewLoaded(parameter, brandCollection, "brands")
            .getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = BrandsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.byId["testID"]).toEqual(expectedState.byId["testID"]);
        expect(actualState).toEqual(expectedState);
    });

    test("state object with a brandCategoryDataView whose isLoading is true", () => {
        const type = "Data/Brands/BeginLoadCategories";
        const action = {
            type,
            parameter,
        } as any;
        const propertyName = "brandCategoryDataView";
        const value = {
            isLoading: true,
            value: undefined,
        };
        const expectedState = new ExpectedState(initialState)
            .setStateWithParameter(propertyName, parameter, value)
            .getState();

        const actualState = BrandsReducer(undefined, action);

        expect(actualState).toEqual(expectedState);
    });

    test("brandCategoryDataView property contains brandCategories model in value", () => {
        const type = "Data/Brands/CompleteLoadCategories";
        const action = {
            type,
            parameter,
            collection: brandCategoryCollection,
        } as any;
        const propertyName = "brandCategoryDataView";
        const value = {
            isLoading: false,
            value: brandCategoryCollection.brandCategories,
            pagination: undefined,
            properties: {},
        };
        const expectedState = new ExpectedState(initialState)
            .setStateWithParameter(propertyName, parameter, value)
            .getState();

        const actualState = BrandsReducer(undefined, action) as any;
        delete actualState.brandCategoryDataView[key].fetchedDate;

        expect(actualState.brandCategoryDataView[key].value).toEqual(brandCategoryCollection.brandCategories);
        expect(actualState).toEqual(expectedState);
    });

    test("brandProductLineDataView property whose isLoading is true", () => {
        const type = "Data/Brands/BeginLoadProductLines";
        const action = {
            type,
            parameter,
        } as any;
        const propertyName = "brandProductLineDataView";
        const value = {
            isLoading: true,
            value: undefined,
        };
        const expectedState = new ExpectedState(initialState)
            .setStateWithParameter(propertyName, parameter, value)
            .getState();

        const actualState = BrandsReducer(undefined, action);

        expect(actualState).toEqual(expectedState);
    });

    test("brandProductLineDataView property contains brandProductLine model", () => {
        const type = "Data/Brands/CompleteLoadProductLines";
        const action = {
            type,
            parameter,
            collection: brandProductLineCollection,
        } as any;
        const propertyName = "brandProductLineDataView";
        const value = {
            isLoading: false,
            value: brandProductLineCollection.productLines,
            pagination: undefined,
            properties: {},
        };
        const expectedState = new ExpectedState(initialState)
            .setStateWithParameter(propertyName, parameter, value)
            .getState();

        const actualState = BrandsReducer(undefined, action) as any;
        delete actualState.brandProductLineDataView[key].fetchedDate;

        expect(actualState.brandProductLineDataView[key].value).toEqual(brandProductLineCollection.productLines);
        expect(actualState).toEqual(expectedState);
    });

    test("isLoading property contains a path value", () => {
        const type = "Data/Brands/BeginLoadBrandByPath";
        const action = {
            type,
            path: "testPath",
        } as any;
        const expectedState = new ExpectedState(initialState).addIsLoading(action.path).getState();

        const actualState = BrandsReducer(undefined, action);

        expect(actualState.isLoading["testPath"]).toEqual(true);
        expect(actualState).toEqual(expectedState);
    });

    test("byId property contains a brand model", () => {
        const type = "Data/Brands/CompleteLoadBrandByPath";
        const action = {
            type,
            path: "testPath",
            brand: mockBrandModel,
        } as any;
        const propertyName = "idByPath";
        const value = { [action.path]: mockBrandModel.id };
        const expectedState = new ExpectedState(initialState)
            .addById(action.brand)
            .setState(propertyName, value)
            .getState();

        const actualState = BrandsReducer(undefined, action);

        expect(actualState.byId[mockBrandModel.id]).toEqual(mockBrandModel);
        expect(actualState).toEqual(expectedState);
    });

    test("isLoading property whose id is true", () => {
        const type = "Data/Brands/BeginLoadBrand";
        const action = {
            type,
            id: "testID",
        } as any;
        const expectedState = new ExpectedState(initialState).addIsLoading(action.id).getState();

        const actualState = BrandsReducer(undefined, action);

        expect(actualState.isLoading["testID"]).toEqual(true);
        expect(actualState).toEqual(expectedState);
    });

    test("byId property should contain one brandModel", () => {
        const type = "Data/Brands/CompleteLoadBrand";
        const action = {
            type,
            id: "testID",
            brand: mockBrandModel,
        } as any;
        const expectedState = new ExpectedState(initialState).addById(mockBrandModel).getState();

        const actualState = BrandsReducer(undefined, action);

        expect(actualState.byId[action.id]).toEqual(mockBrandModel);
        expect(actualState).toEqual(expectedState);
    });
});

function returnBrandModel(): BrandModel {
    return {
        uri: "testURI",
        properties: {},
        detailPagePath: "testPath",
        externalUrl: "testURL",
        featuredImageAltText: "test",
        featuredImagePath: "test",
        htmlContent: "test",
        id: "testID",
        logoImageAltText: "test",
        urlSegment: "test",
        logoAltText: "test",
        logoLargeImagePath: "test",
        logoSmallImagePath: "test",
        manufacturer: "test",
        metaDescription: "test",
        name: "testName",
        pageTitle: "test",
        productListPagePath: "test",
        topSellerProducts: null,
    };
}

function returnBrandCategoryModel(): BrandCategoryModel {
    return {
        uri: "testURI",
        properties: {},
        brandId: "testID",
        categoryId: "testID",
        categoryName: "testName",
        categoryShortDescription: "testDescrip",
        contentManagerId: null,
        featuredImageAltText: "test",
        featuredImagePath: "test",
        htmlContent: "test",
        productListPagePath: "test",
        subCategories: null,
    };
}

function returnBrandProductLineModel(): BrandProductLineModel {
    return {
        uri: "testURI",
        properties: {},
        featuredImageAltText: "test",
        featuredImagePath: "test",
        id: "test",
        isFeatured: false,
        isSponsored: false,
        name: "test",
        productListPagePath: "test",
        sortOrder: 2,
    };
}
