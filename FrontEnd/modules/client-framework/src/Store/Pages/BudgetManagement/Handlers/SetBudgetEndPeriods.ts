import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{ value?: Date[] }>;

export const DispatchSetBudgetEndPeriods: HandlerType = props => {
    props.dispatch({
        type: "Pages/BudgetManagement/SetBudgetEndPeriods",
        budgetEndPeriods: props.parameter.value,
    });
};

export const chain = [DispatchSetBudgetEndPeriods];

const setBudgetEndPeriods = createHandlerChainRunner(chain, "setBudgetEndPeriods");
export default setBudgetEndPeriods;
