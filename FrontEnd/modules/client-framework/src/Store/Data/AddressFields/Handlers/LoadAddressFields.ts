import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
} from "@insite/client-framework/HandlerCreator";
import { getAddressFields, GetAddressFieldsApiParameter } from "@insite/client-framework/Services/WebsiteService";
import { AddressFieldCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<{}, GetAddressFieldsApiParameter, AddressFieldCollectionModel>;

export const DispatchBeginLoadAddressField: HandlerType = props => {
    props.dispatch({
        type: "Data/AddressFields/BeginLoadAddressFields",
        parameter: props.parameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getAddressFields(props.apiParameter);
};

export const DispatchCompleteLoadAddressField: HandlerType = props => {
    props.dispatch({
        type: "Data/AddressFields/CompleteLoadAddressFields",
        collection: props.apiResult,
        parameter: props.parameter,
    });
};

export const chain = [
    DispatchBeginLoadAddressField,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadAddressField,
];

const loadAddressFields = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadAddressFields");
export default loadAddressFields;
