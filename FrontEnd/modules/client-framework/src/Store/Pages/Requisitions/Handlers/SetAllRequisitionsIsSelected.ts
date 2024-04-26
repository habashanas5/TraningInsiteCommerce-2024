import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

export interface SetAllRequisitionsIsSelectedParameter {
    isSelected: boolean;
    requisitionIds?: string[];
}

type HandlerType = Handler<SetAllRequisitionsIsSelectedParameter>;

export const DispatchSetAllRequisitionsIsSelected: HandlerType = props => {
    props.dispatch({
        type: "Pages/Requisitions/SetAllRequisitionsIsSelected",
        isSelected: props.parameter.isSelected,
        requisitionIds: props.parameter.requisitionIds,
    });
};

export const chain = [DispatchSetAllRequisitionsIsSelected];

const setAllRequisitionsIsSelected = createHandlerChainRunner(chain, "SetAllRequisitionsIsSelected");
export default setAllRequisitionsIsSelected;
