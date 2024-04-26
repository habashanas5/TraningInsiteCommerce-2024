import { ApiParameter, get, patch } from "@insite/client-framework/Services/ApiService";
import { BudgetCalendarCollectionModel, BudgetCalendarModel } from "@insite/client-framework/Types/ApiModels";

export interface UpdateBudgetCalendarApiParameter extends ApiParameter {
    budgetCalendar: BudgetCalendarModel;
}

const budgetCalendarsUri = "/api/v1/budgetcalendars";

export function getBudgetCalendarCollection() {
    return get<BudgetCalendarCollectionModel>(budgetCalendarsUri, {});
}

export function updateBudgetCalendar(parameter: UpdateBudgetCalendarApiParameter) {
    return patch<BudgetCalendarModel>(
        `${budgetCalendarsUri}/${parameter.budgetCalendar.fiscalYear}`,
        parameter.budgetCalendar,
    );
}
