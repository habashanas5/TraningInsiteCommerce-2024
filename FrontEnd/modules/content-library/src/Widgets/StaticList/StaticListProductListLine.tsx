import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { ProductContext, ProductContextModel } from "@insite/client-framework/Components/ProductContext";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import updateQuantity from "@insite/client-framework/Store/Pages/StaticList/Handlers/UpdateQuantity";
import updateUnitOfMeasure from "@insite/client-framework/Store/Pages/StaticList/Handlers/UpdateUnitOfMeasure";
import translate from "@insite/client-framework/Translate";
import { ProductModel, WishListLineModel } from "@insite/client-framework/Types/ApiModels";
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
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import { ButtonPresentationProps } from "@insite/mobius/Button";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import { SelectPresentationProps } from "@insite/mobius/Select";
import { TextFieldProps } from "@insite/mobius/TextField";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import cloneDeep from "lodash/cloneDeep";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    wishListLine: WishListLineModel;
    productInfo: ProductInfo;
}

const mapStateToProps = (state: ApplicationState) => ({
    settingsCollection: getSettingsCollection(state),
});

const mapDispatchToProps = {
    updateUnitOfMeasure,
    updateQuantity,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface StaticListsProductListLineStyles {
    lineInnerContainer?: GridContainerProps;
    imageGridItem?: GridItemProps;
    imageWrapper?: InjectableCss;
    productImageStyles?: ProductImageStyles;
    descriptionGridItem?: GridItemProps;
    productBrandStyles?: ProductBrandStyles;
    productDescriptionStyles?: ProductDescriptionStyles;
    productPartNumbersStyles?: ProductPartNumbersStyles;
    notesStyles?: SmallHeadingAndTextStyles;
    partNumbersHidden?: HiddenProps;
    partNumbersGridItem?: GridItemProps;
    priceAndAvailabilityGridItem?: GridItemProps;
    priceAndAvailabilityInnerContainer?: GridContainerProps;
    priceGridItem?: GridItemProps;
    productPriceStyles?: ProductPriceStyles;
    quantityBreakPricing?: ProductQuantityBreakPricingStyles;
    uomAndQuantityGridItem?: GridItemProps;
    uomAndQuantityInnerContainer?: GridContainerProps;
    uomGridItem?: GridItemProps;
    productUnitOfMeasureSelectStyles?: SelectPresentationProps;
    quantityGridItem?: GridItemProps;
    productQuantityOrderedStyles?: TextFieldProps;
    availabilityGridItem?: GridItemProps;
    productAvailabilityStyles?: ProductAvailabilityStyles;
    notesHidden?: HiddenProps;
    notesGridItem?: GridItemProps;
    buttonsGridItem?: GridItemProps;
    addToCartButton?: ButtonPresentationProps;
    addToListLink?: ProductAddToListLinkStyles;
}

export const staticListProductListLineStyles: StaticListsProductListLineStyles = {
    lineInnerContainer: {
        gap: 10,
        css: css`
            border-bottom: 1px lightgray solid;
            padding: 20px 0;
        `,
    },
    imageGridItem: {
        width: [3, 3, 2, 2, 1],
        printWidth: 1,
    },
    imageWrapper: {
        css: css`
            @media print {
                max-height: 83px;
                max-width: 83px;
            }
            width: 100%;
            min-width: 0;
            flex-direction: column;
        `,
    },
    descriptionGridItem: {
        width: [8, 8, 4, 4, 4],
        printWidth: 6,
        css: css`
            flex-direction: column;
        `,
    },
    productPartNumbersStyles: {
        erpNumberGridItem: {
            css: css`
                flex-direction: column;
            `,
        },
        erpNumberLabelText: { variant: "legend" },
        customerNameGridItem: {
            css: css`
                flex-direction: column;
            `,
        },
        customerNameLabelText: { variant: "legend" },
        manufacturerItemGridItem: {
            css: css`
                flex-direction: column;
            `,
        },
        manufacturerItemLabelText: { variant: "legend" },
    },
    partNumbersHidden: {
        below: "md",
        css: css`
            @media print {
                display: block;
            }
            width: 100%;
        `,
    },
    partNumbersGridItem: { width: 12 },
    priceAndAvailabilityGridItem: {
        width: [12, 12, 4, 4, 5],
        printWidth: 5,
    },
    priceAndAvailabilityInnerContainer: { gap: 10 },
    priceGridItem: {
        width: [12, 12, 12, 12, 5],
        printWidth: 5,
        css: css`
            flex-direction: column;
        `,
    },
    productPriceStyles: {
        priceLabelText: {
            variant: "p",
            transform: "uppercase",
            weight: 600,
            css: css`
                @media print {
                    font-size: 12px;
                }
            `,
        },
    },
    quantityBreakPricing: {
        viewLink: { typographyProps: { size: 12 } },
    },
    uomAndQuantityGridItem: {
        width: [12, 12, 12, 12, 7],
        printWidth: 7,
    },
    uomAndQuantityInnerContainer: {
        gap: 10,
        css: css`
            @media print {
                input,
                select {
                    height: 18px !important;
                    font-size: 11px !important;
                }
            }
        `,
    },
    uomGridItem: { width: 9, printWidth: 6 },
    quantityGridItem: { width: 3, printWidth: 6 },
    productQuantityOrderedStyles: {
        labelProps: {
            css: css`
                @media print {
                    font-size: 12px;
                }
            `,
        },
        cssOverrides: {
            inputSelect: css`
                @media print {
                    width: 100px;
                }
            `,
        },
    },
    productUnitOfMeasureSelectStyles: {
        labelProps: {
            css: css`
                @media print {
                    font-size: 12px;
                }
            `,
        },
        iconProps: {
            css: css`
                @media print {
                    display: none;
                }
            `,
        },
    },
    availabilityGridItem: { width: 12 },
    buttonsGridItem: {
        width: [12, 12, 2, 2, 2],
        printWidth: 0,
        css: css`
            flex-direction: column;
            align-items: center;
        `,
    },
    notesHidden: {
        above: "sm",
        css: css`
            @media print {
                display: none;
            }
            width: 100%;
        `,
    },
    notesGridItem: { width: 12 },
    addToCartButton: {
        css: css`
            width: 100%;
            margin-bottom: 10px;
        `,
    },
};

const styles = staticListProductListLineStyles;

const StaticListProductListLine = ({
    wishListLine,
    productInfo,
    settingsCollection,
    updateUnitOfMeasure,
    updateQuantity,
}: Props) => {
    const { productSettings } = settingsCollection;
    const product = mapWishListLineToProduct(wishListLine);
    const productContext: ProductContextModel = {
        product,
        productInfo,
        onQtyOrderedChanged: qtyOrdered => {
            updateQuantity({ wishListLineId: wishListLine.id, qtyOrdered });
        },
        onUnitOfMeasureChanged: unitOfMeasure => {
            updateUnitOfMeasure({ wishListLineId: wishListLine.id, unitOfMeasure });
        },
    };

    return (
        <ProductContext.Provider value={productContext}>
            <GridContainer
                {...styles.lineInnerContainer}
                data-test-selector={`${wishListLine.productId}_${wishListLine.selectedUnitOfMeasure}`}
            >
                <GridItem {...styles.imageGridItem}>
                    <StyledWrapper {...styles.imageWrapper}>
                        <ProductImage product={productContext} extendedStyles={styles.productImageStyles} />
                    </StyledWrapper>
                </GridItem>
                <GridItem {...styles.descriptionGridItem}>
                    {product.brand && <ProductBrand brand={product.brand} extendedStyles={styles.productBrandStyles} />}
                    <ProductDescription product={productContext} extendedStyles={styles.productDescriptionStyles} />
                    <Hidden {...styles.partNumbersHidden}>
                        <GridItem {...styles.partNumbersGridItem}>
                            <ProductPartNumbers
                                productNumber={product.productNumber}
                                customerProductNumber={product.customerProductNumber}
                                manufacturerItem={product.manufacturerItem}
                                extendedStyles={styles.productPartNumbersStyles}
                            />
                        </GridItem>
                        {wishListLine.notes && (
                            <GridItem {...styles.notesGridItem}>
                                <SmallHeadingAndText
                                    heading={translate("Notes")}
                                    text={wishListLine.notes}
                                    extendedStyles={styles.notesStyles}
                                />
                            </GridItem>
                        )}
                    </Hidden>
                </GridItem>
                <GridItem {...styles.priceAndAvailabilityGridItem}>
                    <GridContainer {...styles.priceAndAvailabilityInnerContainer}>
                        <GridItem {...styles.priceGridItem}>
                            <ProductPrice
                                product={productContext}
                                showSavings={true}
                                showSavingsAmount={productSettings.showSavingsAmount}
                                showSavingsPercent={productSettings.showSavingsPercent}
                                extendedStyles={styles.productPriceStyles}
                            />
                            <ProductQuantityBreakPricing extendedStyles={styles.quantityBreakPricing} />
                        </GridItem>
                        <GridItem {...styles.uomAndQuantityGridItem}>
                            <GridContainer {...styles.uomAndQuantityInnerContainer}>
                                {product.unitOfMeasures && product.unitOfMeasures.length > 1 && (
                                    <GridItem {...styles.uomGridItem}>
                                        <ProductUnitOfMeasureSelect
                                            extendedStyles={styles.productUnitOfMeasureSelectStyles}
                                        />
                                    </GridItem>
                                )}
                                <GridItem {...styles.quantityGridItem}>
                                    <ProductQuantityOrdered extendedStyles={styles.productQuantityOrderedStyles} />
                                </GridItem>
                            </GridContainer>
                        </GridItem>
                        <GridItem {...styles.availabilityGridItem}>
                            {productInfo.inventory && (
                                <ProductContextAvailability extendedStyles={styles.productAvailabilityStyles} />
                            )}
                        </GridItem>
                    </GridContainer>
                </GridItem>
                {wishListLine.notes && (
                    <Hidden {...styles.notesHidden}>
                        <GridItem {...styles.notesGridItem}>
                            <SmallHeadingAndText
                                heading={translate("Notes")}
                                text={wishListLine.notes}
                                extendedStyles={styles.notesStyles}
                            />
                        </GridItem>
                    </Hidden>
                )}
                <GridItem {...styles.buttonsGridItem}>
                    <ProductAddToCartButton extendedStyles={styles.addToCartButton} data-test-selector="addToCart" />
                    <ProductAddToListLink extendedStyles={styles.addToListLink} />
                </GridItem>
            </GridContainer>
        </ProductContext.Provider>
    );
};

const mapWishListLineToProduct = (wishListLine: WishListLineModel) => {
    const product = cloneDeep(wishListLine) as any as ProductModel;
    product.id = wishListLine.productId;
    product.productNumber = wishListLine.erpNumber;
    product.productTitle = wishListLine.shortDescription;
    product.unitOfMeasures =
        wishListLine?.productUnitOfMeasures?.map(u => ({
            id: u.productUnitOfMeasureId,
            ...u,
        })) || null;
    product.canAddToWishlist = true;
    return product;
};

export default connect(mapStateToProps, mapDispatchToProps)(StaticListProductListLine);
