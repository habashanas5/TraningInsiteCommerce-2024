import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getRequisitions, GetRequisitionsApiParameter } from "@insite/client-framework/Services/RequisitionService";
import { RequisitionCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetRequisitionsApiParameter, RequisitionCollectionModel>;

export const DispatchBeginLoadRequisitions: HandlerType = props => {
    props.dispatch({
        type: "Data/Requisitions/BeginLoadRequisitions",
        parameter: props.parameter,
    });
};

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter };
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getRequisitions(props.apiParameter);
};

export const DispatchCompleteLoadRequisitions: HandlerType = props => {
    props.dispatch({
        type: "Data/Requisitions/CompleteLoadRequisitions",
        collection: props.apiResult,
        parameter: props.parameter,
    });
};

export const chain = [
    DispatchBeginLoadRequisitions,
    PopulateApiParameter,
    RequestDataFromApi,
    DispatchCompleteLoadRequisitions,
];

const loadRequisitions = createHandlerChainRunner(chain, "LoadRequisitions");
export default loadRequisitions;
