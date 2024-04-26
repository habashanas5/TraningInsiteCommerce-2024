import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetDealersApiParameter } from "@insite/client-framework/Services/DealerService";
import { assignById, setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { DealersDataView, DealersState } from "@insite/client-framework/Store/Data/Dealers/DealersState";
import { DealerCollectionModel, DealerModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: DealersState = {
    isLoading: {},
    byId: {},
    dataViews: {},
    defaultLocation: {
        latitude: 0,
        longitude: 0,
    },
};

const reducer = {
    "Data/Dealers/BeginLoadDealers": (draft: Draft<DealersState>, action: { parameter: GetDealersApiParameter }) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/Dealers/CompleteLoadDealers": (
        draft: Draft<DealersState>,
        action: { parameter: GetDealersApiParameter; collection: DealerCollectionModel },
    ) => {
        if (
            draft.defaultLocation.latitude !== action.collection.defaultLatitude ||
            draft.defaultLocation.longitude !== action.collection.defaultLongitude
        ) {
            draft.defaultLocation = {
                latitude: action.collection.defaultLatitude,
                longitude: action.collection.defaultLongitude,
            };
        }
        setDataViewLoaded(
            draft,
            action.parameter,
            action.collection,
            collection => collection.dealers!,
            undefined,
            (dataView: Draft<DealersDataView>) => {
                dataView.defaultLatitude = action.collection.defaultLatitude;
                dataView.defaultLongitude = action.collection.defaultLongitude;
                dataView.defaultRadius = action.collection.defaultRadius;
                dataView.distanceUnitOfMeasure = action.collection.distanceUnitOfMeasure;
            },
        );
    },

    "Data/Dealers/BeginLoadDealer": (draft: Draft<DealersState>, action: { id: string }) => {
        draft.isLoading[action.id] = true;
    },

    "Data/Dealers/CompleteLoadDealer": (draft: Draft<DealersState>, action: { model: DealerModel }) => {
        delete draft.isLoading[action.model.id];
        assignById(draft, action.model);
    },

    "Data/Dealers/Reset": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
