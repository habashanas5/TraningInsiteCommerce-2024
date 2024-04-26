import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { BudgetCalendarModel } from "@insite/client-framework/Types/ApiModels";

export interface BudgetCalendarsState {
    readonly dataViews: SafeDictionary<DataView>;
}

interface DataView {
    readonly fetchedDate: Date;
    readonly isLoading: boolean;
    value?: Readonly<BudgetCalendarModel>[];
}
