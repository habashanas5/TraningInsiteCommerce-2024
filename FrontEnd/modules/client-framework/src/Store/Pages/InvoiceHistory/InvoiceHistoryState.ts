import { GetInvoicesApiParameter } from "@insite/client-framework/Services/InvoiceService";

export default interface InvoiceHistoryState {
    getInvoicesParameter: GetInvoicesApiParameter;
    filtersOpen: boolean;
}
