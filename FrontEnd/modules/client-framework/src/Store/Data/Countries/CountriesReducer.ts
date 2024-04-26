import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetCurrentCountriesApiParameter } from "@insite/client-framework/Services/WebsiteService";
import { CountriesState } from "@insite/client-framework/Store/Data/Countries/CountriesState";
import { setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { CountryCollectionModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: CountriesState = {
    isLoading: {},
    byId: {},
    dataViews: {},
};

const reducer = {
    "Data/Countries/BeginLoadCountries": (
        draft: Draft<CountriesState>,
        action: { parameter: GetCurrentCountriesApiParameter },
    ) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/Countries/CompleteLoadCountries": (
        draft: Draft<CountriesState>,
        action: { parameter: GetCurrentCountriesApiParameter; collection: CountryCollectionModel },
    ) => {
        setDataViewLoaded(draft, action.parameter, action.collection, collection => collection.countries!);
    },

    "Data/Countries/Reset": () => {
        return initialState;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
