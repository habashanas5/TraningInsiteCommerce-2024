import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { API_URL_CURRENT_FRAGMENT } from "@insite/client-framework/Services/ApiService";
import { addLineCollection } from "@insite/client-framework/Services/CartService";
import { getOrder } from "@insite/client-framework/Services/OrderService";
import loadCurrentCart from "@insite/client-framework/Store/Data/Carts/Handlers/LoadCurrentCart";
import { CartLineCollectionModel, CartLineModel, OrderModel } from "@insite/client-framework/Types/ApiModels";

interface ReorderParameter {
    orderNumber: string;
    onSuccess?: () => void;
}

export interface ReorderResult {
    order: OrderModel;
    cartLines?: CartLineCollectionModel;
}

type HandlerType = ApiHandlerDiscreteParameter<ReorderParameter, CartLineCollectionModel, ReorderResult>;

export const DispatchBeginReorder: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderHistory/BeginReorder",
        orderNumber: props.parameter.orderNumber,
    });
};

export const FetchOrderWithLines: HandlerType = async props => {
    const order = await getOrder({ orderNumber: props.parameter.orderNumber, expand: ["orderLines"] });
    props.apiResult = { order };
};

export const PopulateApiParameter: HandlerType = props => {
    if (!props.apiResult.order) {
        return false;
    }

    props.apiParameter = {
        cartLines: props.apiResult.order.orderLines!.map(
            line =>
                ({
                    productId: line.productId,
                    qtyOrdered: line.qtyOrdered,
                    unitOfMeasure: line.unitOfMeasure,
                } as CartLineModel),
        ),
    } as CartLineCollectionModel;
};

export const SendDataToApi: HandlerType = async props => {
    props.apiResult.cartLines = await addLineCollection({
        cartId: API_URL_CURRENT_FRAGMENT,
        cartLineCollection: props.apiParameter,
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.();
};

export const DispatchCompleteReorder: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderHistory/CompleteReorder",
        orderNumber: props.parameter.orderNumber,
    });
};

export const LoadCart: HandlerType = props => {
    props.dispatch(loadCurrentCart());
};

export const chain = [
    DispatchBeginReorder,
    FetchOrderWithLines,
    PopulateApiParameter,
    SendDataToApi,
    ExecuteOnSuccessCallback,
    LoadCart,
    DispatchCompleteReorder,
];

const reorder = createHandlerChainRunner(chain, "Reorder");
export default reorder;
