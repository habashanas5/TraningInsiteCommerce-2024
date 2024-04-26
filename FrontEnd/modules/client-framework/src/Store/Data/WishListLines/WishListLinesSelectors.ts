import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import { GetWishListLinesApiParameter } from "@insite/client-framework/Services/WishListService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getDataView } from "@insite/client-framework/Store/Data/DataState";
import { AvailabilityMessageType, WishListLineModel } from "@insite/client-framework/Types/ApiModels";

export function getWishListLinesDataView(state: ApplicationState, parameter: GetWishListLinesApiParameter | undefined) {
    return getDataView(state.data.wishListLines, parameter);
}

export function canAddWishListLineToCart(
    wishListLine: WishListLineModel,
    productInfosByWishListLineId: SafeDictionary<ProductInfo>,
) {
    if (!wishListLine.canAddToCart) {
        return false;
    }

    if (wishListLine.canBackOrder || !wishListLine.trackInventory) {
        return true;
    }

    const inventory = productInfosByWishListLineId[wishListLine.id]?.inventory;
    if (!inventory) {
        return false;
    }

    return inventory.qtyOnHand > 0;
}

export function isWishListLineDiscontinued(wishListLine: WishListLineModel, productInfo: ProductInfo) {
    const availability = productInfo.inventory?.inventoryAvailabilityDtos?.find(
        o => o.unitOfMeasure.toLowerCase() === productInfo.unitOfMeasure.toLowerCase(),
    )?.availability;

    return (
        !wishListLine.isActive ||
        (wishListLine.isDiscontinued && availability?.messageType === AvailabilityMessageType.OutOfStock)
    );
}

export function isWishListLineRestricted(wishListLine: WishListLineModel, productInfo: ProductInfo) {
    if (isWishListLineDiscontinued(wishListLine, productInfo)) {
        return false;
    }

    return !wishListLine.isVisible;
}
