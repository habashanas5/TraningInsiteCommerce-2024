import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetOrdersApiParameter } from "@insite/client-framework/Services/OrderService";
import { setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { OrdersState } from "@insite/client-framework/Store/Data/Orders/OrdersState";
import { OrderCollectionModel, OrderModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: OrdersState = {
    isLoading: {},
    idByOrderNumber: {},
    byId: {},
    dataViews: {},
    errorStatusCodeById: {},
};

const reducer = {
    "Data/Orders/BeginLoadOrders": (draft: Draft<OrdersState>, action: { parameter: GetOrdersApiParameter }) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/Orders/CompleteLoadOrders": (
        draft: Draft<OrdersState>,
        action: { parameter: GetOrdersApiParameter; collection: OrderCollectionModel },
    ) => {
        setDataViewLoaded(
            draft,
            action.parameter,
            action.collection,
            collection => collection.orders!,
            order => storeIdByOrderNumber(draft, order),
        );
    },

    "Data/Orders/BeginLoadOrder": (draft: Draft<OrdersState>, action: { orderNumber: string }) => {
        draft.isLoading[action.orderNumber] = true;
    },

    "Data/Orders/CompleteLoadOrder": (draft: Draft<OrdersState>, action: { model: OrderModel }) => {
        delete draft.isLoading[action.model.webOrderNumber];
        delete draft.isLoading[action.model.erpOrderNumber];
        draft.byId[action.model.id] = action.model;
        storeIdByOrderNumber(draft, action.model);
        if (draft.errorStatusCodeById) {
            delete draft.errorStatusCodeById[action.model.webOrderNumber];
            delete draft.errorStatusCodeById[action.model.erpOrderNumber];
        }
    },

    "Data/Orders/FailedToLoadOrder": (draft: Draft<OrdersState>, action: { orderNumber: string; status: number }) => {
        delete draft.isLoading[action.orderNumber];
        if (draft.errorStatusCodeById) {
            draft.errorStatusCodeById[action.orderNumber] = action.status;
        }
    },

    "Data/Orders/Reset": () => {
        return initialState;
    },
};

function storeIdByOrderNumber(draft: Draft<OrdersState>, order: OrderModel) {
    if (order.erpOrderNumber) {
        draft.idByOrderNumber[order.erpOrderNumber] = order.id;
    }
    if (order.webOrderNumber) {
        draft.idByOrderNumber[order.webOrderNumber] = order.id;
    }
}

export default createTypedReducerWithImmer(initialState, reducer);
