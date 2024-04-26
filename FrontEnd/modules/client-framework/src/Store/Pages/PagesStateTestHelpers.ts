import { WriteableState } from "@insite/client-framework/Store/ApplicationState";
import PagesState from "@insite/client-framework/Store/Pages/PagesState";
import RecursivePartial from "@insite/mobius/utilities/RecursivePartial";

export const withPagesState = <T>(
    useState: () => WriteableState,
    key: keyof PagesState,
    value: RecursivePartial<T> = {},
) => {
    const state = useState();
    if (!state.pages) {
        state.pages = {};
    }
    state.pages[key] = value;
};
