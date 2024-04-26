import { GetBudgetApiParameter } from "@insite/client-framework/Services/BudgetService";
import { BudgetPeriodType } from "@insite/client-framework/Store/Pages/BudgetManagement/BudgetManagementReducer";
import { BudgetCalendarModel, BudgetModel } from "@insite/client-framework/Types/ApiModels";

export type BudgetWidgetNames = "CostCodes" | "AssignBudgets" | "ConfigureBudget" | "ReviewBudget";

export default interface BudgetState {
    displayedWidgetName?: BudgetWidgetNames;
    budgetCalendar?: BudgetCalendarModel;
    budgetEndPeriods?: Date[];
    budgetPeriodType?: BudgetPeriodType;
    customBudgetPeriodNumber?: number;
    getBudgetParameter: GetBudgetApiParameter;
    getMaintenanceInfoParameter: GetBudgetApiParameter;
    maintenanceInfo?: BudgetModel;
}
