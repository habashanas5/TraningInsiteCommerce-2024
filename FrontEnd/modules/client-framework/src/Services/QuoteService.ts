import isApiError from "@insite/client-framework/Common/isApiError";
import {
    ApiParameter,
    del,
    doesNotHaveExpand,
    get,
    HasPagingParameters,
    patch,
    post,
    ServiceResult,
} from "@insite/client-framework/Services/ApiService";
import { QuoteCollectionModel, QuoteLineModel, QuoteModel } from "@insite/client-framework/Types/ApiModels";

const quotesUrl = "/api/v1/quotes";

export type QuoteType = "quote" | "job";

export interface GetQuotesApiParameter extends ApiParameter, HasPagingParameters {
    /**
     * @deprecated Use userId instead
     */
    userProfileId?: string;
    userId?: string;
    salesRepNumber?: string;
    customerId?: string;
    statuses?: string[];
    quoteNumber?: string;
    fromDate?: string;
    toDate?: string;
    expireFromDate?: string;
    expireToDate?: string;
    types?: QuoteType;
    expand?: "salesList"[];
}

export interface GetQuoteApiParameter extends ApiParameter {
    quoteId: string;
}

export async function getQuotes(getQuotesParameter: GetQuotesApiParameter) {
    const quotes = await get<QuoteCollectionModel>(quotesUrl, getQuotesParameter);
    cleanQuoteCollection(quotes, getQuotesParameter);
    quotes.quotes?.forEach(cleanQuote);
    return quotes;
}

export async function getQuote(parameter: GetQuoteApiParameter) {
    const quote = await get<QuoteModel>(`${quotesUrl}/${parameter.quoteId}`);
    cleanQuote(quote);
    return quote;
}

function cleanQuote(quote: QuoteModel) {
    quote.orderDate = quote.orderDate ? new Date(quote.orderDate) : null;
    quote.expirationDate = quote.expirationDate ? new Date(quote.expirationDate) : null;
    quote.cartLines = quote.quoteLineCollection;
    quote.messageCollection?.forEach(message => {
        if (message.createdDate) {
            message.createdDate = new Date(message.createdDate);
        }
    });
}

function cleanQuoteCollection(quoteCollection: QuoteCollectionModel, parameter?: { expand?: string[] }) {
    if (doesNotHaveExpand(parameter, "salesList")) {
        delete quoteCollection.salespersonList;
    }
}

export interface CreateQuoteApiParameter {
    quoteId: string;
    note: string;
    userId?: string;
    isJobQuote: boolean;
    jobName: string;
}

export async function createQuote(createQuoteParameter: CreateQuoteApiParameter): Promise<ServiceResult<QuoteModel>> {
    try {
        const quote = await post<CreateQuoteApiParameter, QuoteModel>(quotesUrl, createQuoteParameter);
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

export interface UpdateQuoteApiParameter extends ApiParameter {
    quoteId: string;
    status?: string;
    note?: string;
    userId?: string;
    expirationDate?: Date;
    calculationMethod?: string;
    percent?: number;
    isJobQuote?: boolean;
    jobName?: string;
    orderQuantities?: QuoteLineModel[];
}

export async function updateQuote(parameter: UpdateQuoteApiParameter): Promise<ServiceResult<QuoteModel>> {
    try {
        const quote = await patch<QuoteModel>(`${quotesUrl}/${parameter.quoteId}`, parameter);
        cleanQuote(quote);
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

export interface DeleteQuoteApiParameter extends ApiParameter {
    quoteId: string;
}

export async function deleteQuote(parameter: UpdateQuoteApiParameter): Promise<ServiceResult<void>> {
    try {
        const result = await del(`${quotesUrl}/${parameter.quoteId}`);
        return {
            successful: true,
            result,
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

export interface UpdateQuoteLineApiParameter extends ApiParameter {
    quoteId: string;
    quoteLineId: string;
    quoteLine: QuoteLineModel;
}

export async function updateQuoteLine(parameter: UpdateQuoteLineApiParameter): Promise<ServiceResult<QuoteLineModel>> {
    try {
        const quoteLine = await patch<QuoteLineModel>(
            `${quotesUrl}/${parameter.quoteId}/quotelines/${parameter.quoteLineId}`,
            parameter.quoteLine,
        );
        return {
            successful: true,
            result: quoteLine,
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
