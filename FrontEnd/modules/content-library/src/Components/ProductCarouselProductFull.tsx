import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { ProductContext } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import updateProductInfo from "@insite/client-framework/Store/Components/ProductInfoList/Handlers/UpdateProductInfo";
import { getProductInfoFromList } from "@insite/client-framework/Store/Components/ProductInfoList/ProductInfoListSelectors";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { ProductModel } from "@insite/client-framework/Types/ApiModels";
import ProductAddToCartButton from "@insite/content-library/Components/ProductAddToCartButton";
import ProductAddToListLink, {
    ProductAddToListLinkStyles,
} from "@insite/content-library/Components/ProductAddToListLink";
import { ProductAvailabilityStyles } from "@insite/content-library/Components/ProductAvailability";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductContextAvailability from "@insite/content-library/Components/ProductContextAvailability";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import ProductImage, { ProductImageStyles } from "@insite/content-library/Components/ProductImage";
import ProductPartNumbers, { ProductPartNumbersStyles } from "@insite/content-library/Components/ProductPartNumbers";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import ProductQuantityBreakPricing, {
    ProductQuantityBreakPricingStyles,
} from "@insite/content-library/Components/ProductQuantityBreakPricing";
import ProductQuantityOrdered from "@insite/content-library/Components/ProductQuantityOrdered";
import ProductUnitOfMeasureSelect from "@insite/content-library/Components/ProductUnitOfMeasureSelect";
import { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import { SelectPresentationProps } from "@insite/mobius/Select";
import { TextFieldProps } from "@insite/mobius/TextField";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => ({
    productInfo: getProductInfoFromList(state, ownProps.carouselId, ownProps.product.id),
    productSettings: getSettingsCollection(state).productSettings,
});

const mapDispatchToProps = {
    updateProductInfo,
};

interface OwnProps {
    carouselId: string;
    product: ProductModel;
    extendedStyles?: ProductCarouselProductFullStyles;
    actionsTemplate?: (product: ProductModel) => React.ReactNode;
}

type Props = OwnProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

export interface ProductCarouselProductFullStyles {
    container?: GridContainerProps;
    imageGridItem?: GridItemProps;
    productImageStyles?: ProductImageStyles;
    brandGridItem?: GridItemProps;
    productBrandWrapper?: InjectableCss;
    productBrandStyles?: ProductBrandStyles;
    descriptionGridItem?: GridItemProps;
    productDescriptionStyles?: ProductDescriptionStyles;
    partNumberGridItem?: GridItemProps;
    productPartNumbersStyles?: ProductPartNumbersStyles;
    availabilityGridItem?: GridItemProps;
    productAvailabilityStyles?: ProductAvailabilityStyles;
    priceGridItem?: GridItemProps;
    productPriceStyles?: ProductPriceStyles;
    unitOfMeasuresGridItem?: GridItemProps;
    productUnitOfMeasureSelectStyles?: SelectPresentationProps;
    quantityBreakPricingGridItem?: GridItemProps;
    productQuantityBreakPricingStyles?: ProductQuantityBreakPricingStyles;
    quantityOrderedGridItem?: GridItemProps;
    productQuantityOrderedStyles?: TextFieldProps;
    productStandardActionsContainer?: GridContainerProps;
    addToCartGridItem?: GridItemProps;
    productAddToCartButtonStyles?: ButtonPresentationProps;
    addToListGridItem?: GridItemProps;
    productAddToListLinkStyles?: ProductAddToListLinkStyles;
}

export const productCarouselProductFullStyles: ProductCarouselProductFullStyles = {
    container: {
        gap: 8,
        css: css`
            width: 100%;
            height: 100%;
        `,
    },
    imageGridItem: {
        width: 12,
        css: css`
            justify-content: center;
        `,
    },
    productImageStyles: {
        linkWrappingImage: {
            css: css`
                justify-content: center;
            `,
        },
    },
    brandGridItem: {
        width: 12,
    },
    productBrandWrapper: {
        css: css`
            margin: 6px 0;
            min-height: 22px;
        `,
    },
    descriptionGridItem: {
        width: 12,
    },
    productDescriptionStyles: {
        productDetailLink: {
            css: css`
                margin-bottom: 6px;
            `,
        },
    },
    partNumberGridItem: {
        width: 12,
    },
    productPartNumbersStyles: {
        container: {
            css: css`
                flex-grow: 0;
                margin-bottom: 6px;
            `,
        },
        erpNumberLabelText: { size: 13 },
        erpNumberValueText: { size: 13 },
    },
    availabilityGridItem: {
        width: 12,
    },
    priceGridItem: {
        width: 12,
    },
    unitOfMeasuresGridItem: {
        width: 12,
    },
    productUnitOfMeasureSelectStyles: {
        labelProps: {
            css: css`
                flex: 1;
            `,
        },
        cssOverrides: {
            formInputWrapper: css`
                flex: 1;
            `,
        },
    },
    quantityBreakPricingGridItem: {
        width: 12,
    },
    quantityOrderedGridItem: {
        width: 12,
    },
    productQuantityOrderedStyles: {
        labelProps: {
            css: css`
                flex: 1;
            `,
        },
        labelPosition: "left",
        cssOverrides: {
            formInputWrapper: css`
                flex: 1;
            `,
        },
    },
    productStandardActionsContainer: {
        gap: 6,
        css: css`
            padding-top: 12px;
        `,
    },
    addToCartGridItem: {
        width: 12,
    },
    productAddToCartButtonStyles: {
        css: css`
            width: 100%;
        `,
    },
    addToListGridItem: {
        width: 12,
        css: css`
            justify-content: center;
        `,
    },
    productAddToListLinkStyles: {
        link: {
            typographyProps: { size: 13 },
            css: css`
                margin-bottom: 12px;
            `,
        },
    },
};

const ProductCarouselProductFull = ({
    carouselId,
    product,
    extendedStyles,
    productInfo,
    productSettings,
    updateProductInfo,
    actionsTemplate,
}: Props) => {
    const [styles] = useState(() => mergeToNew(productCarouselProductFullStyles, extendedStyles));

    const updateQuantity = (qtyOrdered: number) => {
        updateProductInfo({ id: carouselId, productId: product.id, qtyOrdered });
    };

    const updateUnitOfMeasure = (unitOfMeasure: string) => {
        updateProductInfo({ id: carouselId, productId: product.id, unitOfMeasure });
    };

    if (!product || !productInfo) {
        return null;
    }

    const productContext = {
        product,
        productInfo,
        onUnitOfMeasureChanged: updateUnitOfMeasure,
        onQtyOrderedChanged: updateQuantity,
    };

    return (
        <>
            <ProductContext.Provider value={productContext}>
                <GridContainer
                    id={`productContainer_${product.id}`}
                    {...styles.container}
                    data-test-selector="productContainer"
                >
                    <GridItem {...styles.imageGridItem}>
                        <ProductImage product={productContext} extendedStyles={styles.productImageStyles} />
                    </GridItem>
                    {product.brand && (
                        <GridItem {...styles.brandGridItem}>
                            <StyledWrapper {...styles.productBrandWrapper}>
                                <ProductBrand brand={product.brand} extendedStyles={styles.productBrandStyles} />
                            </StyledWrapper>
                        </GridItem>
                    )}
                    <GridItem {...styles.descriptionGridItem}>
                        <ProductDescription product={productContext} extendedStyles={styles.productDescriptionStyles} />
                    </GridItem>
                    <GridItem {...styles.partNumberGridItem}>
                        <ProductPartNumbers
                            productNumber={product.productNumber}
                            customerProductNumber={product.customerProductNumber}
                            manufacturerItem={product.manufacturerItem}
                            showCustomerName={true}
                            showManufacturerItem={true}
                            showLabel={true}
                            extendedStyles={styles.productPartNumbersStyles}
                        />
                    </GridItem>
                    <GridItem {...styles.availabilityGridItem}>
                        <ProductContextAvailability extendedStyles={styles.productAvailabilityStyles} />
                    </GridItem>
                    <GridItem {...styles.priceGridItem}>
                        <ProductPrice
                            showLabel={false}
                            showSavings={true}
                            showSavingsAmount={productSettings.showSavingsAmount}
                            showSavingsPercent={productSettings.showSavingsPercent}
                            product={productContext}
                            extendedStyles={styles.productPriceStyles}
                        />
                    </GridItem>
                    <GridItem {...styles.unitOfMeasuresGridItem}>
                        {product.unitOfMeasures && (
                            <ProductUnitOfMeasureSelect
                                labelPosition="left"
                                extendedStyles={styles.productUnitOfMeasureSelectStyles}
                            />
                        )}
                    </GridItem>
                    <GridItem {...styles.quantityBreakPricingGridItem}>
                        <ProductQuantityBreakPricing extendedStyles={styles.productQuantityBreakPricingStyles} />
                    </GridItem>
                    <GridItem {...styles.quantityOrderedGridItem}>
                        <ProductQuantityOrdered extendedStyles={styles.productQuantityOrderedStyles} />
                    </GridItem>
                </GridContainer>
                <GridContainer {...styles.productStandardActionsContainer}>
                    <GridItem {...styles.addToCartGridItem}>
                        <ProductAddToCartButton
                            data-test-selector="addToCartBtn"
                            extendedStyles={styles.productAddToCartButtonStyles}
                        />
                    </GridItem>
                    <GridItem {...styles.addToListGridItem}>
                        <ProductAddToListLink
                            data-test-selector="addToListLink"
                            extendedStyles={styles.productAddToListLinkStyles}
                        />
                    </GridItem>
                </GridContainer>
                {actionsTemplate ? actionsTemplate(product) : []}
            </ProductContext.Provider>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductCarouselProductFull);
