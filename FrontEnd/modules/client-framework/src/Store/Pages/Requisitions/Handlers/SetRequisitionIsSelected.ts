import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ requisitionId: string; isSelected: boolean }>;

export const DispatchSetRequisitionIsSelected: HandlerType = props => {
    props.dispatch({
        type: "Pages/Requisitions/SetRequisitionIsSelected",
        requisitionId: props.parameter.requisitionId,
        isSelected: props.parameter.isSelected,
    });
};

export const chain = [DispatchSetRequisitionIsSelected];

const setRequisitionIsSelected = createHandlerChainRunner(chain, "SetRequisitionIsSelected");
export default setRequisitionIsSelected;
