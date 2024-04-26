import { ApiParameter, get, patch } from "@insite/client-framework/Services/ApiService";
import { BudgetModel } from "@insite/client-framework/Types/ApiModels";

export interface GetBudgetApiParameter extends ApiParameter {
    userProfileId?: string;
    shipToId?: string;
    fiscalYear: number;
    fullGrid?: boolean;
}

export interface UpdateBudgetApiParameter extends ApiParameter {
    budget: BudgetModel;
}

const budgetUri = "/api/v1/budgets";

export function getBudget(parameter: GetBudgetApiParameter) {
    return get<BudgetModel>(`${budgetUri}/${parameter.fiscalYear}`, parameter);
}

export function updateBudget(parameter: UpdateBudgetApiParameter) {
    return patch(`${budgetUri}/${parameter.budget.fiscalYear}`, parameter.budget);
}
