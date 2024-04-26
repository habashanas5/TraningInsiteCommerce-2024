import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { GetOrderApiParameter } from "@insite/client-framework/Services/OrderService";
import loadApprovalCart from "@insite/client-framework/Store/Data/OrderApprovals/Handlers/LoadOrderApproval";
import { getOrderApprovalsState } from "@insite/client-framework/Store/Data/OrderApprovals/OrderApprovalsSelectors";
import loadPromotions from "@insite/client-framework/Store/Data/Promotions/Handlers/LoadPromotions";
import { getPromotionsDataView } from "@insite/client-framework/Store/Data/Promotions/PromotionsSelectors";
import { OrderModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<{ cartId: string }, GetOrderApiParameter, OrderModel>;

export const DispatchSetOrderId: HandlerType = props => {
    props.dispatch({
        type: "Pages/OrderApprovalDetails/SetCartId",
        cartId: props.parameter.cartId,
    });
};

export const DispatchLoadOrderIfNeeded: HandlerType = props => {
    const orderApprovalsState = getOrderApprovalsState(props.getState(), props.parameter.cartId);
    if (
        !orderApprovalsState.value ||
        !orderApprovalsState.value.billTo ||
        !orderApprovalsState.value.shipTo ||
        orderApprovalsState.value.cartLines?.length === 0
    ) {
        props.dispatch(loadApprovalCart(props.parameter));
    }
};

export const PreloadData: HandlerType = props => {
    const state = props.getState();
    const promotionsState = getPromotionsDataView(state, props.parameter.cartId);
    if (!promotionsState.value && !promotionsState.isLoading) {
        props.dispatch(loadPromotions({ cartId: props.parameter.cartId }));
    }
};

export const chain = [DispatchSetOrderId, DispatchLoadOrderIfNeeded, PreloadData];

const displayOrder = createHandlerChainRunner(chain, "DisplayOrder");
export default displayOrder;
