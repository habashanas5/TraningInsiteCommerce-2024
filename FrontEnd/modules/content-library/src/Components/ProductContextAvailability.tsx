/* eslint-disable spire/export-styles */
import { getIsWebCrawler } from "@insite/client-framework/Common/WebCrawler";
import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import { ConfigurationType } from "@insite/client-framework/Services/ProductServiceV2";
import ProductAvailability, { ProductAvailabilityStyles } from "@insite/content-library/Components/ProductAvailability";
import React from "react";

interface OwnProps {
    isProductDetailsPage?: boolean;
    configurationCompleted?: boolean;
    extendedStyles?: ProductAvailabilityStyles;
}

type Props = OwnProps & HasProduct;

const ProductContextAvailability = ({
    productInfo,
    product,
    isProductDetailsPage,
    configurationCompleted,
    extendedStyles,
}: Props) => {
    const { inventory, unitOfMeasure, failedToLoadInventory } = productInfo;

    const availability =
        inventory?.inventoryAvailabilityDtos?.find(
            o => o.unitOfMeasure.toLowerCase() === (unitOfMeasure?.toLowerCase() || ""),
        )?.availability || undefined;

    if (
        getIsWebCrawler() ||
        product.isVariantParent ||
        (!!product.configurationType &&
            product.configurationType !== ConfigurationType.None &&
            product.configurationType !== ConfigurationType.Fixed &&
            !configurationCompleted)
    ) {
        return null;
    }

    return (
        <ProductAvailability
            productId={product.id}
            trackInventory={product.trackInventory}
            availability={availability}
            unitOfMeasure={unitOfMeasure}
            isProductDetailsPage={isProductDetailsPage}
            failedToLoadInventory={failedToLoadInventory}
            extendedStyles={extendedStyles}
        />
    );
};

export default withProduct(ProductContextAvailability);
