import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getMessagesDataView } from "@insite/client-framework/Store/Data/Messages/MessagesSelector";
import RecursivePartial from "@insite/mobius/utilities/RecursivePartial";

describe("getMessagesDataView selector", () => {
    const initializeState = () => {
        const returnState: RecursivePartial<ApplicationState> = {
            data: {
                messages: {
                    dataViews: {
                        "page=1": {
                            isLoading: false,
                        },
                    },
                },
            },
        };
        return returnState as ApplicationState;
    };

    test("Dataview isLoading property is false", () => {
        const state = initializeState();

        const dataView = getMessagesDataView(state, { page: 1 });
        expect(dataView.isLoading).toBe(false);
    });
});
