import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { ProductContext } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import updateProductInfo from "@insite/client-framework/Store/Components/ProductInfoList/Handlers/UpdateProductInfo";
import { getProductInfoFromList } from "@insite/client-framework/Store/Components/ProductInfoList/ProductInfoListSelectors";
import translate from "@insite/client-framework/Translate";
import { ProductModel } from "@insite/client-framework/Types/ApiModels";
import ProductAddToCartButton from "@insite/content-library/Components/ProductAddToCartButton";
import ProductAddToListLink, {
    ProductAddToListLinkStyles,
} from "@insite/content-library/Components/ProductAddToListLink";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
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
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React, { ReactNode, useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => ({
    productInfo: getProductInfoFromList(state, ownProps.carouselId, ownProps.product.id),
});

const mapDispatchToProps = {
    updateProductInfo,
};

interface OwnProps {
    carouselId: string;
    product: ProductModel;
    labelsVisible?: boolean;
    showImage: boolean;
    showBrand: boolean;
    showTitle: boolean;
    showPartNumbers: boolean;
    showPrice: boolean;
    showAddToCart: boolean;
    showAddToList: boolean;
    extendedStyles?: ProductCarouselProductCondensedStyles;
    condensedActionsTemplate?: (product: ProductModel) => ReactNode;
}

type Props = OwnProps & ResolveThunks<typeof mapDispatchToProps> & ReturnType<typeof mapStateToProps>;

export interface ProductCarouselProductCondensedStyles {
    container?: GridContainerProps;
    imageGridItem?: GridItemProps;
    productImageStyles?: ProductImageStyles;
    productDetailsGridItem?: GridItemProps;
    productBrandWrapper?: InjectableCss;
    productBrandStyles?: ProductBrandStyles;
    productDescriptionStyles?: ProductDescriptionStyles;
    productPartNumbersStyles?: ProductPartNumbersStyles;
    productPriceWrapper?: InjectableCss;
    productPriceStyles?: ProductPriceStyles;
    productUnitOfMeasureSelectStyles?: SelectPresentationProps;
    productQuantityBreakPricingStyles?: ProductQuantityBreakPricingStyles;
    addToCartContainer?: GridContainerProps;
    qtyGridItem?: GridItemProps;
    productQuantityOrderedStyles?: TextFieldProps;
    addToCartButtonGridItem?: GridItemProps;
    productAddToCartButtonStyles?: ButtonPresentationProps;
    productAddToListLinkStyles?: ProductAddToListLinkStyles;
    condensedActionsTemplateGridItem?: GridItemProps;
}

export const productCarouselProductCondensedStyles: ProductCarouselProductCondensedStyles = {
    container: {
        gap: 4,
    },
    imageGridItem: {
        width: 3,
    },
    productBrandWrapper: {
        css: css`
            margin: 6px 0;
            min-height: 22px;
        `,
    },
    productDetailsGridItem: {
        width: 7,
        css: css`
            flex-direction: column;
        `,
    },
    productDescriptionStyles: {
        productDetailLink: {
            css: css`
                margin-bottom: 6px;
            `,
        },
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
    productPriceWrapper: {
        css: css`
            flex-grow: 1;
            margin-bottom: 6px;
        `,
    },
    productUnitOfMeasureSelectStyles: {
        cssOverrides: {
            formField: css`
                margin-top: 6px;
            `,
        },
    },
    addToCartContainer: {
        gap: 10,
        css: css`
            flex-grow: 0;
            margin-bottom: 6px;
        `,
    },
    qtyGridItem: { width: 3 },
    productQuantityOrderedStyles: {
        cssOverrides: {
            formField: css`
                margin-top: 0;
            `,
        },
    },
    addToCartButtonGridItem: { width: 9 },
    productAddToCartButtonStyles: {
        css: css`
            width: 100%;
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
    condensedActionsTemplateGridItem: {
        width: 1,
    },
};

const ProductCarouselProductCondensed = ({
    carouselId,
    product,
    labelsVisible,
    showImage,
    showBrand,
    showTitle,
    showPartNumbers,
    showPrice,
    showAddToCart,
    showAddToList,
    updateProductInfo,
    extendedStyles,
    productInfo,
    condensedActionsTemplate,
}: Props) => {
    const [styles] = useState(() => mergeToNew(productCarouselProductCondensedStyles, extendedStyles));

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
                <GridContainer {...styles.container}>
                    <GridItem {...styles.imageGridItem}>
                        {showImage && (
                            <ProductImage product={productContext} extendedStyles={styles.productImageStyles} />
                        )}
                    </GridItem>
                    <GridItem {...styles.productDetailsGridItem}>
                        {showBrand && product.brand && (
                            <StyledWrapper {...styles.productBrandWrapper}>
                                <ProductBrand brand={product.brand} extendedStyles={styles.productBrandStyles} />
                            </StyledWrapper>
                        )}
                        {showTitle && (
                            <ProductDescription
                                product={productContext}
                                extendedStyles={styles.productDescriptionStyles}
                            />
                        )}
                        {showPartNumbers && (
                            <ProductPartNumbers
                                productNumber={product.productNumber}
                                customerProductNumber={product.customerProductNumber}
                                manufacturerItem={product.manufacturerItem}
                                showCustomerName={false}
                                showManufacturerItem={false}
                                showLabel={false}
                                extendedStyles={styles.productPartNumbersStyles}
                            />
                        )}
                        {showPrice && (
                            <StyledWrapper {...styles.productPriceWrapper}>
                                <VisuallyHidden as="label" htmlFor={`${carouselId}-uom`} id={`${carouselId}-uom-label`}>
                                    {translate("U/M")}
                                </VisuallyHidden>
                                <ProductPrice
                                    showLabel={false}
                                    product={productContext}
                                    extendedStyles={styles.productPriceStyles}
                                />
                                {product.unitOfMeasures && (
                                    <ProductUnitOfMeasureSelect
                                        labelOverride=""
                                        extendedStyles={styles.productUnitOfMeasureSelectStyles}
                                        id={`${carouselId}-uom`}
                                    />
                                )}
                                <ProductQuantityBreakPricing
                                    extendedStyles={styles.productQuantityBreakPricingStyles}
                                />
                            </StyledWrapper>
                        )}
                        {showAddToCart && (
                            <GridContainer {...styles.addToCartContainer}>
                                <GridItem {...styles.qtyGridItem}>
                                    <VisuallyHidden
                                        as="label"
                                        htmlFor={`${carouselId}-qty`}
                                        id={`${carouselId}-qty-label`}
                                    >
                                        {translate("QTY")}
                                    </VisuallyHidden>
                                    <ProductQuantityOrdered
                                        labelOverride=""
                                        extendedStyles={styles.productQuantityOrderedStyles}
                                        id={`${carouselId}-qty`}
                                    />
                                </GridItem>
                                <GridItem {...styles.addToCartButtonGridItem}>
                                    <ProductAddToCartButton
                                        data-test-selector="addToCartBtn"
                                        extendedStyles={styles.productAddToCartButtonStyles}
                                    />
                                </GridItem>
                            </GridContainer>
                        )}
                        {showAddToList && (
                            <ProductAddToListLink
                                data-test-selector="addToListLink"
                                extendedStyles={styles.productAddToListLinkStyles}
                            />
                        )}
                    </GridItem>
                    {condensedActionsTemplate ? (
                        <GridItem {...styles.condensedActionsTemplateGridItem}>
                            {condensedActionsTemplate(product)}
                        </GridItem>
                    ) : (
                        []
                    )}
                </GridContainer>
            </ProductContext.Provider>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductCarouselProductCondensed);
