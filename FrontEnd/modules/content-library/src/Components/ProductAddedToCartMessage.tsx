import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import siteMessage from "@insite/client-framework/SiteMessage";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";

interface OwnProps {
    isQtyAdjusted: boolean;
    multipleProducts: boolean;
}

type Props = OwnProps;

export interface ProductAddedToCartMessageStyles {
    messageWrapper?: InjectableCss;
    defaultText?: TypographyPresentationProps;
    quantityAdjustedText?: TypographyPresentationProps;
}

export const productAddedToCartMessageStyles: ProductAddedToCartMessageStyles = {
    defaultText: {
        variant: "p",
    },
    quantityAdjustedText: {
        variant: "p",
    },
};

const styles = productAddedToCartMessageStyles;

const ProductAddedToCartMessage = ({ isQtyAdjusted, multipleProducts }: Props) => {
    const defaultMessage = multipleProducts
        ? siteMessage("Cart_AllProductsAddedToCart")
        : siteMessage("Cart_ProductAddedToCart");

    if (!isQtyAdjusted) {
        return <Typography {...styles.defaultText}>{defaultMessage}</Typography>;
    }

    return (
        <StyledWrapper {...styles.messageWrapper}>
            <Typography {...styles.defaultText}>{defaultMessage}</Typography>
            <Typography {...styles.quantityAdjustedText}>{siteMessage("Cart_QuantityAdjusted")}</Typography>
        </StyledWrapper>
    );
};

export default ProductAddedToCartMessage;
