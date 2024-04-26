import { HasOnComplete, HasOnSuccess } from "@insite/client-framework/HandlerCreator";
import { ApiParameter, get } from "@insite/client-framework/Services/ApiService";
import { AutocompleteModel } from "@insite/client-framework/Types/ApiModels";

export interface AutocompleteApiParameter extends ApiParameter {
    query: string;
    brandEnabled?: boolean;
    categoryEnabled?: boolean;
    contentEnabled?: boolean;
    productEnabled?: boolean;
    spireContent?: boolean;
}

const autocompleteUrl = "/api/v1/autocomplete";

export function autocompleteSearch(
    parameter: AutocompleteApiParameter & HasOnSuccess<AutocompleteModel> & HasOnComplete<AutocompleteModel>,
) {
    const apiParameter = { ...parameter, spireContent: true };
    delete apiParameter.onSuccess;
    delete apiParameter.onComplete;
    return get<AutocompleteModel>(autocompleteUrl, apiParameter);
}

const searchHistoryCacheKey = "searchHistory";
const defaultSearchHistoryLimit = 10;

export interface SearchHistoryItem {
    query: string;
    includeSuggestions?: boolean;
}

export function addSearchHistory(query: string, limit?: number, includeSuggestions?: boolean) {
    if (!query || query.trim().length === 0) {
        return;
    }

    query = query.trim();

    let searchHistory = getSearchHistory();
    const queryIndex = searchHistory.map(o => o.query).indexOf(query);
    if (queryIndex > -1) {
        searchHistory.splice(queryIndex, 1);
    }

    searchHistory.splice(0, 0, { query, includeSuggestions });
    searchHistory = searchHistory.splice(0, limit || defaultSearchHistoryLimit);

    window.localStorage.setItem(searchHistoryCacheKey, JSON.stringify(searchHistory));
}

export function clearSearchHistory() {
    window.localStorage.setItem(searchHistoryCacheKey, "");
}

export function getSearchHistory() {
    if (typeof window === "undefined") {
        return [];
    }

    return (JSON.parse(window.localStorage.getItem(searchHistoryCacheKey) || "[]") as SearchHistoryItem[]).filter(
        (o: any) => typeof o === "object",
    );
}
