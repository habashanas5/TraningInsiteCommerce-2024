import { Dictionary } from "@insite/client-framework/Common/Types";
import { BudgetModel } from "@insite/client-framework/Types/ApiModels";

export interface BudgetsState {
    readonly dataViews: Dictionary<DataView>;
}

interface DataView {
    readonly fetchedDate: Date;
    readonly isLoading: boolean;
    value?: Readonly<BudgetModel>;
}
