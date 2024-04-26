import { GetMessagesApiParameter } from "@insite/client-framework/Services/MessageService";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import MessagesReducer from "@insite/client-framework/Store/Data/Messages/MessagesReducer";
import { MessagesState } from "@insite/client-framework/Store/Data/Messages/MessagesState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import { MessageCollectionModel, MessageModel } from "@insite/client-framework/Types/ApiModels";

describe("MessagesReducer", () => {
    const mockMessageModel = returnMessageModel();
    const parameter: GetMessagesApiParameter = {
        page: 1,
    };
    const key = getDataViewKey(parameter);
    const collection: MessageCollectionModel = {
        uri: "testURI",
        properties: {},
        messages: [mockMessageModel],
    };
    let initialState: MessagesState;
    beforeEach(() => {
        initialState = {
            isLoading: {},
            byId: {},
            dataViews: {},
        };
    });

    test("dataViews property whose isLoading is true", () => {
        const type = "Data/Messages/BeginLoadMessages";
        const action = {
            type,
            parameter,
        } as any;
        const expectedState = new ExpectedState(initialState).setStateDataViewLoading(parameter).getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = MessagesReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("State object with a loaded dataViews property", () => {
        const type = "Data/Messages/CompleteLoadMessages";
        const action = {
            type,
            parameter,
            collection,
        } as any;
        const expectedState = new ExpectedState(initialState)
            .setStateDataViewLoaded(parameter, collection, "messages")
            .getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = MessagesReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews).toBeTruthy();
        expect(actualState).toEqual(expectedState);
    });

    test("byId property containing a MessageModel", () => {
        const type = "Data/Messages/CompleteLoadMessage";
        const action = {
            type,
            model: mockMessageModel,
        } as any;
        const expectedState = new ExpectedState(initialState).addById(action.model).getState();

        const actualState = MessagesReducer(undefined, action);

        expect(actualState.byId[mockMessageModel.id]).toEqual(mockMessageModel);
        expect(actualState).toEqual(expectedState);
    });

    test("Reset should return initialState", () => {
        const type = "Data/Messages/Reset";
        const action = {
            type,
        } as any;

        const actualState = MessagesReducer(undefined, action);

        expect(actualState).toEqual(initialState);
    });
});

function returnMessageModel(): MessageModel {
    return {
        uri: "testURI",
        properties: {},
        body: "test",
        dateToDisplay: new Date(),
        displayName: "test",
        id: "test",
        isRead: false,
        subject: "test",
        createdDate: new Date(),
        message: "test",
        quoteId: "test",
    };
}
