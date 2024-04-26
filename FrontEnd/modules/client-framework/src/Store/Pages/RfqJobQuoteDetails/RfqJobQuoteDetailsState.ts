import { SafeDictionary } from "@insite/client-framework/Common/Types";

export default interface RfqJobQuoteDetailsState {
    jobQuoteId?: string;
    qtyOrderedByJobQuoteLineId: SafeDictionary<number>;
}
