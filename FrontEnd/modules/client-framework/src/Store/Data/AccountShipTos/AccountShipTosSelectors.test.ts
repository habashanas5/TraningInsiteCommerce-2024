// import { GetAccountShipToCollectionApiParameter } from "@insite/client-framework/Services/AccountService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getAccountShipTosDataView } from "@insite/client-framework/Store/Data/AccountShipTos/AccountShipTosSelectors";
import RecursivePartial from "@insite/mobius/utilities/RecursivePartial";

describe("getAccountShipTosDataView selector", () => {
    const initializeState = () => {
        const returnState: RecursivePartial<ApplicationState> = {
            data: {
                accountShipTos: {
                    dataViews: {
                        "accountId=123123": {
                            isLoading: false,
                            pagination: null,
                            value: [
                                {
                                    address: "text",
                                    assign: false,
                                    city: "text",
                                    costCode: "text",
                                    id: "testID",
                                    isDefaultShipTo: false,
                                    shipToNumber: "text",
                                    state: "text",
                                },
                            ],
                        },
                    },
                },
            },
        };
        return returnState as ApplicationState;
    };

    test("Dataview isLoading property is false", () => {
        const state = initializeState();

        const dataView = getAccountShipTosDataView(state, { accountId: "123123" });
        expect(dataView.isLoading).toBe(false);
    });

    test("DataView pagination property is null", () => {
        const state = initializeState();

        const dataView = getAccountShipTosDataView(state, { accountId: "123123" });
        expect(dataView.pagination).toBe(null);
    });

    test("Dataview value property is an array", () => {
        const state = initializeState();

        const dataView = getAccountShipTosDataView(state, { accountId: "123123" });
        expect(Array.isArray(dataView.value)).toBe(true);
    });
});
