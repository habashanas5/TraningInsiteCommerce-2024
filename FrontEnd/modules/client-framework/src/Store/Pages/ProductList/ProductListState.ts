import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { HasPagingParameters } from "@insite/client-framework/Services/ApiService";
import { GetProductCollectionApiV2Parameter } from "@insite/client-framework/Services/ProductServiceV2";
import { AttributeTypeFacetModel } from "@insite/client-framework/Types/ApiModels";

export interface ProductFilters extends HasPagingParameters {
    pageCategoryId?: string;
    pageBrandId?: string;
    pageProductLineId?: string;
    query?: string;
    includeSuggestions?: boolean;
    stockedItemsOnly?: boolean;
    previouslyPurchasedProducts?: boolean;
    searchWithinQueries?: string[];
    brandIds?: string[];
    productLineIds?: string[];
    priceFilters?: string[];
    attributeValueIds?: string[];
    categoryId?: string;
    expand?: ("pricing" | "attributes" | "facets" | "brand")[];
    additionalExpands?: string[];
}

export type ProductListViewType = "List" | "Grid" | "Table";

export default interface ProductListState {
    // needed because we don't immediately have the new parameter available for retrieving the next productDataView
    isLoading: boolean;
    parameter?: GetProductCollectionApiV2Parameter;
    lastParameter?: GetProductCollectionApiV2Parameter;
    productInfosByProductId: SafeDictionary<ProductInfo>;
    unfilteredApiParameter?: GetProductCollectionApiV2Parameter;
    filteredApiParameter?: GetProductCollectionApiV2Parameter;
    productFilters: ProductFilters;
    filterQuery?: string;
    isSearchPage?: boolean;
    view?: ProductListViewType;
    tableColumns: AttributeTypeFacetModel[];
    visibleColumnNames: string[];
}
