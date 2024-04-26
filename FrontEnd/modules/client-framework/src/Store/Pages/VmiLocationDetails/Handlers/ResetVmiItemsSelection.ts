import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { TableTabKeys } from "@insite/client-framework/Store/Pages/VmiLocationDetails/VmiLocationDetailsReducer";

type HandlerType = Handler<{
    tabKey: TableTabKeys;
}>;

export const DispatchClearVmiItemChecks: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiLocationDetails/ClearVmiItemChecks",
        tabKey: props.parameter.tabKey,
    });
};

export const chain = [DispatchClearVmiItemChecks];

const resetVmiItemsSelection = createHandlerChainRunner(chain, "ResetVmiItemsSelection");
export default resetVmiItemsSelection;
