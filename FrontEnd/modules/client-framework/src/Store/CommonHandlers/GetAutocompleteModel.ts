import getBoldedText from "@insite/client-framework/Common/Utilities/getPatternBolded";
import { trackSearchResultEvent } from "@insite/client-framework/Common/Utilities/tracking";
import {
    ApiHandler,
    createHandlerChainRunner,
    HasOnSuccess,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { AutocompleteApiParameter, autocompleteSearch } from "@insite/client-framework/Services/AutocompleteService";
import { AutocompleteModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<AutocompleteApiParameter & HasOnSuccess<AutocompleteModel>, AutocompleteModel>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = props.parameter;
};

export const RequestDataFromApi: HandlerType = async props => {
    if (props.apiParameter.query.length >= 3) {
        props.apiResult = await autocompleteSearch(props.apiParameter);
    }
};

export const SetDisplayTitles: HandlerType = props => {
    if (props.apiResult) {
        if (props.apiResult.products) {
            props.apiResult.products.forEach(product => {
                product.displayTitle = getBoldedText(product.title, props.apiParameter.query);
                product.displayErpNumber = getBoldedText(product.erpNumber, props.apiParameter.query);
            });
        }
        if (props.apiResult.brands) {
            props.apiResult.brands.forEach(brand => {
                brand.displayTitle = getBoldedText(brand.title, props.apiParameter.query);
                if (brand.productLineName) {
                    brand.displayProductLineName = getBoldedText(brand.productLineName, props.apiParameter.query);
                }
            });
        }
        if (props.apiResult.content) {
            props.apiResult.content.forEach(content => {
                content.displayTitle = getBoldedText(content.title, props.apiParameter.query);
            });
        }
        if (props.apiResult.categories) {
            props.apiResult.categories.forEach(category => {
                category.displayTitle = getBoldedText(category.title, props.apiParameter.query);
                if (category.subtitle) {
                    category.displaySubtitle = getBoldedText(category.subtitle, props.apiParameter.query);
                }
            });
        }
    }
};

export const SendTracking: HandlerType = props => {
    if (props.apiResult?.products?.length === 1) {
        trackSearchResultEvent(props.apiParameter.query, 1);
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.(props.apiResult);
};

export const chain = [
    PopulateApiParameter,
    RequestDataFromApi,
    SetDisplayTitles,
    SendTracking,
    ExecuteOnSuccessCallback,
];

const getAutocompleteModel = createHandlerChainRunner(chain, "GetAutocompleteModel");
export default getAutocompleteModel;
