import { Dictionary } from "@insite/client-framework/Common/Types";
import { DataView, DataViewState } from "@insite/client-framework/Store/Data/DataState";
import {
    AttributeTypeFacetModel,
    CategoryFacetModel,
    FacetModel,
    PriceRangeModel,
    ProductModel,
    SuggestionModel,
} from "@insite/client-framework/Types/ApiModels";

export interface ProductsDataView extends DataView {
    attributeTypeFacets: AttributeTypeFacetModel[] | null;
    brandFacets: FacetModel[] | null;
    categoryFacets: CategoryFacetModel[] | null;
    correctedQuery: string;
    didYouMeanSuggestions: SuggestionModel[] | null;
    exactMatch: boolean;
    notAllProductsAllowed: boolean;
    notAllProductsFound: boolean;
    originalQuery: string;
    priceRange: PriceRangeModel | null;
    productLineFacets: FacetModel[] | null;
    searchTermRedirectUrl: string;
}

export interface ProductsState extends DataViewState<ProductModel, ProductsDataView> {
    readonly idByPath: Dictionary<string>;
}
