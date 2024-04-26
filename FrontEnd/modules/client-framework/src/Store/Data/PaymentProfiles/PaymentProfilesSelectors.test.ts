import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getPaymentProfilesDataView } from "@insite/client-framework/Store/Data/PaymentProfiles/PaymentProfilesSelectors";
import RecursivePartial from "@insite/mobius/utilities/RecursivePartial";

describe("getPaymentProfilesDataView selector", () => {
    const initializeState = () => {
        const returnState: RecursivePartial<ApplicationState> = {
            data: {
                paymentProfiles: {
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

        const dataView = getPaymentProfilesDataView(state, { page: 1 });
        expect(dataView.isLoading).toBe(false);
    });
});
