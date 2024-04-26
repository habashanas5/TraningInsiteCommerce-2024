import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnError,
} from "@insite/client-framework/HandlerCreator";
import { getOrder, GetOrderApiParameter } from "@insite/client-framework/Services/OrderService";
import { OrderModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    {
        orderNumber: string;
        sTEmail: string;
        sTPostalCode: string;
    } & HasOnError<string>,
    GetOrderApiParameter,
    OrderModel
>;

export const DispatchBeginLoadOrder: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderStatus/BeginLoadOrder",
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        orderNumber: props.parameter.orderNumber,
        sTEmail: props.parameter.sTEmail,
        sTPostalCode: props.parameter.sTPostalCode,
        expand: ["orderLines", "shipments"],
    };
};

export const RequestDataFromApi: HandlerType = async props => {
    try {
        props.apiResult = await getOrder(props.apiParameter);
    } catch (error) {
        if (error.status === 404) {
            props.parameter.onError?.(error.errorMessage);
            return;
        }
        throw error;
    }
};

export const DispatchCompleteLoadOrder: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderStatus/CompleteLoadOrder",
        order: props.apiResult,
    });
};

export const chain = [DispatchBeginLoadOrder, PopulateApiParameter, RequestDataFromApi, DispatchCompleteLoadOrder];

const loadOrder = createHandlerChainRunner(chain, "LoadOrder");
export default loadOrder;
