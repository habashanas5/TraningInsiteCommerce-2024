import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { BudgetWidgetNames } from "@insite/client-framework/Store/Pages/BudgetManagement/BudgetManagementState";

type HandlerType = Handler<{ value: BudgetWidgetNames }>;

export const DispatchSetDisplayedWidgetName: HandlerType = props => {
    props.dispatch({
        type: "Pages/BudgetManagement/SetDisplayedWidgetName",
        displayedWidgetName: props.parameter.value,
    });
};

export const chain = [DispatchSetDisplayedWidgetName];

const setDisplayedWidgetName = createHandlerChainRunner(chain, "setDisplayedWidgetName");
export default setDisplayedWidgetName;
