import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetDealersApiParameter } from "@insite/client-framework/Services/DealerService";
import LocationFinderState from "@insite/client-framework/Store/Pages/LocationFinder/LocationFinderState";
import { Draft } from "immer";

const initialState: LocationFinderState = {};

const reducer = {
    "Pages/LocationFinder/BeginLoadDealers": (
        draft: Draft<LocationFinderState>,
        action: { parameter: GetDealersApiParameter },
    ) => {
        draft.getDealersParameter = action.parameter;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
