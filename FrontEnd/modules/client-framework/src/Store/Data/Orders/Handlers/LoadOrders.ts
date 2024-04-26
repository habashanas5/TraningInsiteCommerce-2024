import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getOrders, GetOrdersApiParameter } from "@insite/client-framework/Services/OrderService";
import { OrderCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetOrdersApiParameter, OrderCollectionModel>;

export const DispatchBeginLoadOrders: HandlerType = props => {
    props.dispatch({
        type: "Data/Orders/BeginLoadOrders",
        parameter: props.parameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getOrders(props.apiParameter);
};

export const DispatchCompleteLoadOrders: HandlerType = props => {
    props.dispatch({
        type: "Data/Orders/CompleteLoadOrders",
        collection: props.apiResult,
        parameter: props.parameter,
    });
};

export const chain = [PopulateApiParameter, DispatchBeginLoadOrders, RequestDataFromApi, DispatchCompleteLoadOrders];

const loadOrders = createHandlerChainRunner(chain, "LoadOrders");
export default loadOrders;
