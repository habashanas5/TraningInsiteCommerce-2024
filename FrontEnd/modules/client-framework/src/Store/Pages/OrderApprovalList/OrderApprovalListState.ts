import { GetOrderApprovalsApiParameter } from "@insite/client-framework/Services/OrderApprovalService";

export default interface OrderApprovalListState {
    getOrderApprovalsParameter: GetOrderApprovalsApiParameter;
    filtersOpen: boolean;
}
