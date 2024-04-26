import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ requisitionId: string; isExpanded: boolean }>;

export const DispatchSetRequisitionIsExpanded: HandlerType = props => {
    props.dispatch({
        type: "Pages/Requisitions/SetRequisitionIsExpanded",
        requisitionId: props.parameter.requisitionId,
        isExpanded: props.parameter.isExpanded,
    });
};

export const chain = [DispatchSetRequisitionIsExpanded];

const setRequisitionIsExpanded = createHandlerChainRunner(chain, "SetRequisitionIsExpanded");
export default setRequisitionIsExpanded;
