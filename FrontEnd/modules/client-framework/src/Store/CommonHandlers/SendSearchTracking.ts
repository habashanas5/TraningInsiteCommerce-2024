import { trackAutocompleteSearchResultEvent } from "@insite/client-framework/Common/Utilities/tracking";
import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";

type HandlerType = Handler<{
    searchEvent: "searchResults" | "autocompleteSearchResults" | string;
    searchTerm: string;
    resultCount: number;
    productCount?: number;
    categoryCount?: number;
    contentCount?: number;
    brandCount?: number;
}>;

export const SendSearchTracking: HandlerType = ({
    parameter: { searchEvent, searchTerm, resultCount, productCount, categoryCount, contentCount, brandCount },
}) => {
    trackAutocompleteSearchResultEvent(
        searchEvent,
        searchTerm,
        resultCount,
        productCount,
        categoryCount,
        contentCount,
        brandCount,
    );
};

export const chain = [SendSearchTracking];

const sendSearchTracking = createHandlerChainRunner(chain, "SendSearchTracking");
export default sendSearchTracking;
