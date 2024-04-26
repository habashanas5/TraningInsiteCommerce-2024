import { ApiHandlerDiscreteParameter, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { GetInvoiceApiParameter } from "@insite/client-framework/Services/InvoiceService";
import loadInvoiceByInvoiceNumber from "@insite/client-framework/Store/Data/Invoices/Handlers/LoadInvoiceByInvoiceNumber";
import { getInvoiceState } from "@insite/client-framework/Store/Data/Invoices/InvoicesSelectors";
import { InvoiceModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<{ invoiceNumber: string }, GetInvoiceApiParameter, InvoiceModel>;

export const DispatchSetInvoiceNumber: HandlerType = props => {
    props.dispatch({
        type: "Pages/InvoiceDetails/SetInvoiceNumber",
        invoiceNumber: props.parameter.invoiceNumber,
    });
};

export const DispatchLoadInvoiceIfNeeded: HandlerType = props => {
    const invoiceState = getInvoiceState(props.getState(), props.parameter.invoiceNumber);
    if ((!invoiceState.value && !invoiceState.isLoading) || !invoiceState.value.invoiceLines) {
        props.dispatch(loadInvoiceByInvoiceNumber(props.parameter));
    }
};

export const chain = [DispatchSetInvoiceNumber, DispatchLoadInvoiceIfNeeded];

const displayInvoice = createHandlerChainRunner(chain, "DisplayInvoice");
export default displayInvoice;
