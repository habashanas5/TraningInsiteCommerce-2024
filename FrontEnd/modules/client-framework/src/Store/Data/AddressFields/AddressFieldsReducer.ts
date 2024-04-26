import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetAddressFieldsApiParameter } from "@insite/client-framework/Services/WebsiteService";
import { AddressFieldsState } from "@insite/client-framework/Store/Data/AddressFields/AddressFieldsState";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import { AddressFieldCollectionModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: AddressFieldsState = {
    dataViews: {},
};

const reducer = {
    "Data/AddressFields/BeginLoadAddressFields": (
        draft: Draft<AddressFieldsState>,
        action: { parameter: GetAddressFieldsApiParameter },
    ) => {
        draft.dataViews[getDataViewKey(action.parameter)] = {
            isLoading: true,
            fetchedDate: new Date(),
        };
    },

    "Data/AddressFields/CompleteLoadAddressFields": (
        draft: Draft<AddressFieldsState>,
        action: { parameter: GetAddressFieldsApiParameter; collection: AddressFieldCollectionModel },
    ) => {
        const dataView = {
            isLoading: false,
            value: {
                shipToAddressFields: action.collection.shipToAddressFields!,
                billToAddressFields: action.collection.billToAddressFields!,
            },
            fetchedDate: new Date(),
        };

        draft.dataViews[getDataViewKey(action.parameter)] = dataView;
    },

    "Data/AddressFields/Reset": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
