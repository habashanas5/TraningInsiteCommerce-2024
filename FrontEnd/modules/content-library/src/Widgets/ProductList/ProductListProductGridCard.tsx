import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import translate from "@insite/client-framework/Translate";
import { ProductCardSelections } from "@insite/content-library/Widgets/ProductList/ProductCardSelections";
import ProductListActions from "@insite/content-library/Widgets/ProductList/ProductListActions";
import ProductListProductImage from "@insite/content-library/Widgets/ProductList/ProductListProductImage";
import ProductListProductInformation from "@insite/content-library/Widgets/ProductList/ProductListProductInformation";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { FC } from "react";
import { css } from "styled-components";

type Props = ProductCardSelections & HasProduct;

export interface ProductListProductGridCardStyles {
    wrapper?: InjectableCss;
    imageWrapper?: InjectableCss;
    sponsoredText?: TypographyPresentationProps;
}

export const productGridCardStyles: ProductListProductGridCardStyles = {
    wrapper: {
        css: css`
            display: flex;
            flex-direction: column;
            width: 100%;
            height: 100%;
            overflow: hidden;
            padding-bottom: 10px;
        `,
    },
    imageWrapper: {
        css: css`
            margin: auto;
            padding: 10px 50px;
        `,
    },
    sponsoredText: {
        css: css`
            font-size: 0.9em;
            opacity: 0.5;
            position: absolute;
            top: 12px;
        `,
    },
};

const styles = productGridCardStyles;

const ProductListProductGridCard: FC<Props> = ({
    product,
    showImage,
    showCompare,
    showAttributes,
    showAvailability,
    showBrand,
    showPartNumbers,
    showTitle,
    showAddToList,
    showPrice,
}) => {
    return (
        <StyledWrapper {...styles.wrapper} data-test-selector={`productListProductCard${product.id}`}>
            <StyledWrapper {...styles.imageWrapper}>
                {product.isSponsored && <Typography {...styles.sponsoredText}>{translate("Sponsored")}</Typography>}
                <ProductListProductImage showImage={showImage} showCompare={showCompare} />
            </StyledWrapper>
            <ProductListProductInformation
                showAttributes={showAttributes}
                showAvailability={showAvailability}
                showBrand={showBrand}
                showPartNumbers={showPartNumbers}
                showTitle={showTitle}
            />
            <ProductListActions showAddToList={showAddToList} showPrice={showPrice} />
        </StyledWrapper>
    );
};

export default withProduct(ProductListProductGridCard);
