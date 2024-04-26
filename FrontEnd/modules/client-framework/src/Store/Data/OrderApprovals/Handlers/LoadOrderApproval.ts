import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getOrderApproval, GetOrderApprovalApiParameter } from "@insite/client-framework/Services/OrderApprovalService";
import { CartModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetOrderApprovalApiParameter, CartModel>;

export const DispatchBeginLoadingOrderApproval: HandlerType = props => {
    props.dispatch({
        type: "Data/OrderApprovals/BeginLoadingOrderApproval",
        cartId: props.parameter.cartId,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    const result = await getOrderApproval(props.apiParameter);
    if (result.successful) {
        props.apiResult = result.result;
    }
};

export const DispatchCompleteLoadingOrderApproval: HandlerType = props => {
    props.dispatch({
        type: "Data/OrderApprovals/CompleteLoadingOrderApproval",
        model: props.apiResult,
    });
};

export const chain = [
    PopulateApiParameter,
    DispatchBeginLoadingOrderApproval,
    RequestDataFromApi,
    DispatchCompleteLoadingOrderApproval,
];

const loadOrderApproval = createHandlerChainRunner(chain, "LoadOrderApproval");
export default loadOrderApproval;
