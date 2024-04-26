import { WriteableState } from "@insite/client-framework/Store/ApplicationState";
import DataState from "@insite/client-framework/Store/Data/DataState";
import RecursivePartial from "@insite/mobius/utilities/RecursivePartial";

export const withDataByIdState = <T>(
    useState: () => WriteableState,
    key: keyof Omit<DataState, "accountShipTos" | "addressFields" | "budgets" | "budgetCalendars">,
    id: string,
    value: RecursivePartial<T> = {},
) => {
    const state = useState();
    if (!state.data) {
        state.data = {};
    }
    if (!state.data[key]) {
        state.data[key] = {
            isLoading: {},
            byId: {},
            errorStatusCodeById: {},
            dataViews: {},
        };
    }
    state.data[key]!.byId![id] = value;
};
