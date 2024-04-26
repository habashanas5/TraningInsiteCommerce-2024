import {
    createHandlerChainRunner,
    HandlerWithResult,
    HasOnSuccess,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { updateRequisitionLine as updateRequisitionLineApi } from "@insite/client-framework/Services/RequisitionService";
import { RequisitionLineModel } from "@insite/client-framework/Types/ApiModels";

interface UpdateRequisitionLineResult {
    requisitionLine?: RequisitionLineModel;
    errorMessage?: string;
}

type HandlerType = HandlerWithResult<
    {
        requisitionId: string;
        requisitionLineId: string;
        requisitionLine: RequisitionLineModel;
    } & HasOnSuccess,
    UpdateRequisitionLineResult
>;

export const DispatchBeginUpdateRequisitionLine: HandlerType = props => {
    props.dispatch({
        type: "Pages/Requisitions/BeginUpdateRequisitionLine",
    });
};

export const RequestUpdateRequisitionLine: HandlerType = async props => {
    await updateRequisitionLineApi({
        requisitionId: props.parameter.requisitionId,
        requisitionLineId: props.parameter.requisitionLineId,
        requisitionLine: props.parameter.requisitionLine,
    });
};

export const ResetRequisitionsData: HandlerType = props => {
    props.dispatch({
        type: "Data/Requisitions/Reset",
    });
};

export const DispatchCompleteUpdateRequisitionLine: HandlerType = props => {
    props.dispatch({
        type: "Pages/Requisitions/CompleteUpdateRequisitionLine",
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    markSkipOnCompleteIfOnSuccessIsSet(props);
    props.parameter.onSuccess?.();
};

export const chain = [
    DispatchBeginUpdateRequisitionLine,
    RequestUpdateRequisitionLine,
    ResetRequisitionsData,
    DispatchCompleteUpdateRequisitionLine,
    ExecuteOnSuccessCallback,
];

const updateRequisitionLine = createHandlerChainRunner(chain, "UpdateRequisitionLine");
export default updateRequisitionLine;
