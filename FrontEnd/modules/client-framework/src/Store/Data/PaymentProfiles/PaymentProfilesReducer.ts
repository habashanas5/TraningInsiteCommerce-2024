import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetPaymentProfilesApiParameter } from "@insite/client-framework/Services/AccountService";
import { setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { PaymentProfilesState } from "@insite/client-framework/Store/Data/PaymentProfiles/PaymentProfilesState";
import { AccountPaymentProfileCollectionModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: PaymentProfilesState = {
    isLoading: {},
    byId: {},
    dataViews: {},
};

const reducer = {
    "Data/PaymentProfiles/BeginLoadPaymentProfiles": (
        draft: Draft<PaymentProfilesState>,
        action: { parameter: GetPaymentProfilesApiParameter },
    ) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/PaymentProfiles/CompleteLoadPaymentProfiles": (
        draft: Draft<PaymentProfilesState>,
        action: { parameter: GetPaymentProfilesApiParameter; collection: AccountPaymentProfileCollectionModel },
    ) => {
        setDataViewLoaded(draft, action.parameter, action.collection, collection => collection.accountPaymentProfiles!);
    },

    "Data/PaymentProfiles/Reset": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
