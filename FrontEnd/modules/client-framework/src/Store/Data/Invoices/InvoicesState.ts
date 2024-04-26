import { Dictionary } from "@insite/client-framework/Common/Types";
import { DataViewState } from "@insite/client-framework/Store/Data/DataState";
import { InvoiceModel } from "@insite/client-framework/Types/ApiModels";

export interface InvoicesState extends DataViewState<InvoiceModel> {
    readonly idByInvoiceNumber: Dictionary<string>;
    failedToLoadInvoices?: boolean;
}
