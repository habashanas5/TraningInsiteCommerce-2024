import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { ProductContextModel } from "@insite/client-framework/Components/ProductContext";
import translate from "@insite/client-framework/Translate";
import { CartLineModel } from "@insite/client-framework/Types/ApiModels";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import Img, { ImgProps } from "@insite/mobius/Img";
import LazyImage, { LazyImageProps } from "@insite/mobius/LazyImage";
import React, { FC } from "react";
import { css } from "styled-components";

interface OwnProps {
    product: CartLineModel | ProductContextModel;
    extendedStyles?: ProductImageStyles;
}

type Props = OwnProps;

export interface ProductImageStyles {
    linkWrappingImage?: ClickablePresentationProps;
    /**
     * @deprecated Use img instead
     */
    image?: LazyImageProps;
    img?: ImgProps;
}

export const productImageStyles: ProductImageStyles = {
    linkWrappingImage: {
        css: css`
            width: 100%;
        `,
    },
    image: {
        css: css`
            img {
                height: 100%;
            }
        `,
    },
    img: {
        css: css`
            height: auto;
            width: 100%;
        `,
    },
};

const ProductImage: FC<Props> = ({ product, extendedStyles }) => {
    const [styles] = React.useState(() => mergeToNew(productImageStyles, extendedStyles));

    let altText = "product" in product ? product.product.imageAltText : product.altText;
    if (!altText || altText === "") {
        altText = "product" in product ? product.product.productTitle : product.productName;
    }
    altText += ` ${translate("redirect to product page")}`;
    const imagePath =
        "product" in product
            ? product.product.mediumImagePath || product.product.smallImagePath
            : product.smallImagePath;

    const productDetailPath = "product" in product ? product.productInfo.productDetailPath : product.productUri;
    const loading = product.idx === undefined ? "lazy" : product.idx < 3 ? "eager" : "lazy";

    return (
        <Clickable {...styles.linkWrappingImage} href={productDetailPath} data-test-selector="productImage">
            <Img {...styles.img} loading={loading} src={imagePath} altText={altText} />
        </Clickable>
    );
};

export default ProductImage;
