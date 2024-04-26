import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{
    customBudgetPeriodNumber?: number;
}>;

export const DispatchSetCustomBudgetPeriodNumber: HandlerType = props => {
    props.dispatch({
        type: "Pages/BudgetManagement/SetCustomBudgetPeriodNumber",
        customBudgetPeriodNumber: props.parameter.customBudgetPeriodNumber,
    });
};

export const chain = [DispatchSetCustomBudgetPeriodNumber];

const setCustomBudgetPeriodNumber = createHandlerChainRunner(chain, "setCustomBudgetPeriodNumber");
export default setCustomBudgetPeriodNumber;
