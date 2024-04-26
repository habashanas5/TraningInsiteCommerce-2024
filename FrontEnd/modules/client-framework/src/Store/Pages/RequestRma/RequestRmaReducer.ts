import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import RequestRmaState from "@insite/client-framework/Store/Pages/RequestRma/RequestRmaState";
import { OrderLineModel, RmaModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: RequestRmaState = {
    orderLines: [],
    canSendReturnRequest: false,
};

const reducer = {
    "Pages/RequestRma/BeginSendRmaRequest": (draft: Draft<RequestRmaState>) => {
        draft.resultMessage = undefined;
    },
    "Pages/RequestRma/CompleteSendRmaRequest": (draft: Draft<RequestRmaState>, action: { result?: RmaModel }) => {
        draft.resultMessage = action.result?.message;
    },
    "Pages/RequestRma/SetCanSendReturnRequest": (
        draft: Draft<RequestRmaState>,
        action: { canSendReturnRequest: boolean },
    ) => {
        draft.canSendReturnRequest = action.canSendReturnRequest;
    },
    "Pages/RequestRma/SetOrderLines": (draft: Draft<RequestRmaState>, action: { orderLines: OrderLineModel[] }) => {
        draft.orderLines = action.orderLines;
    },
    "Pages/RequestRma/SetReturnNotes": (draft: Draft<RequestRmaState>, action: { returnNotes: string }) => {
        draft.returnNotes = action.returnNotes;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
