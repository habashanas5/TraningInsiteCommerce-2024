import { GetProductCollectionApiV2Parameter } from "@insite/client-framework/Services/ProductServiceV2";
import ProductsReducer from "@insite/client-framework/Store/Data/Products/ProductsReducer";
import { ProductsDataView, ProductsState } from "@insite/client-framework/Store/Data/Products/ProductsState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import { ProductCollectionModel, ProductModel } from "@insite/client-framework/Types/ApiModels";

describe("ProductsReducer", () => {
    const mockProductModel = returnProductModel();
    const parameter: GetProductCollectionApiV2Parameter = {};
    const key = "EMPTY_KEY";
    const collection: ProductCollectionModel = {
        uri: "testURI",
        properties: {},
        attributeTypeFacets: null,
        brandFacets: null,
        categoryFacets: null,
        correctedQuery: "test",
        didYouMeanSuggestions: null,
        exactMatch: false,
        notAllProductsAllowed: false,
        notAllProductsFound: false,
        originalQuery: "test",
        priceRange: null,
        productLineFacets: null,
        products: [mockProductModel],
        searchTermRedirectUrl: "test",
        pagination: null,
    };
    const extraData = {
        attributeTypeFacets: collection.attributeTypeFacets,
        brandFacets: collection.brandFacets,
        categoryFacets: collection.categoryFacets,
        correctedQuery: collection.correctedQuery,
        didYouMeanSuggestions: collection.didYouMeanSuggestions,
        exactMatch: collection.exactMatch,
        notAllProductsAllowed: collection.notAllProductsAllowed,
        notAllProductsFound: collection.notAllProductsFound,
        originalQuery: collection.originalQuery,
        priceRange: collection.priceRange,
        productLineFacets: collection.productLineFacets,
        searchTermRedirectUrl: collection.searchTermRedirectUrl,
    };
    let initialState: ProductsState;
    beforeEach(() => {
        initialState = {
            isLoading: {},
            idByPath: {},
            byId: {},
            dataViews: {},
        };
    });

    test("dataViews property whose isLoading is true", () => {
        const type = "Data/Products/BeginLoadProducts";
        const action = {
            type,
            parameter,
        } as any;
        const expectedState = new ExpectedState(initialState).setStateDataViewLoading(parameter).getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = ProductsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("State object with a loaded dataViews property", () => {
        const type = "Data/Products/CompleteLoadProducts";
        const action = {
            type,
            parameter,
            collection,
        } as any;
        const expectedState = new ExpectedState(initialState)
            .setStateDataViewLoaded(
                parameter,
                collection,
                "products",
                mockProductModel => {
                    initialState.idByPath[mockProductModel.canonicalUrl] = mockProductModel.id;
                },
                extraData,
            )
            .getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = ProductsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews).toBeTruthy();
        expect(actualState).toEqual(expectedState);
    });

    test("State object with a new dataViews property that passed into the reducer", () => {
        const type = "Data/Products/ReplaceDataView";
        const newDataView: ProductsDataView = {
            isLoading: false,
            properties: {},
            fetchedDate: new Date(),
            attributeTypeFacets: null,
            brandFacets: null,
            categoryFacets: null,
            correctedQuery: "test",
            didYouMeanSuggestions: null,
            exactMatch: false,
            notAllProductsAllowed: false,
            notAllProductsFound: false,
            originalQuery: "test",
            priceRange: null,
            productLineFacets: null,
            searchTermRedirectUrl: "test",
        };
        const action = {
            type,
            parameter,
            dataView: newDataView,
        } as any;

        const actualState = ProductsReducer(undefined, action) as any;

        expect(actualState.dataViews[key]).toEqual(newDataView);
    });

    test("isLoading property whose id value is true", () => {
        const type = "Data/Products/BeginLoadProduct";
        const action = {
            type,
            id: "testID",
        } as any;
        const expectedState = new ExpectedState(initialState).addIsLoading(action.id).getState();

        const actualState = ProductsReducer(undefined, action);

        expect(actualState.isLoading[action.id]).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("byId property containing a productModel", () => {
        const type = "Data/Products/CompleteLoadProduct";
        const action = {
            type,
            model: mockProductModel,
        } as any;
        const value = { [mockProductModel.canonicalUrl]: mockProductModel.id };
        const expectedState = new ExpectedState(initialState)
            .addById(action.model)
            .setState("idByPath", value)
            .getState();

        const actualState = ProductsReducer(undefined, action);

        expect(actualState.byId[mockProductModel.id]).toEqual(mockProductModel);
        expect(actualState).toEqual(expectedState);
    });

    test("State object should contain an update idByPath property", () => {
        const type = "Data/Products/UpdateIdByPath";
        const action = {
            type,
            idByPath: {
                path: "testPath",
            },
        } as any;

        const actualState = ProductsReducer(undefined, action);

        expect(actualState.idByPath).toEqual(action.idByPath);
    });
});

function returnProductModel(): ProductModel {
    return {
        uri: "testURI",
        properties: {},
        allowZeroPricing: false,
        brand: null,
        canAddToCart: false,
        canAddToWishlist: false,
        canConfigure: false,
        canonicalUrl: "test",
        canShowPrice: false,
        canShowUnitOfMeasure: false,
        configurationType: "test",
        customerProductNumber: "test",
        id: "test",
        imageAltText: "test",
        isDiscontinued: false,
        isSponsored: false,
        isVariantParent: false,
        largeImagePath: "test",
        manufacturerItem: "test",
        mediumImagePath: "test",
        minimumOrderQty: 1,
        packDescription: "test",
        priceFacet: null,
        productLine: null,
        productNumber: "test",
        productTitle: "test",
        quoteRequired: false,
        score: 1,
        smallImagePath: "test",
        trackInventory: false,
        unitListPrice: 1,
        unitListPriceDisplay: "test",
        unitOfMeasures: null,
        urlSegment: "test",
        variantTypeId: null,
        salePriceLabel: "test",
        cantBuy: false,
    };
}
