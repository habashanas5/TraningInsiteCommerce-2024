import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import wrapInContainerStyles from "@insite/client-framework/Common/wrapInContainerStyles";
import { ProductContextModel } from "@insite/client-framework/Components/ProductContext";
import { CartLineModel, OrderLineModel } from "@insite/client-framework/Types/ApiModels";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import React, { FC } from "react";
import { css } from "styled-components";

interface OwnProps {
    product: CartLineModel | ProductContextModel | OrderLineModel;
    extendedStyles?: ProductDescriptionStyles;
}

type Props = OwnProps;

export interface ProductDescriptionStyles {
    productDetailLink?: LinkPresentationProps;
    productDetailDescription?: TypographyProps;
}

export const productDescriptionStyles: ProductDescriptionStyles = {
    productDetailLink: {
        css: css`
            width: 100%;
        `,
        typographyProps: {
            css: css`
                width: 100%;
                ${wrapInContainerStyles}
            `,
        },
    },
};

const ProductDescription: FC<Props> = ({ product, extendedStyles }) => {
    const [styles] = React.useState(() => mergeToNew(productDescriptionStyles, extendedStyles));

    const description =
        "product" in product
            ? product.product.productTitle
            : product.shortDescription || ("description" in product ? product.description : "");
    const productDetailPath = "product" in product ? product.productInfo.productDetailPath : product.productUri;

    return productDetailPath && (!("isActiveProduct" in product) || product.isActiveProduct) ? (
        <Link
            {...styles.productDetailLink}
            href={productDetailPath}
            alt={`See product details for ${description}`}
            data-test-selector="productDescriptionLink"
        >
            {description}
        </Link>
    ) : (
        <Typography {...styles.productDetailDescription}>{description}</Typography>
    );
};

export default ProductDescription;
