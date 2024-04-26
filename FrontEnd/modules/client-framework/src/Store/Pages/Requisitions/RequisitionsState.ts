import { GetRequisitionsApiParameter } from "@insite/client-framework/Services/RequisitionService";

export default interface RequisitionsState {
    getRequisitionsParameter: GetRequisitionsApiParameter;
    selectedRequisitionIds: string[];
    expandedRequisitionIds: string[];
    isEditing: boolean;
}
