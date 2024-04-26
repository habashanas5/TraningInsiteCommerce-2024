import {
    ApiParameter,
    doesNotHaveExpand,
    get,
    HasPagingParameters,
    patch,
} from "@insite/client-framework/Services/ApiService";
import { InvoiceCollectionModel, InvoiceModel } from "@insite/client-framework/Types/ApiModels";

export interface GetInvoicesApiParameter extends ApiParameter, HasPagingParameters {
    invoiceNumber?: string;
    orderNumber?: string;
    poNumber?: string;
    search?: string;
    status?: string[];
    customerSequence?: string;
    fromDate?: string;
    toDate?: string;
    showOpenOnly?: boolean;
}

export interface GetInvoiceApiParameter extends ApiParameter {
    invoiceNumber: string;
    expand?: "invoiceLines"[];
    additionalExpands?: string[];
    sTEmail?: string;
    sTPostalCode?: string;
}

export interface UpdateInvoiceApiParameter extends ApiParameter {
    invoice: InvoiceModel;
}

const invoicesUrl = "/api/v1/invoices";

export async function getInvoices(parameter: GetInvoicesApiParameter) {
    const invoices = await get<InvoiceCollectionModel>(invoicesUrl, parameter);
    invoices.invoices?.forEach(o => cleanInvoice(o));
    return invoices;
}

export async function getInvoice(parameter: GetInvoiceApiParameter) {
    const invoiceNumber = parameter.invoiceNumber;
    const newParameter = { ...parameter };
    delete newParameter.invoiceNumber;
    const invoice = await get<InvoiceModel>(`${invoicesUrl}/${invoiceNumber}`, newParameter);
    cleanInvoice(invoice, parameter);
    return invoice;
}

export function updateInvoice(parameter: UpdateInvoiceApiParameter) {
    const invoice = parameter.invoice;
    const invoiceNumber = invoice.invoiceNumber;
    return patch<InvoiceModel>(`${invoicesUrl}/${invoiceNumber}`, invoice);
}

function cleanInvoice(invoice: InvoiceModel, parameter?: { expand?: string[]; additionalExpands?: string[] }) {
    invoice.id = invoice.invoiceNumber;
    if (doesNotHaveExpand(parameter, "invoiceLines")) {
        delete invoice.invoiceLines;
    }
}
