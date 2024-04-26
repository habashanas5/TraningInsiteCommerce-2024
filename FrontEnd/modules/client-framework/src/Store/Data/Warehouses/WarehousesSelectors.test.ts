import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { DataView } from "@insite/client-framework/Store/Data/DataState";
import { getWarehousesDataView } from "@insite/client-framework/Store/Data/Warehouses/WarehousesSelectors";
import RecursivePartial from "@insite/mobius/utilities/RecursivePartial";

describe("Warehouses Selectors", () => {
    const initializeState = () => {
        const returnState: RecursivePartial<ApplicationState> = {
            data: {
                warehouses: {
                    dataViews: {
                        "latitude=1&longitude=1&search=product": {
                            isLoading: true,
                        },
                    },
                },
            },
        };
        return returnState as ApplicationState;
    };

    test("Warehouses Dataview isLoading property is false", () => {
        const state = initializeState();

        const dataView = getWarehousesDataView(state, { search: "product", longitude: 1, latitude: 1 });
        expect(dataView.isLoading).toBe(true);
    });
});
