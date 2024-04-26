import { GetJobQuotesApiParameter } from "@insite/client-framework/Services/JobQuoteService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { DataView, getById, getDataView } from "@insite/client-framework/Store/Data/DataState";
import { JobQuoteLineModel, JobQuoteModel } from "@insite/client-framework/Types/ApiModels";

export function getJobQuotesDataView(state: ApplicationState, getJobQuotesApiParameter: GetJobQuotesApiParameter) {
    return getDataView<JobQuoteModel, DataView>(state.data.jobQuotes, getJobQuotesApiParameter);
}

export function getJobQuoteState(state: ApplicationState, jobQuoteId: string | undefined) {
    return getById(state.data.jobQuotes, jobQuoteId);
}

export function getCurrentPageJobQuoteState(state: ApplicationState) {
    return getById(state.data.jobQuotes, state.pages.rfqJobQuoteDetails.jobQuoteId);
}

export function getQtyOrderedByJobQuoteLineId(state: ApplicationState) {
    return state.pages.rfqJobQuoteDetails.qtyOrderedByJobQuoteLineId;
}

export function getCurrentPageOrderTotal(state: ApplicationState) {
    const jobQuoteState = getCurrentPageJobQuoteState(state);
    if (!jobQuoteState?.value) {
        return 0;
    }

    let orderTotal = 0;
    const qtyOrderedByJobQuoteLineId = getQtyOrderedByJobQuoteLineId(state);
    jobQuoteState.value.jobQuoteLineCollection?.forEach((jobQuoteLine: JobQuoteLineModel) => {
        const qtyOrdered = qtyOrderedByJobQuoteLineId[jobQuoteLine.id];
        if (!jobQuoteLine.pricing || !qtyOrdered) {
            return;
        }

        orderTotal += jobQuoteLine.pricing.unitNetPrice * qtyOrdered;
    });

    return orderTotal;
}

export function getCurrentPageOrderTotalWithVat(state: ApplicationState) {
    const jobQuoteState = getCurrentPageJobQuoteState(state);
    if (!jobQuoteState?.value) {
        return 0;
    }

    let orderTotalWithVat = 0;
    const qtyOrderedByJobQuoteLineId = getQtyOrderedByJobQuoteLineId(state);
    jobQuoteState.value.jobQuoteLineCollection?.forEach((jobQuoteLine: JobQuoteLineModel) => {
        const qtyOrdered = qtyOrderedByJobQuoteLineId[jobQuoteLine.id];
        if (!jobQuoteLine.pricing || !qtyOrdered) {
            return;
        }

        orderTotalWithVat += jobQuoteLine.pricing.unitRegularPriceWithVat * qtyOrdered;
    });

    return orderTotalWithVat;
}
