import { GetCurrentCountriesApiParameter } from "@insite/client-framework/Services/WebsiteService";
import CountriesReducer from "@insite/client-framework/Store/Data/Countries/CountriesReducer";
import { CountriesState } from "@insite/client-framework/Store/Data/Countries/CountriesState";
import { getDataViewKey } from "@insite/client-framework/Store/Data/DataState";
import { ExpectedState } from "@insite/client-framework/Store/Data/ReducerTestHelper";
import { CountryCollectionModel, CountryModel } from "@insite/client-framework/Types/ApiModels";

describe("CountriesReducer", () => {
    const mockCountryModel = returnCountryModel();
    const parameter: GetCurrentCountriesApiParameter = {
        expand: ["states"],
    };
    const key = getDataViewKey(parameter);
    const collection: CountryCollectionModel = {
        uri: "testURI",
        properties: {},
        countries: [mockCountryModel],
    };
    let initialState: CountriesState;
    beforeEach(() => {
        initialState = {
            isLoading: {},
            byId: {},
            dataViews: {},
        };
    });

    test("dataViews property whose isLoading is true", () => {
        const type = "Data/Countries/BeginLoadCountries";
        const action = {
            type,
            parameter,
        } as any;
        const expectedState = new ExpectedState(initialState).setStateDataViewLoading(parameter).getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = CountriesReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews[key].isLoading).toBe(true);
        expect(actualState).toEqual(expectedState);
    });

    test("Should return a CountriesState object with a loaded dataViews property", () => {
        const type = "Data/Countries/CompleteLoadCountries";
        const action = {
            type,
            parameter,
            collection,
        } as any;
        const expectedState = new ExpectedState(initialState)
            .setStateDataViewLoaded(parameter, collection, "countries")
            .getState();
        delete expectedState.dataViews[key].fetchedDate;

        const actualState = CountriesReducer(undefined, action) as any;
        delete actualState.dataViews[key].fetchedDate;

        expect(actualState.dataViews).toBeTruthy();
        expect(actualState).toEqual(expectedState);
    });

    test("Reset return initialState object", () => {
        const type = "Data/Countries/Reset";
        const action = {
            type,
        } as any;

        const actualState = CountriesReducer(undefined, action) as any;

        expect(actualState).toEqual(initialState);
    });
});

function returnCountryModel(): CountryModel {
    return {
        uri: "testURI",
        properties: {},
        abbreviation: "test",
        id: "testID",
        name: "test",
        states: null,
    };
}
