import {
    createHandlerChainRunner,
    Handler,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { deleteRequisitionLine as deleteRequisitionLineApi } from "@insite/client-framework/Services/RequisitionService";
import loadRequisitions from "@insite/client-framework/Store/Data/Requisitions/Handlers/LoadRequisitions";

type HandlerType = Handler<{
    requisitionId: string;
    requisitionLineId: string;
    onSuccess?: () => void;
}>;

export const DispatchBeginRemoveRequisitionLine: HandlerType = props => {
    props.dispatch({
        type: "Pages/Requisitions/BeginRemoveRequisitionLine",
    });
};

export const RequestRemoveRequisitionLine: HandlerType = async props => {
    await deleteRequisitionLineApi({
        requisitionId: props.parameter.requisitionId,
        requisitionLineId: props.parameter.requisitionLineId,
    });
};

export const ResetRequisitionsData: HandlerType = props => {
    props.dispatch({
        type: "Data/Requisitions/Reset",
    });
};

export const DispatchCompleteRemoveRequisitionLine: HandlerType = props => {
    props.dispatch({
        type: "Pages/Requisitions/CompleteRemoveRequisitionLine",
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.();
};

export const chain = [
    DispatchBeginRemoveRequisitionLine,
    RequestRemoveRequisitionLine,
    ResetRequisitionsData,
    DispatchCompleteRemoveRequisitionLine,
    ExecuteOnSuccessCallback,
];

const deleteRequisitionLine = createHandlerChainRunner(chain, "DeleteRequisitionLine");
export default deleteRequisitionLine;
