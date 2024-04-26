import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { AccountShipTosState } from "@insite/client-framework/Store/Data/AccountShipTos/AccountShipTosState";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import { AccountShipToCollectionModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: AccountShipTosState = {
    dataViews: {},
};

const reducer = {
    "Data/AccountShipTos/BeginLoadAccountShipToCollection": (
        draft: Draft<AccountShipTosState>,
        action: { parameter: object },
    ) => {
        draft.dataViews[getDataViewKey(action.parameter)] = {
            isLoading: true,
            pagination: null,
        };
    },
    "Data/AccountShipTos/CompleteLoadAccountShipToCollection": (
        draft: Draft<AccountShipTosState>,
        action: { parameter: object; collection: AccountShipToCollectionModel },
    ) => {
        const dataView = {
            isLoading: false,
            value: action.collection.userShipToCollection!,
            pagination: action.collection.pagination,
        };

        draft.dataViews[getDataViewKey(action.parameter)] = dataView;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
