import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { GetShipTosApiParameter } from "@insite/client-framework/Services/CustomersService";
import { assignById, setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { ShipTosState } from "@insite/client-framework/Store/Data/ShipTos/ShipTosState";
import { ShipToCollectionModel, ShipToModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: ShipTosState = {
    isLoading: {},
    byId: {},
    dataViews: {},
};

const reducer = {
    "Data/ShipTos/BeginLoadShipTos": (draft: Draft<ShipTosState>, action: { parameter: GetShipTosApiParameter }) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/ShipTos/CompleteLoadShipTos": (
        draft: Draft<ShipTosState>,
        action: { parameter: GetShipTosApiParameter; collection: ShipToCollectionModel },
    ) => {
        setDataViewLoaded(draft, action.parameter, action.collection, collection => collection.shipTos!);
    },

    "Data/ShipTos/BeginLoadShipTo": (draft: Draft<ShipTosState>, action: { id: string }) => {
        draft.isLoading[action.id] = true;
    },

    "Data/ShipTos/CompleteLoadShipTo": (
        draft: Draft<ShipTosState>,
        action: { model: ShipToModel; isCurrent?: boolean },
    ) => {
        if (action.isCurrent) {
            delete draft.isLoading[API_URL_CURRENT_FRAGMENT];
            draft.currentId = action.model.id;
        } else {
            delete draft.isLoading[action.model.id];
        }
        assignById(draft, action.model);
    },

    "Data/ShipTos/ResetDataViews": (draft: Draft<ShipTosState>) => {
        draft.dataViews = {};
    },

    "Data/ShipTos/Reset": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
