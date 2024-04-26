import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getOrderStatusMappingDataView } from "@insite/client-framework/Store/Data/OrderStatusMappings/OrderStatusMappingsSelectors";
import RecursivePartial from "@insite/mobius/utilities/RecursivePartial";

describe("getOrderStatusMappingDataView selector", () => {
    const initializeState = () => {
        const returnState: RecursivePartial<ApplicationState> = {
            data: {
                orderStatusMappings: {
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

        const dataView = getOrderStatusMappingDataView(state);
        expect(dataView.isLoading).toBe(false);
    });
});
