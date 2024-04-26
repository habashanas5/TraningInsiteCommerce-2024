import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { GetWishListsApiParameter } from "@insite/client-framework/Services/WishListService";

export default interface AddToListModalState {
    isOpen: boolean;
    productInfos?: Omit<ProductInfo, "productDetailPath">[];
    getWishListsParameter: GetWishListsApiParameter;
}
