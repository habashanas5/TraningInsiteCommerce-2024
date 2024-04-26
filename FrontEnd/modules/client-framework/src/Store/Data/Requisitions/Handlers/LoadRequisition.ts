import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getRequisition, GetRequisitionApiParameter } from "@insite/client-framework/Services/RequisitionService";
import { RequisitionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetRequisitionApiParameter, RequisitionModel>;

export const DispatchBeginLoadRequisition: HandlerType = props => {
    props.dispatch({
        type: "Data/Requisitions/BeginLoadRequisition",
        requisitionId: props.parameter.requisitionId,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    try {
        props.apiResult = await getRequisition(props.apiParameter);
    } catch (error) {
        if ("status" in error && (error.status === 400 || error.status === 404)) {
            props.dispatch({
                type: "Data/Requisitions/FailedToLoadRequisition",
                requisitionId: props.parameter.requisitionId,
                status: 404,
            });
            return false;
        }
        throw error;
    }
};

export const DispatchCompleteLoadRequisition: HandlerType = props => {
    props.dispatch({
        type: "Data/Requisitions/CompleteLoadRequisition",
        requisition: props.apiResult,
    });
};

export const chain = [
    DispatchBeginLoadRequisition,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadRequisition,
];

const loadRequisition = createHandlerChainRunner(chain, "LoadRequisition");
export default loadRequisition;
