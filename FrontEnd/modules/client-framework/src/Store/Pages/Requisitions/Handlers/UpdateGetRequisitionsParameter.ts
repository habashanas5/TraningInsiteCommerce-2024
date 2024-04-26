import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { GetRequisitionsApiParameter } from "@insite/client-framework/Services/RequisitionService";

type HandlerType = Handler<Partial<GetRequisitionsApiParameter>>;

export const DispatchUpdateGetRequisitionsParameter: HandlerType = props => {
    props.dispatch({
        type: "Pages/Requisitions/UpdateGetRequisitionsParameter",
        parameter: props.parameter,
    });
};

export const chain = [DispatchUpdateGetRequisitionsParameter];

const updateGetRequisitionsParameter = createHandlerChainRunner(chain, "UpdateGetRequisitionsParameter");
export default updateGetRequisitionsParameter;
