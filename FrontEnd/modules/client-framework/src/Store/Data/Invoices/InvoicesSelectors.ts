import { GetInvoicesApiParameter } from "@insite/client-framework/Services/InvoiceService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getById, getDataView } from "@insite/client-framework/Store/Data/DataState";
import { createContext } from "react";

export function getInvoiceState(state: ApplicationState, invoiceNumber: string | undefined) {
    return getById(state.data.invoices, invoiceNumber, id => state.data.invoices.idByInvoiceNumber[id]);
}

export function getInvoicesDataView(state: ApplicationState, getInvoicesParameter: GetInvoicesApiParameter) {
    return getDataView(state.data.invoices, getInvoicesParameter);
}

export const InvoicesDataViewContext = createContext<ReturnType<typeof getInvoicesDataView>>({
    value: undefined,
    isLoading: false,
});

export const InvoiceStateContext = createContext<ReturnType<typeof getInvoiceState>>({
    value: undefined,
    isLoading: false,
    errorStatusCode: undefined,
    id: undefined,
});
