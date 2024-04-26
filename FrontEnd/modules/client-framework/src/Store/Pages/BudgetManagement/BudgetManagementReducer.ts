import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetBudgetApiParameter } from "@insite/client-framework/Services/BudgetService";
import { getYearEnd } from "@insite/client-framework/Store/Data/Budgets/BudgetsSelectors";
import BudgetState, {
    BudgetWidgetNames,
} from "@insite/client-framework/Store/Pages/BudgetManagement/BudgetManagementState";
import {
    BudgetCalendarCollectionModel,
    BudgetCalendarModel,
    BudgetModel,
} from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

export enum BudgetEnforcementLevel {
    None = "None",
    ShipTo = "ShipTo",
    Customer = "Customer",
    User = "User",
}

export enum BudgetPeriodType {
    Monthly = "Monthly",
    Quarterly = "Quarterly",
    Yearly = "Yearly",
    Custom = "Custom",
}

const initialState: BudgetState = {
    displayedWidgetName: "ReviewBudget",
    customBudgetPeriodNumber: 1,
    getBudgetParameter: { fiscalYear: new Date().getFullYear(), fullGrid: true },
    getMaintenanceInfoParameter: { fiscalYear: new Date().getFullYear(), fullGrid: false },
};

const reducer = {
    "Data/Budget/CompleteLoadBudgetCalendarCollection": (
        draft: Draft<BudgetState>,
        action: { collection: BudgetCalendarCollectionModel },
    ) => {
        if (!draft.budgetCalendar) {
            const currentYear = new Date().getFullYear();
            draft.budgetCalendar =
                action.collection.budgetCalendarCollection!.find(o => o.fiscalYear === currentYear) ||
                ({ fiscalYear: currentYear, budgetPeriods: [] as Date[] } as BudgetCalendarModel);
        }

        const budgetEndPeriods = draft.budgetCalendar.budgetPeriods!.filter(x => !!x) as Date[];
        for (let i = 0; i < budgetEndPeriods.length; i += 1) {
            if (i === budgetEndPeriods.length - 1) {
                budgetEndPeriods[i] = getYearEnd(
                    draft.budgetCalendar.fiscalYear,
                    draft.budgetCalendar.fiscalYearEndDate!,
                );
            } else {
                const t = new Date(budgetEndPeriods[i + 1]!.toString());
                t.setDate(t.getDate() - 1);
                budgetEndPeriods[i] = t;
            }
        }

        draft.budgetEndPeriods = budgetEndPeriods;
    },
    "Pages/BudgetManagement/CompleteSaveBudgetConfiguration": (
        draft: Draft<BudgetState>,
        action: {
            budgetCalendar: BudgetCalendarModel;
        },
    ) => {
        draft.budgetCalendar = { ...draft.budgetCalendar, ...action.budgetCalendar };
    },
    "Pages/BudgetManagement/SetBudgetCalendar": (
        draft: Draft<BudgetState>,
        action: { budgetCalendar?: BudgetCalendarModel },
    ) => {
        draft.budgetCalendar = action.budgetCalendar
            ? { ...draft.budgetCalendar, ...action.budgetCalendar }
            : undefined;
    },
    "Pages/BudgetManagement/SetBudgetEndPeriods": (
        draft: Draft<BudgetState>,
        action: { budgetEndPeriods?: Date[] },
    ) => {
        draft.budgetEndPeriods = action.budgetEndPeriods;
    },
    "Pages/BudgetManagement/SetBudgetPeriodType": (
        draft: Draft<BudgetState>,
        action: { budgetPeriodType?: BudgetPeriodType },
    ) => {
        draft.budgetPeriodType = action.budgetPeriodType;
    },
    "Pages/BudgetManagement/SetCustomBudgetPeriodNumber": (
        draft: Draft<BudgetState>,
        action: { customBudgetPeriodNumber?: number },
    ) => {
        draft.customBudgetPeriodNumber = action.customBudgetPeriodNumber;
    },
    "Pages/BudgetManagement/SetDisplayedWidgetName": (
        draft: Draft<BudgetState>,
        action: { displayedWidgetName: BudgetWidgetNames },
    ) => {
        draft.displayedWidgetName = action.displayedWidgetName;
    },
    "Pages/BudgetManagement/UpdateLoadParameter": (
        draft: Draft<BudgetState>,
        action: { parameter: GetBudgetApiParameter },
    ) => {
        draft.getBudgetParameter = { ...draft.getBudgetParameter, ...action.parameter };
    },
    "Pages/BudgetManagement/UpdateLoadMaintenanceInfoParameter": (
        draft: Draft<BudgetState>,
        action: { parameter: GetBudgetApiParameter },
    ) => {
        draft.maintenanceInfo = undefined;
        draft.getMaintenanceInfoParameter = { ...draft.getMaintenanceInfoParameter, ...action.parameter };
    },
    "Pages/BudgetManagement/UpdateMaintenanceInfo": (
        draft: Draft<BudgetState>,
        action: { maintenanceInfo?: BudgetModel },
    ) => {
        draft.maintenanceInfo = action.maintenanceInfo;
    },
    "Data/Budget/CompleteUpdateBudget": (draft: Draft<BudgetState>, action: { maintenanceInfo?: BudgetModel }) => {
        draft.maintenanceInfo = undefined;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
