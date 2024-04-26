import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { ProductAutocompleteItemModel } from "@insite/client-framework/Types/ApiModels";

export default interface ProductSelectorState {
    selectedProductInfo?: ProductInfo;
    isSearching: boolean;
    searchResults?: ProductAutocompleteItemModel[];
    errorType?: string;
    variantModalIsOpen: boolean;
    variantModalProductId?: string;
    variantSelection: SafeDictionary<string>;
    variantSelectionCompleted: boolean;
    selectedVariantProductInfo?: ProductInfo;
}
