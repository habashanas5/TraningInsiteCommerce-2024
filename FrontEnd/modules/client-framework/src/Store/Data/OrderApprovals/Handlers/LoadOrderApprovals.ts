import { ApiHandler, createHandlerChainRunnerOptionalParameter } from "@insite/client-framework/HandlerCreator";
import {
    getOrderApprovals,
    GetOrderApprovalsApiParameter,
} from "@insite/client-framework/Services/OrderApprovalService";
import { OrderApprovalCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetOrderApprovalsApiParameter, OrderApprovalCollectionModel>;

export const DispatchBeginLoadingOrderApprovals: HandlerType = props => {
    props.dispatch({
        type: "Data/OrderApprovals/BeginLoadingOrderApprovals",
        parameter: props.parameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    const result = await getOrderApprovals(props.apiParameter);
    if (result.successful) {
        props.apiResult = result.result;
    }
};

export const DispatchCompleteLoadingOrderApprovals: HandlerType = props => {
    props.dispatch({
        type: "Data/OrderApprovals/CompleteLoadingOrderApprovals",
        collection: props.apiResult,
        parameter: props.parameter,
    });
};

export const chain = [
    PopulateApiParameter,
    DispatchBeginLoadingOrderApprovals,
    RequestDataFromApi,
    DispatchCompleteLoadingOrderApprovals,
];

const loadOrderApprovals = createHandlerChainRunnerOptionalParameter(chain, {}, "LoadOrderApprovals");
export default loadOrderApprovals;
