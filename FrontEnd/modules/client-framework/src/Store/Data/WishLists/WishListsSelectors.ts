import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { SafeDictionary } from "@insite/client-framework/Common/Types";
import {
    getUnitRegularPrice,
    getUnitRegularPriceWithVat,
} from "@insite/client-framework/Services/Helpers/ProductPriceService";
import { GetWishListsApiParameter } from "@insite/client-framework/Services/WishListService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getById, getDataView } from "@insite/client-framework/Store/Data/DataState";
import {
    getWishListLinesDataView,
    isWishListLineDiscontinued,
    isWishListLineRestricted,
} from "@insite/client-framework/Store/Data/WishListLines/WishListLinesSelectors";
import { WishListsDataView } from "@insite/client-framework/Store/Data/WishLists/WishListsState";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";

export function getWishListState(state: ApplicationState, wishListId: string | undefined) {
    return getById(state.data.wishLists, wishListId);
}

export function getWishListsDataView(state: ApplicationState, parameter: GetWishListsApiParameter | undefined) {
    return getDataView<WishListModel, WishListsDataView>(state.data.wishLists, parameter);
}

export function getWishListTotal(
    wishListLinesDataView: ReturnType<typeof getWishListLinesDataView>,
    productInfosByWishListLineId: SafeDictionary<ProductInfo>,
) {
    if (!wishListLinesDataView.value || (wishListLinesDataView.pagination?.numberOfPages ?? 0) > 1) {
        return undefined;
    }

    let total = 0;
    wishListLinesDataView.value.forEach(wishListLine => {
        const productInfo = productInfosByWishListLineId[wishListLine.id];
        if (
            !productInfo ||
            !productInfo.pricing ||
            wishListLine.quoteRequired ||
            isWishListLineDiscontinued(wishListLine, productInfo) ||
            isWishListLineRestricted(wishListLine, productInfo)
        ) {
            return;
        }

        total +=
            Math.round(
                getUnitRegularPrice(productInfo.pricing, productInfo.qtyOrdered).price * productInfo.qtyOrdered * 100,
            ) / 100;
    });

    return total;
}

export function getWishListTotalWithVat(
    wishListLinesDataView: ReturnType<typeof getWishListLinesDataView>,
    productInfosByWishListLineId: SafeDictionary<ProductInfo>,
) {
    if (!wishListLinesDataView.value || (wishListLinesDataView.pagination?.numberOfPages ?? 0) > 1) {
        return undefined;
    }

    let total = 0;
    wishListLinesDataView.value.forEach(wishListLine => {
        const productInfo = productInfosByWishListLineId[wishListLine.id];
        if (
            !productInfo ||
            !productInfo.pricing ||
            wishListLine.quoteRequired ||
            isWishListLineDiscontinued(wishListLine, productInfo) ||
            isWishListLineRestricted(wishListLine, productInfo)
        ) {
            return;
        }

        const priceWithVat = getUnitRegularPriceWithVat(productInfo.pricing, productInfo.qtyOrdered).price;
        total += Math.round(priceWithVat * productInfo.qtyOrdered * 100) / 100;
    });

    return total;
}
