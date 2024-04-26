import isApiError from "@insite/client-framework/Common/isApiError";
import {
    ApiParameter,
    get,
    HasPagingParameters,
    patch,
    ServiceResult,
} from "@insite/client-framework/Services/ApiService";
import { JobQuoteCollectionModel, JobQuoteLineModel, JobQuoteModel } from "@insite/client-framework/Types/ApiModels";

const jobQuotesUrl = "/api/v1/jobquotes";

export interface GetJobQuotesApiParameter extends ApiParameter, HasPagingParameters {}

export interface GetJobQuoteApiParameter extends ApiParameter {
    jobQuoteId: string;
}

export async function getJobQuotes(getJobQuotesParameter: GetJobQuotesApiParameter) {
    const jobQuotesCollection = await get<JobQuoteCollectionModel>(jobQuotesUrl, getJobQuotesParameter);
    jobQuotesCollection.jobQuotes?.forEach(o => {
        cleanJobQuote(o, true);
    });
    return jobQuotesCollection;
}

export async function getJobQuote(parameter: GetJobQuoteApiParameter) {
    const jobQuote = await get<JobQuoteModel>(`${jobQuotesUrl}/${parameter.jobQuoteId}`);
    cleanJobQuote(jobQuote);
    return jobQuote;
}

function cleanJobQuote(jobQuote: JobQuoteModel, removeLines?: boolean) {
    jobQuote.orderDate = jobQuote.orderDate ? new Date(jobQuote.orderDate) : null;
    jobQuote.expirationDate = new Date(jobQuote.expirationDate);

    if (removeLines) {
        jobQuote.jobQuoteLineCollection = null;
    }
}

export interface UpdateJobQuoteApiParameter extends ApiParameter {
    jobQuoteId: string;
    jobQuoteLineCollection: JobQuoteLineModel[];
}

export async function updateJobQuote(parameter: UpdateJobQuoteApiParameter): Promise<ServiceResult<JobQuoteModel>> {
    try {
        const quote = await patch<JobQuoteModel>(`${jobQuotesUrl}/${parameter.jobQuoteId}`, parameter);
        return {
            successful: true,
            result: quote,
        };
    } catch (error) {
        if (isApiError(error) && error.status === 400) {
            return {
                successful: false,
                errorMessage: error.errorJson.message,
            };
        }
        throw error;
    }
}
