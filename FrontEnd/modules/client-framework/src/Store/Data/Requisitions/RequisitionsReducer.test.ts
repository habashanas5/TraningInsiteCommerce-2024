import { GetRequisitionsApiParameter } from "@insite/client-framework/Services/RequisitionService";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import RequisitionsReducer from "@insite/client-framework/Store/Data/Requisitions/RequisitionsReducer";
import { RequisitionsState } from "@insite/client-framework/Store/Data/Requisitions/RequisitionsState";
import { RequisitionCollectionModel, RequisitionModel } from "@insite/client-framework/Types/ApiModels";

describe("RequisitionsReducer", () => {
    const mockModel = returnMockModel();
    const parameter: GetRequisitionsApiParameter = {};
    const key = "EMPTY_KEY";
    const collection: RequisitionCollectionModel = {
        uri: "testURI",
        properties: {},
        pagination: null,
        requisitions: [mockModel],
    };

    let initialState: RequisitionsState;

    beforeEach(() => {
        initialState = {
            isLoading: {},
            byId: {},
            dataViews: {},
            errorStatusCodeById: {},
        };
    });

    test("state object with dataViews.isLoading true", () => {
        const action: any = {
            type: "Data/Requisitions/BeginLoadRequisitions",
            parameter,
        };
        const expectedState = new ExpectedState(initialState).setStateDataViewLoading(parameter).getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = RequisitionsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("State object with a loaded dataViews property", () => {
        const action = {
            type: "Data/Requisitions/CompleteLoadRequisitions",
            parameter,
            collection,
        } as any;
        const expectedState = new ExpectedState(initialState)
            .setStateDataViewLoaded(parameter, collection, "requisitions")
            .getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = RequisitionsReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews).toBeTruthy();
        expect(actualState).toEqual(expectedState);
    });

    test("isLoading property whose requisitionId value is true", () => {
        const action = {
            type: "Data/Requisitions/BeginLoadRequisition",
            requisitionId: "testID",
        } as any;
        const expectedState = new ExpectedState(initialState).addIsLoading(action.requisitionId).getState();

        const actualState = RequisitionsReducer(undefined, action);

        expect(actualState.isLoading[action.requisitionId]).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("byId property containing a RequisitionModel", () => {
        const action = {
            type: "Data/Requisitions/CompleteLoadRequisition",
            requisition: mockModel,
        } as any;
        const expectedState = new ExpectedState(initialState).addById(action.requisition).getState();
        const id = "test";

        const actualState = RequisitionsReducer(undefined, action);

        expect(actualState.byId[id]).toEqual(mockModel);
        expect(actualState).toEqual(expectedState);
    });

    test("errorStatusCodeById property containing a status code", () => {
        const action = {
            type: "Data/Requisitions/FailedToLoadRequisition",
            requisitionId: "testID",
            status: 404,
        } as any;
        const expectedState = new ExpectedState(initialState)
            .setState("errorStatusCodeById", { [action.requisitionId]: action.status })
            .getState();

        const actualState = RequisitionsReducer(undefined, action);

        expect(actualState.errorStatusCodeById![action.requisitionId]).toEqual(action.status);
        expect(actualState).toEqual(expectedState);
    });

    test("Reset returns initial state", () => {
        const action = {
            type: "Data/Requisitions/Reset",
        } as any;

        const actualState = RequisitionsReducer(undefined, action);

        expect(actualState).toEqual(initialState);
    });
});

function returnMockModel(): RequisitionModel {
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
        canAddToWishlist: false,
        canBackOrder: false,
        costCode: "test",
        customerName: "test",
        erpNumber: "test",
        hasInsufficientInventory: false,
        id: "test",
        isActive: false,
        isApproved: false,
        isConfigured: false,
        isDiscontinued: false,
        isDiscounted: false,
        isFixedConfiguration: false,
        isPromotionItem: false,
        isQtyAdjusted: false,
        isRestricted: false,
        isSubscription: false,
        line: null,
        manufacturerItem: "test",
        notes: "test",
        pricing: null,
        productId: null,
        productName: "test",
        productSubscription: null,
        productUri: "test",
        qtyLeft: 1,
        qtyOnHand: 1,
        qtyOrdered: null,
        qtyPerBaseUnitOfMeasure: 1,
        quoteRequired: false,
        requisitionId: null,
        requisitionLineCollection: null,
        requisitionLinesUri: "test",
        salePriceLabel: "test",
        sectionOptions: null,
        shortDescription: "test",
        smallImagePath: "test",
        trackInventory: false,
        unitOfMeasure: "test",
        unitOfMeasureDescription: "test",
        unitOfMeasureDisplay: "test",
    };
}
