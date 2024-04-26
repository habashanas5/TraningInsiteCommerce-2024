import { HasProductContext, withProductContext } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import ProductAttributes, { ProductAttributesStyles } from "@insite/content-library/Components/ProductAttributes";
import { ProductAvailabilityStyles } from "@insite/content-library/Components/ProductAvailability";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductContextAvailability from "@insite/content-library/Components/ProductContextAvailability";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import ProductPartNumbers, { ProductPartNumbersStyles } from "@insite/content-library/Components/ProductPartNumbers";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import React, { FC } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    showBrand: boolean;
    showTitle: boolean;
    showPartNumbers: boolean;
    showAvailability: boolean;
    showAttributes: boolean;
}

const mapStateToProps = (state: ApplicationState) => ({
    settingsCollection: getSettingsCollection(state),
});

type Props = ReturnType<typeof mapStateToProps> & OwnProps & HasProductContext;

export interface ProductListProductInformationStyles {
    container?: GridContainerProps;
    brandStyles?: ProductBrandStyles;
    descriptionStyles?: ProductDescriptionStyles;
    brandGridItem?: GridItemProps;
    descriptionGridItem?: GridItemProps;
    partNumbersGridItem?: GridItemProps;
    partNumbersStyles?: ProductPartNumbersStyles;
    availabilityGridItem?: GridItemProps;
    availabilityStyles?: ProductAvailabilityStyles;
    attributesGridItem?: GridItemProps;
    attributes?: ProductAttributesStyles;
    searchScoreDataGridItem?: GridItemProps;
}

export const productInformationStyles: ProductListProductInformationStyles = {
    container: {
        gap: 10,
        css: css`
            width: 100%;
        `,
    },
    descriptionStyles: {
        productDetailLink: {
            css: css`
                width: 100%;
            `,
            typographyProps: {
                size: 20,
            },
        },
    },
    brandGridItem: {
        width: 12,
    },
    descriptionGridItem: {
        width: 12,
    },
    partNumbersGridItem: {
        width: 12,
    },
    availabilityGridItem: {
        width: 12,
    },
    attributesGridItem: {
        width: 12,
    },
    searchScoreDataGridItem: {
        width: 12,
    },
};

const styles = productInformationStyles;

const ProductListProductInformation: FC<Props> = ({
    productContext,
    settingsCollection,
    showBrand,
    showTitle,
    showPartNumbers,
    showAvailability,
    showAttributes,
}) => {
    const { product } = productContext;

    if (!product) {
        return null;
    }

    return (
        <GridContainer {...styles.container}>
            {product.brand && showBrand && (
                <GridItem {...styles.brandGridItem}>
                    <ProductBrand brand={product.brand} extendedStyles={styles.brandStyles} />
                </GridItem>
            )}
            {showTitle && (
                <GridItem {...styles.descriptionGridItem}>
                    <ProductDescription product={productContext} extendedStyles={styles.descriptionStyles} />
                </GridItem>
            )}
            {showPartNumbers && (
                <GridItem {...styles.partNumbersGridItem}>
                    <ProductPartNumbers
                        productNumber={product.productNumber}
                        customerProductNumber={product.customerProductNumber}
                        manufacturerItem={product.manufacturerItem}
                        extendedStyles={styles.partNumbersStyles}
                    />
                </GridItem>
            )}
            {settingsCollection.productSettings.showInventoryAvailability && showAvailability && (
                <GridItem {...styles.availabilityGridItem}>
                    <ProductContextAvailability extendedStyles={styles.availabilityStyles} />
                </GridItem>
            )}
            {showAttributes && (
                <GridItem {...styles.attributesGridItem}>
                    <ProductAttributes maximumNumberAttributeTypes={3} extendedStyles={styles.attributes} />
                </GridItem>
            )}
        </GridContainer>
    );
};

export default connect(mapStateToProps)(withProductContext(ProductListProductInformation));
