import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import { ProductDetailsPageContext } from "@insite/content-library/Pages/ProductDetailsPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import * as React from "react";
import { css } from "styled-components";

type Props = WidgetProps & HasProduct;

export interface ProductDetailsPageTitleStyles {
    container?: GridContainerProps;
    brandGridItem?: GridItemProps;
    brandStyles?: ProductBrandStyles;
    titleGridItem?: GridItemProps;
    titleText?: TypographyProps;
}

export const pageTitleStyles: ProductDetailsPageTitleStyles = {
    container: {
        gap: 0,
        offsetCss: css`
            max-width: 100%;
        `,
    },
    brandGridItem: {
        width: 12,
    },
    brandStyles: {
        logoImage: {
            css: css`
                img {
                    max-width: 150px;
                    max-height: 150px;
                }
            `,
        },
        nameText: {
            size: 16,
            weight: "normal",
        },
    },
    titleGridItem: {
        width: 12,
    },
    titleText: {
        variant: "h2",
    },
};

const styles = pageTitleStyles;

const ProductDetailsPageTitle: React.FC<Props> = ({ product }) => {
    return (
        <GridContainer {...styles.container}>
            {product.brand && (
                <GridItem {...styles.brandGridItem}>
                    <ProductBrand brand={product.brand} showLogo={true} extendedStyles={styles.brandStyles} />
                </GridItem>
            )}
            <GridItem {...styles.titleGridItem}>
                <Typography {...styles.titleText} data-test-selector="ProductDetailsPageTitle">
                    {product.productTitle}
                </Typography>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: withProduct(ProductDetailsPageTitle),
    definition: {
        displayName: "Page Title",
        group: "Product Details",
        allowedContexts: [ProductDetailsPageContext],
    },
};

export default widgetModule;
