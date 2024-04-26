import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import InvoiceDetailsState from "@insite/client-framework/Store/Pages/InvoiceDetails/InvoiceDetailsState";
import { Draft } from "immer";

const initialState: InvoiceDetailsState = {};

const reducer = {
    "Pages/InvoiceDetails/SetInvoiceNumber": (draft: Draft<InvoiceDetailsState>, action: { invoiceNumber: string }) => {
        draft.invoiceNumber = action.invoiceNumber;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
