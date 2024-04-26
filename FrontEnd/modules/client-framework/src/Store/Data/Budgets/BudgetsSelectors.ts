import { GetBudgetApiParameter } from "@insite/client-framework/Services/BudgetService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { dataViewNotFound, getDataViewKey } from "@insite/client-framework/Store/Data/DataState";

export function getYearEnd(fiscalYear: number, fiscalYearEndDate?: Date) {
    if (!fiscalYearEndDate) {
        const date = new Date(fiscalYear, 11, 31);
        const offset = date.getTimezoneOffset();
        date.setMinutes(date.getMinutes() - offset * (offset < 0 ? 1 : -1));
        return date;
    }

    return new Date(fiscalYearEndDate);
}

export function getBudgetYears(years: number) {
    const currentYear = new Date().getFullYear();
    const budgetYears: number[] = [];
    for (let i = 0; i < years; i += 1) {
        budgetYears.push(currentYear + i);
    }

    return budgetYears;
}

export function getBudgetsDataView(state: ApplicationState, getBudgetApiParameter: GetBudgetApiParameter) {
    const dataView = state.data.budgets.dataViews[getDataViewKey(getBudgetApiParameter)];
    if (!dataView) {
        return dataViewNotFound;
    }

    return dataView;
}
