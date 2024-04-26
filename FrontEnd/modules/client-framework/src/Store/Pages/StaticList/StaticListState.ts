import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { SafeDictionary } from "@insite/client-framework/Common/Types";

export default interface StaticListState {
    wishListId?: string;
    productInfosByWishListLineId: SafeDictionary<ProductInfo>;
}
