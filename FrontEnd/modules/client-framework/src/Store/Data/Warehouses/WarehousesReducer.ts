import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetWarehousesApiParameter } from "@insite/client-framework/Services/WarehouseService";
import { setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { WarehousesDataView, WarehousesState } from "@insite/client-framework/Store/Data/Warehouses/WarehousesState";
import { WarehouseCollectionModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: WarehousesState = {
    isLoading: {},
    byId: {},
    dataViews: {},
};

const reducer = {
    "Data/Warehouses/BeginLoadWarehouses": (
        draft: Draft<WarehousesState>,
        action: { parameter: GetWarehousesApiParameter },
    ) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/Warehouses/CompleteLoadWarehouses": (
        draft: Draft<WarehousesState>,
        action: { parameter: GetWarehousesApiParameter; collection: WarehouseCollectionModel },
    ) => {
        setDataViewLoaded(
            draft,
            action.parameter,
            action.collection,
            collection => collection.warehouses!,
            undefined,
            (dataView: Draft<WarehousesDataView>) => {
                dataView.defaultLatitude = action.collection.defaultLatitude;
                dataView.defaultLongitude = action.collection.defaultLongitude;
                dataView.defaultRadius = action.collection.defaultRadius;
                dataView.distanceUnitOfMeasure = action.collection.distanceUnitOfMeasure;
            },
        );
    },

    "Data/Warehouses/Reset": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
