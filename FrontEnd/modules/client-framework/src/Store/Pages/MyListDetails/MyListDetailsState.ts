import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { GetWishListLinesApiParameter } from "@insite/client-framework/Services/WishListService";

export default interface MyListDetailsState {
    wishListId?: string;
    loadWishListLinesParameter: GetWishListLinesApiParameter;
    selectedWishListLineIds: string[];
    editingSortOrder: boolean;
    wishListLinesWithUpdatedQuantity: SafeDictionary<boolean>;
    quantityAdjustmentModalIsOpen: boolean;
    productInfosByWishListLineId: SafeDictionary<ProductInfo>;
}
