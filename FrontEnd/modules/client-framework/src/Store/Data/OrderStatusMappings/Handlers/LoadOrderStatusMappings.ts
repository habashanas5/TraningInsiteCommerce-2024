import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunnerOptionalParameter,
} from "@insite/client-framework/HandlerCreator";
import {
    getOrderStatusMappings,
    GetOrderStatusMappingsApiParameter,
} from "@insite/client-framework/Services/OrderService";
import { OrderStatusMappingCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    {},
    GetOrderStatusMappingsApiParameter,
    OrderStatusMappingCollectionModel
>;

export const DispatchBeginLoadOrderStatusMapping: HandlerType = props => {
    props.dispatch({
        type: "Data/OrderStatusMappings/BeginLoadOrderStatusMappings",
        parameter: props.parameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {};
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getOrderStatusMappings(props.apiParameter);
};

export const DispatchCompleteLoadOrderStatusMapping: HandlerType = props => {
    props.dispatch({
        type: "Data/OrderStatusMappings/CompleteLoadOrderStatusMappings",
        collection: props.apiResult,
        parameter: props.parameter,
    });
};

export const chain = [
    DispatchBeginLoadOrderStatusMapping,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadOrderStatusMapping,
];

const loadOrderStatusMappings = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadOrderStatusMappings");
export default loadOrderStatusMappings;
