import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getCurrentCountries, GetCurrentCountriesApiParameter } from "@insite/client-framework/Services/WebsiteService";
import { CountryCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetCurrentCountriesApiParameter, CountryCollectionModel>;

export const DispatchBeginLoadCountries: HandlerType = props => {
    props.dispatch({
        type: "Data/Countries/BeginLoadCountries",
        parameter: props.parameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getCurrentCountries(props.apiParameter);
};

export const DispatchCompleteLoadCountries: HandlerType = props => {
    props.dispatch({
        type: "Data/Countries/CompleteLoadCountries",
        parameter: props.parameter,
        collection: props.apiResult,
    });
};

export const chain = [
    DispatchBeginLoadCountries,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadCountries,
];

const loadCountries = createHandlerChainRunner(chain, "LoadCountries");
export default loadCountries;
