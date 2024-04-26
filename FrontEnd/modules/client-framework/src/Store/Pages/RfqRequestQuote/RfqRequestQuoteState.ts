import { QuoteType } from "@insite/client-framework/Services/QuoteService";
import { AccountModel } from "@insite/client-framework/Types/ApiModels";

export interface QuoteParameter {
    quoteId: string;
    quoteType: QuoteType;
    accountId?: string;
    jobName: string;
    note: string;
}

export default interface RfqRequestQuoteState {
    accounts: AccountModel[];
    quoteParameter: QuoteParameter;
}
