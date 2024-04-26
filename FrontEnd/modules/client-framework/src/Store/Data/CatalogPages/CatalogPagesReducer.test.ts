import { CatalogPage } from "@insite/client-framework/Services/CategoryService";
import CatalogPagesReducer from "@insite/client-framework/Store/Data/CatalogPages/CatalogPagesReducer";
import { CatalogPagesState } from "@insite/client-framework/Store/Data/CatalogPages/CatalogPagesState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";

describe("CatalogPageReducer", () => {
    const mockCatalogPageModel = returnCatalogPageModel();
    let initialState: CatalogPagesState;
    beforeEach(() => {
        initialState = {
            isLoading: {},
            byId: {},
            dataViews: {},
            idByPath: {},
        };
    });

    test("state object whose isLoading's id is true", () => {
        const type = "Data/CatalogPages/BeginLoadCatalogPage";
        const action = {
            type,
            id: "testID",
        } as any;
        const expectedState = new ExpectedState(initialState).addIsLoading(action.id).getState();

        const actualState = CatalogPagesReducer(undefined, action);

        expect(actualState.isLoading["testID"]).toEqual(true);
        expect(actualState).toEqual(expectedState);
    });

    test("state object whose byId property contains a CatalogPageModel", () => {
        const type = "Data/CatalogPages/CompleteLoadCatalogPage";
        const action = {
            type,
            model: mockCatalogPageModel,
        } as any;
        const valueInPath = {
            [mockCatalogPageModel.canonicalPath.toLowerCase()]: mockCatalogPageModel.canonicalPath.toLowerCase(),
        };
        const valueInById = {
            [mockCatalogPageModel.canonicalPath.toLowerCase()]: mockCatalogPageModel,
        };
        const expectedState = new ExpectedState(initialState)
            .setState("idByPath", valueInPath)
            .setState("byId", valueInById)
            .getState();

        const actualState = CatalogPagesReducer(undefined, action);

        expect(actualState.idByPath[mockCatalogPageModel.canonicalPath.toLowerCase()]).toEqual(
            expectedState.idByPath[mockCatalogPageModel.canonicalPath.toLowerCase()],
        );
        expect(actualState.byId[mockCatalogPageModel.canonicalPath.toLowerCase()]).toEqual(mockCatalogPageModel);
        expect(actualState).toEqual(expectedState);
    });
});

function returnCatalogPageModel(): CatalogPage {
    return {
        uri: "testURI",
        properties: {},
        categoryId: "test",
        brandId: "testID",
        breadCrumbs: null,
        canonicalPath: "testCanonicalPath",
        isReplacementProduct: false,
        metaDescription: "test",
        metaKeywords: "test",
        needRedirect: false,
        obsoletePath: false,
        openGraphImage: "test",
        openGraphTitle: "test",
        openGraphUrl: "test",
        primaryImagePath: "test",
        productId: "testProductId",
        productLineId: null,
        productName: "test",
        redirectUrl: "test",
        title: "test",
        alternateLanguageUrls: {},
    };
}
