import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { GetInvoicesApiParameter } from "@insite/client-framework/Services/InvoiceService";
import { setDataViewLoaded, setDataViewLoading } from "@insite/client-framework/Store/Data/DataState";
import { InvoicesState } from "@insite/client-framework/Store/Data/Invoices/InvoicesState";
import { InvoiceCollectionModel, InvoiceModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: InvoicesState = {
    isLoading: {},
    idByInvoiceNumber: {},
    byId: {},
    dataViews: {},
    errorStatusCodeById: {},
};

const reducer = {
    "Data/Invoices/BeginLoadInvoices": (
        draft: Draft<InvoicesState>,
        action: { parameter: GetInvoicesApiParameter },
    ) => {
        setDataViewLoading(draft, action.parameter);
    },

    "Data/Invoices/CompleteLoadInvoices": (
        draft: Draft<InvoicesState>,
        action: { parameter: GetInvoicesApiParameter; collection: InvoiceCollectionModel },
    ) => {
        setDataViewLoaded(
            draft,
            action.parameter,
            action.collection,
            collection => collection.invoices!,
            order => storeIdByInvoiceNumber(draft, order),
        );

        if (draft.failedToLoadInvoices) {
            draft.failedToLoadInvoices = false;
        }
    },

    "Data/Invoices/FailedToLoadInvoices": (draft: Draft<InvoicesState>) => {
        draft.failedToLoadInvoices = true;
    },

    "Data/Invoices/BeginLoadInvoiceByInvoiceNumber": (
        draft: Draft<InvoicesState>,
        action: { invoiceNumber: string },
    ) => {
        draft.isLoading[action.invoiceNumber] = true;
    },

    "Data/Invoices/CompleteLoadInvoiceByInvoiceNumber": (
        draft: Draft<InvoicesState>,
        action: { model: InvoiceModel },
    ) => {
        delete draft.isLoading[action.model.invoiceNumber];
        draft.byId[action.model.id] = action.model;
        storeIdByInvoiceNumber(draft, action.model);
        if (draft.errorStatusCodeById) {
            delete draft.errorStatusCodeById[action.model.invoiceNumber];
        }
    },

    "Data/Invoices/FailedToLoadInvoiceByInvoiceNumber": (
        draft: Draft<InvoicesState>,
        action: { invoiceNumber: string; status: number },
    ) => {
        delete draft.isLoading[action.invoiceNumber];
        if (draft.errorStatusCodeById) {
            draft.errorStatusCodeById[action.invoiceNumber] = action.status;
        }
    },

    "Data/Invoices/Reset": () => {
        return initialState;
    },
};

function storeIdByInvoiceNumber(draft: Draft<InvoicesState>, invoice: InvoiceModel) {
    draft.idByInvoiceNumber[invoice.invoiceNumber] = invoice.id;
}

export default createTypedReducerWithImmer(initialState, reducer);
