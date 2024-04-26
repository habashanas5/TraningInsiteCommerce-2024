import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { getYearEnd } from "@insite/client-framework/Store/Data/Budgets/BudgetsSelectors";
import { BudgetPeriodType } from "@insite/client-framework/Store/Pages/BudgetManagement/BudgetManagementReducer";
import setBudgetPeriodType from "@insite/client-framework/Store/Pages/BudgetManagement/Handlers/SetBudgetPeriodType";
import { BudgetCalendarModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = Handler<{
    value?: BudgetCalendarModel;
    budgetPeriodType?: BudgetPeriodType;
    customBudgetPeriodNumber?: number;
}>;

export const DispatchSetBudgetCalendar: HandlerType = props => {
    props.dispatch({
        type: "Pages/BudgetManagement/SetBudgetCalendar",
        budgetCalendar: props.parameter.value,
    });
};

export const CalculateBudgetEndPeriods: HandlerType = props => {
    const budgetCalendar = props.parameter.value;
    if (!budgetCalendar) {
        return;
    }

    const budgetEndPeriods = budgetCalendar.budgetPeriods!.filter(x => !!x) as Date[];
    for (let i = 0; i < budgetEndPeriods.length; i += 1) {
        if (i === budgetEndPeriods.length - 1) {
            budgetEndPeriods[i] = getYearEnd(budgetCalendar.fiscalYear, budgetCalendar.fiscalYearEndDate!);
        } else {
            const t = new Date(budgetEndPeriods[i + 1]!.toString());
            t.setDate(t.getDate() - 1);
            budgetEndPeriods[i] = t;
        }
    }

    props.dispatch({
        type: "Pages/BudgetManagement/SetBudgetEndPeriods",
        budgetEndPeriods,
    });
};

export const SetBudgetPeriodType: HandlerType = props => {
    if (!props.parameter.budgetPeriodType) {
        return;
    }

    props.dispatch(
        setBudgetPeriodType({
            budgetPeriodType: props.parameter.budgetPeriodType,
            customBudgetPeriodNumber: props.parameter.customBudgetPeriodNumber,
        }),
    );
};

export const chain = [DispatchSetBudgetCalendar, CalculateBudgetEndPeriods, SetBudgetPeriodType];

const setBudgetCalendar = createHandlerChainRunner(chain, "setBudgetCalendar");
export default setBudgetCalendar;
