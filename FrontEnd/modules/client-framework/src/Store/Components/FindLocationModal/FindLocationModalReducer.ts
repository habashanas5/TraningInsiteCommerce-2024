import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetWarehousesApiParameter } from "@insite/client-framework/Services/WarehouseService";
import FindLocationModalState from "@insite/client-framework/Store/Components/FindLocationModal/FindLocationModalState";
import { Draft } from "immer";

const initialState: FindLocationModalState = {};

const reducer = {
    "Components/FindLocationModal/BeginLoadWarehouses": (
        draft: Draft<FindLocationModalState>,
        action: { parameter: GetWarehousesApiParameter },
    ) => {
        draft.getWarehousesParameter = action.parameter;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
