import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import { BudgetPeriodType } from "@insite/client-framework/Store/Pages/BudgetManagement/BudgetManagementReducer";
import setBudgetCalendar from "@insite/client-framework/Store/Pages/BudgetManagement/Handlers/SetBudgetCalendar";
import setCustomBudgetPeriodNumber from "@insite/client-framework/Store/Pages/BudgetManagement/Handlers/SetCustomBudgetPeriodNumber";

type HandlerType = Handler<{
    budgetPeriodType?: BudgetPeriodType;
    customBudgetPeriodNumber?: number;
}>;

export const DispatchSetBudgetPeriodType: HandlerType = props => {
    props.dispatch({
        type: "Pages/BudgetManagement/SetBudgetPeriodType",
        budgetPeriodType: props.parameter.budgetPeriodType,
    });
};

export const SetCustomBudgetPeriodNumber: HandlerType = props => {
    if (!props.parameter.customBudgetPeriodNumber) {
        return;
    }

    props.dispatch(setCustomBudgetPeriodNumber({ customBudgetPeriodNumber: props.parameter.customBudgetPeriodNumber }));
};

export const AssignCalendar: HandlerType = props => {
    const budgetState = props.getState().pages.budgetManagement;
    const budgetCalendar = budgetState.budgetCalendar;
    const budgetPeriodType = budgetState.budgetPeriodType;
    const customBudgetPeriodNumber = budgetState.customBudgetPeriodNumber;
    if (!budgetCalendar || !budgetPeriodType) {
        return;
    }

    const budgetPeriods: Date[] = [];
    let periodCount = 12;
    let step = 1;
    switch (budgetPeriodType) {
        case BudgetPeriodType.Monthly:
            periodCount = 12;
            step = 1;
            break;
        case BudgetPeriodType.Quarterly:
            periodCount = 4;
            step = 3;
            break;
        case BudgetPeriodType.Yearly:
            periodCount = 1;
            step = 12;
            break;
        case BudgetPeriodType.Custom:
            periodCount = customBudgetPeriodNumber || 1;
            step = 1;
            break;
    }

    for (let i = 0; i < periodCount; i += 1) {
        budgetPeriods.push(new Date(budgetCalendar.fiscalYear, i * step, 1));
    }

    props.dispatch(
        setBudgetCalendar({
            value: {
                ...budgetCalendar,
                budgetPeriods,
            },
        }),
    );
};

export const chain = [DispatchSetBudgetPeriodType, SetCustomBudgetPeriodNumber, AssignCalendar];

const setBudgetPeriodType = createHandlerChainRunner(chain, "setBudgetPeriodType");
export default setBudgetPeriodType;
