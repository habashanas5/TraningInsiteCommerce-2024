import { DataView, DataViewState } from "@insite/client-framework/Store/Data/DataState";
import { QuoteModel, SalespersonModel } from "@insite/client-framework/Types/ApiModels";

export interface QuotesDataView extends DataView {
    salespersonList: SalespersonModel[] | null;
}

export interface QuotesState extends DataViewState<QuoteModel, QuotesDataView> {}
