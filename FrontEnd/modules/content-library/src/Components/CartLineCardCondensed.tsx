import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { HasCartLineContext, withCartLine } from "@insite/client-framework/Components/CartLineContext";
import { Cart } from "@insite/client-framework/Services/CartService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import translate from "@insite/client-framework/Translate";
import { PromotionModel } from "@insite/client-framework/Types/ApiModels";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import ProductImage, { ProductImageStyles } from "@insite/content-library/Components/ProductImage";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import CartLineQuantity, { CartLineQuantityStyles } from "@insite/content-library/Widgets/Cart/CartLineQuantity";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import React, { FC } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    cart: Cart;
    promotions?: PromotionModel[];
    editable: boolean;
    showInvalidPriceMessage?: boolean;
    extendedStyles?: CartLineCardCondensedStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    enableVat: getSettingsCollection(state).productSettings.enableVat,
    vatPriceDisplay: getSettingsCollection(state).productSettings.vatPriceDisplay,
});

type Props = OwnProps & HasCartLineContext & ReturnType<typeof mapStateToProps>;

export interface CartLineCardCondensedStyles {
    container?: GridContainerProps;
    productImageGridItem?: GridItemProps;
    productImage?: ProductImageStyles;
    orderLineInfoGridItem?: GridItemProps;
    orderLineInfoContainer?: GridContainerProps;
    infoLeftColumn?: GridItemProps;
    infoLeftColumnContainer?: GridContainerProps;
    productBrandAndDescriptionGridItem?: GridItemProps;
    productBrand?: ProductBrandStyles;
    productDescription?: ProductDescriptionStyles;
    productErpNumberText?: TypographyPresentationProps;
    productPriceAndQuantityGridItem?: GridItemProps;
    productPriceAndQuantityContainer?: GridContainerProps;
    priceGridItem?: GridItemProps;
    price?: ProductPriceStyles;
    priceHeadingAndText?: SmallHeadingAndTextStyles;
    quantityGridItem?: GridItemProps;
    quantity?: CartLineQuantityStyles;
    extendedUnitNetPriceGridItem?: GridItemProps;
    extendedUnitNetPrice?: SmallHeadingAndTextStyles;
}

export const cartLineCardCondensedStyles: CartLineCardCondensedStyles = {
    container: {
        gap: 20,
        css: css`
            border-bottom: 1px solid ${getColor("common.border")};
            padding: 1rem 0;
        `,
    },
    productImageGridItem: {
        width: 2,
    },
    orderLineInfoGridItem: {
        width: 10,
    },
    orderLineInfoContainer: {
        gap: 20,
    },
    infoLeftColumn: {
        width: [12, 12, 5, 5, 5],
    },
    infoLeftColumnContainer: {
        gap: 10,
    },
    productBrandAndDescriptionGridItem: {
        css: css`
            flex-direction: column;
        `,
        width: 12,
    },
    productBrand: {
        nameText: {
            color: "text.main",
        },
    },
    productErpNumberText: {
        css: css`
            width: 100%;
            word-wrap: break-word;
        `,
    },
    productPriceAndQuantityGridItem: {
        width: [12, 12, 7, 7, 7],
    },
    productPriceAndQuantityContainer: {
        gap: 10,
    },
    priceGridItem: {
        width: 5,
    },
    quantityGridItem: {
        width: 3,
    },
    extendedUnitNetPriceGridItem: {
        width: 4,
        css: css`
            flex-direction: column;
        `,
    },
    extendedUnitNetPrice: {
        text: {
            weight: 700,
        },
    },
};

const CartLineCardCondensed = ({
    cart,
    cartLine,
    editable,
    enableVat,
    vatPriceDisplay,
    showInvalidPriceMessage,
    extendedStyles,
}: Props) => {
    const [styles] = React.useState(() => mergeToNew(cartLineCardCondensedStyles, extendedStyles));

    return (
        <GridContainer
            {...styles.container}
            data-test-selector={`cartline_condensed_${cartLine.productId}_${cartLine.unitOfMeasure}`}
        >
            <GridItem {...styles.productImageGridItem}>
                <ProductImage product={cartLine} extendedStyles={styles.productImage} />
            </GridItem>
            <GridItem {...styles.orderLineInfoGridItem}>
                <GridContainer {...styles.orderLineInfoContainer}>
                    <GridItem {...styles.infoLeftColumn}>
                        <GridContainer {...styles.infoLeftColumnContainer}>
                            <GridItem {...styles.productBrandAndDescriptionGridItem}>
                                {cartLine.brand && (
                                    <ProductBrand brand={cartLine.brand} extendedStyles={styles.productBrand} />
                                )}
                                <ProductDescription product={cartLine} extendedStyles={styles.productDescription} />
                                <Typography {...styles.productErpNumberText}>{cartLine.erpNumber}</Typography>
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    <GridItem {...styles.productPriceAndQuantityGridItem}>
                        <GridContainer {...styles.productPriceAndQuantityContainer}>
                            <GridItem {...styles.priceGridItem}>
                                <ProductPrice
                                    product={cartLine}
                                    currencySymbol={cart.currencySymbol}
                                    showInvalidPriceMessage={showInvalidPriceMessage}
                                    extendedStyles={styles.price}
                                />
                            </GridItem>
                            <GridItem {...styles.quantityGridItem}>
                                <CartLineQuantity cart={cart} extendedStyles={styles.quantity} editable={editable} />
                            </GridItem>
                            <GridItem {...styles.extendedUnitNetPriceGridItem}>
                                {cartLine.pricing && (
                                    <SmallHeadingAndText
                                        heading={
                                            !enableVat
                                                ? translate("Subtotal")
                                                : vatPriceDisplay !== "DisplayWithoutVat"
                                                ? `${translate("Subtotal")} (${translate("Inc. VAT")})`
                                                : `${translate("Subtotal")} (${translate("Ex. VAT")})`
                                        }
                                        text={
                                            enableVat && vatPriceDisplay !== "DisplayWithoutVat"
                                                ? cartLine.pricing.extendedUnitRegularPriceWithVatDisplay
                                                : cartLine.pricing.extendedUnitNetPriceDisplay
                                        }
                                        extendedStyles={styles.extendedUnitNetPrice}
                                    />
                                )}
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                </GridContainer>
            </GridItem>
        </GridContainer>
    );
};

export default connect(mapStateToProps)(withCartLine(CartLineCardCondensed));
