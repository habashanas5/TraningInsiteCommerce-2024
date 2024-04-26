import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetOrderApprovalsApiParameter } from "@insite/client-framework/Services/OrderApprovalService";
import { assignById, setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { OrderApprovalsState } from "@insite/client-framework/Store/Data/OrderApprovals/OrderApprovalsState";
import { CartModel, OrderApprovalCollectionModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: OrderApprovalsState = {
    isLoading: {},
    byId: {},
    dataViews: {},
};

const reducer = {
    "Data/OrderApprovals/BeginLoadingOrderApprovals": (
        draft: Draft<OrderApprovalsState>,
        action: { parameter: GetOrderApprovalsApiParameter },
    ) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/OrderApprovals/CompleteLoadingOrderApprovals": (
        draft: Draft<OrderApprovalsState>,
        action: {
            parameter: GetOrderApprovalsApiParameter;
            collection: OrderApprovalCollectionModel;
        },
    ) => {
        setDataViewLoaded(draft, action.parameter, action.collection, collection => collection.cartCollection!);
    },

    "Data/OrderApprovals/Reset": () => {
        return initialState;
    },

    "Data/OrderApprovals/BeginLoadingOrderApproval": (
        draft: Draft<OrderApprovalsState>,
        action: { cartId: string },
    ) => {
        draft.isLoading[action.cartId] = true;
    },

    "Data/OrderApprovals/CompleteLoadingOrderApproval": (
        draft: Draft<OrderApprovalsState>,
        action: { model: CartModel },
    ) => {
        delete draft.isLoading[action.model.id];
        assignById(draft, action.model);
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
