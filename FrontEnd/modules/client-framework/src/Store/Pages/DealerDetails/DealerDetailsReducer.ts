import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import DealerDetailsState from "@insite/client-framework/Store/Pages/DealerDetails/DealerDetailsState";
import { Draft } from "immer";

const initialState: DealerDetailsState = {};

const reducer = {
    "Pages/SavedOrderDetails/SetDealerId": (draft: Draft<DealerDetailsState>, action: { dealerId: string }) => {
        draft.dealerId = action.dealerId;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
