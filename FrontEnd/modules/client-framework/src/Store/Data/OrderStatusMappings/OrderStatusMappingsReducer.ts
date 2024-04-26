import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetOrderStatusMappingsApiParameter } from "@insite/client-framework/Services/OrderService";
import { setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { OrderStatusMappingsState } from "@insite/client-framework/Store/Data/OrderStatusMappings/OrderStatusMappingsState";
import { OrderStatusMappingCollectionModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: OrderStatusMappingsState = {
    isLoading: {},
    byId: {},
    dataViews: {},
};

const reducer = {
    "Data/OrderStatusMappings/BeginLoadOrderStatusMappings": (
        draft: Draft<OrderStatusMappingsState>,
        action: { parameter: GetOrderStatusMappingsApiParameter },
    ) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/OrderStatusMappings/CompleteLoadOrderStatusMappings": (
        draft: Draft<OrderStatusMappingsState>,
        action: { parameter: GetOrderStatusMappingsApiParameter; collection: OrderStatusMappingCollectionModel },
    ) => {
        setDataViewLoaded(draft, action.parameter, action.collection, collection => collection.orderStatusMappings!);
    },

    "Data/OrderStatusMappings/Reset": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
