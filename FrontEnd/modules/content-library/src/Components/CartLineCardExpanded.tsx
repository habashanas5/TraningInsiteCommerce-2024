import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { getStyledWrapper } from "@insite/client-framework/Common/StyledWrapper";
import { HasCartLineContext, withCartLine } from "@insite/client-framework/Components/CartLineContext";
import { Cart } from "@insite/client-framework/Services/CartService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import translate from "@insite/client-framework/Translate";
import { PromotionModel } from "@insite/client-framework/Types/ApiModels";
import ProductBrand, { ProductBrandStyles } from "@insite/content-library/Components/ProductBrand";
import ProductDescription, { ProductDescriptionStyles } from "@insite/content-library/Components/ProductDescription";
import ProductImage, { ProductImageStyles } from "@insite/content-library/Components/ProductImage";
import ProductPartNumbers, { ProductPartNumbersStyles } from "@insite/content-library/Components/ProductPartNumbers";
import ProductPrice, { ProductPriceStyles } from "@insite/content-library/Components/ProductPrice";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import CartLineNotes, { CartLineNotesStyles } from "@insite/content-library/Widgets/Cart/CartLineNotes";
import CartLineQuantity, { CartLineQuantityStyles } from "@insite/content-library/Widgets/Cart/CartLineQuantity";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps, TypographyProps } from "@insite/mobius/Typography";
import { breakpointMediaQueries } from "@insite/mobius/utilities";
import getColor from "@insite/mobius/utilities/getColor";
import React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    cart: Cart;
    promotions?: PromotionModel[];
    showSavingsAmount: boolean;
    showSavingsPercent: boolean;
    editable: boolean;
    showInvalidPriceMessage?: boolean;
    extendedStyles?: CartLineCardExpandedStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    enableVat: getSettingsCollection(state).productSettings.enableVat,
    vatPriceDisplay: getSettingsCollection(state).productSettings.vatPriceDisplay,
});

type Props = OwnProps & HasCartLineContext & ReturnType<typeof mapStateToProps>;

export interface CartLineCardExpandedStyles {
    cartLineNotes?: CartLineNotesStyles;
    price?: ProductPriceStyles;
    quantity?: CartLineQuantityStyles;
    container?: GridContainerProps;
    productImageGridItem?: GridItemProps;
    productImage?: ProductImageStyles;
    orderLineInfoGridItem?: GridItemProps;
    orderLineInfoContainer?: GridContainerProps;
    productDescriptionAndPartNumbersGridItem?: GridItemProps;
    productDescriptionAndPartNumbersContainer?: GridContainerProps;
    productBrand?: ProductBrandStyles;
    productBrandAndDescriptionGridItem?: GridItemProps;
    productDescription?: ProductDescriptionStyles;
    configurationGridItem?: GridItemProps;
    configurationOptionText?: TypographyProps;
    productPartNumbersGridItem?: GridItemProps;
    productPartNumbers?: ProductPartNumbersStyles;
    orderLineNotesGridItem?: GridItemProps;
    notesHeadingAndText?: SmallHeadingAndTextStyles;
    costCodeGridItem?: GridItemProps;
    costCodeValueText?: TypographyPresentationProps;
    costCodeLabelText?: TypographyPresentationProps;
    productPriceAndQuantityGridItem?: GridItemProps;
    productPriceAndQuantityContainer?: GridContainerProps;
    priceGridItem?: GridItemProps;
    priceHeadingAndText?: SmallHeadingAndTextStyles;
    promotionNameText?: TypographyProps;
    quantityGridItem?: GridItemProps;
    qtyHeadingAndText?: SmallHeadingAndTextStyles;
    extendedUnitNetPriceGridItem?: GridItemProps;
    extendedUnitNetPrice?: SmallHeadingAndTextStyles;
    subtotalWithoutVatText?: SmallHeadingAndTextStyles;
    vatAmount?: SmallHeadingAndTextStyles;
}

export const cartLineCardExpandedStyles: CartLineCardExpandedStyles = {
    container: {
        gap: 20,
        css: css`
            border-bottom: 1px solid ${getColor("common.border")};
            padding: 1rem 0;
        `,
    },
    productImageGridItem: {
        width: 2,
        printWidth: 1,
        css: css`
            @media print {
                max-height: 83px;
                max-width: 83px;
                padding: 0;
            }
        `,
    },
    orderLineInfoGridItem: {
        width: 10,
        printWidth: 11,
    },
    orderLineInfoContainer: {
        gap: 15,
    },
    productDescriptionAndPartNumbersGridItem: {
        width: [12, 12, 5, 5, 5],
        printWidth: 6,
    },
    productDescriptionAndPartNumbersContainer: {
        gap: 15,
    },
    productBrand: {
        nameText: {
            color: "text.main",
        },
    },
    productBrandAndDescriptionGridItem: {
        css: css`
            flex-direction: column;
        `,
        width: 12,
    },
    configurationGridItem: {
        width: 12,
        css: css`
            flex-direction: column;
        `,
    },
    productPartNumbersGridItem: {
        width: 12,
    },
    orderLineNotesGridItem: {
        width: 12,
    },
    costCodeGridItem: { width: 12 },
    costCodeLabelText: {
        weight: "bold",
        css: css`
            margin-right: 10px;
        `,
    },
    productPriceAndQuantityGridItem: {
        width: [12, 12, 7, 7, 7],
        printWidth: 6,
    },
    productPriceAndQuantityContainer: {
        gap: 15,
    },
    priceGridItem: {
        width: [12, 12, 5, 5, 5],
        printWidth: 5,
        css: css`
            flex-direction: column;
        `,
    },
    quantityGridItem: {
        width: [12, 12, 3, 3, 3],
    },
    extendedUnitNetPriceGridItem: {
        width: [12, 12, 4, 4, 4],
        css: css`
            flex-direction: column;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        null,
                        css`
                            flex-flow: wrap;
                        `,
                    ],
                    "max",
                )}
        `,
    },
    extendedUnitNetPrice: {
        text: {
            weight: 700,
        },
    },
    subtotalWithoutVatText: {
        wrapper: {
            css: css`
                margin-bottom: 6px;
                width: 100%;
                ${({ theme }: { theme: BaseTheme }) =>
                    breakpointMediaQueries(
                        theme,
                        [
                            null,
                            css`
                                width: 50%;
                            `,
                        ],
                        "max",
                    )}
            `,
        },
    },
    vatAmount: {
        wrapper: {
            css: css`
                margin-bottom: 6px;
                width: 100%;
                ${({ theme }: { theme: BaseTheme }) =>
                    breakpointMediaQueries(
                        theme,
                        [
                            null,
                            css`
                                width: 50%;
                            `,
                        ],
                        "max",
                    )}
            `,
        },
    },
};

const CartLineCardExpanded = ({
    cart,
    cartLine,
    showSavingsAmount,
    showSavingsPercent,
    promotions,
    editable,
    enableVat,
    vatPriceDisplay,
    showInvalidPriceMessage,
    extendedStyles,
}: Props) => {
    const [styles] = React.useState(() => mergeToNew(cartLineCardExpandedStyles, extendedStyles));

    return (
        <GridContainer
            {...styles.container}
            data-test-selector={`cartline_expanded_${cartLine.productId}_${cartLine.unitOfMeasure}`}
        >
            <GridItem {...styles.productImageGridItem}>
                <ProductImage product={cartLine} extendedStyles={styles.productImage} />
            </GridItem>
            <GridItem {...styles.orderLineInfoGridItem}>
                <GridContainer {...styles.orderLineInfoContainer}>
                    <GridItem {...styles.productDescriptionAndPartNumbersGridItem}>
                        <GridContainer {...styles.productDescriptionAndPartNumbersContainer}>
                            <GridItem {...styles.productBrandAndDescriptionGridItem}>
                                {cartLine.brand && (
                                    <ProductBrand brand={cartLine.brand} extendedStyles={styles.productBrand} />
                                )}
                                <ProductDescription product={cartLine} extendedStyles={styles.productDescription} />
                            </GridItem>
                            {!cartLine.isFixedConfiguration && cartLine.sectionOptions!.length > 0 && (
                                <GridItem {...styles.configurationGridItem}>
                                    {cartLine.sectionOptions!.map(option => (
                                        <Typography {...styles.configurationOptionText} key={option.sectionOptionId}>
                                            {`${option.sectionName}:${option.optionName}`}
                                        </Typography>
                                    ))}
                                </GridItem>
                            )}
                            <GridItem {...styles.productPartNumbersGridItem}>
                                <ProductPartNumbers
                                    productNumber={cartLine.erpNumber}
                                    customerProductNumber={cartLine.customerName}
                                    manufacturerItem={cartLine.manufacturerItem}
                                    extendedStyles={styles.productPartNumbers}
                                />
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    <GridItem {...styles.productPriceAndQuantityGridItem}>
                        <GridContainer {...styles.productPriceAndQuantityContainer}>
                            <GridItem {...styles.priceGridItem}>
                                <ProductPrice
                                    product={cartLine}
                                    showSavings={true}
                                    showSavingsAmount={showSavingsAmount}
                                    showSavingsPercent={showSavingsPercent}
                                    showInvalidPriceMessage={showInvalidPriceMessage}
                                    extendedStyles={styles.price}
                                />
                                {promotions?.map(promotion => (
                                    <Typography
                                        {...styles.promotionNameText}
                                        key={promotion.id}
                                        data-test-selector="orderLineCardExpandedPromotionName"
                                    >
                                        {promotion.name}
                                    </Typography>
                                ))}
                            </GridItem>
                            <GridItem {...styles.quantityGridItem}>
                                <CartLineQuantity cart={cart} editable={editable} extendedStyles={styles.quantity} />
                            </GridItem>
                            <GridItem {...styles.extendedUnitNetPriceGridItem}>
                                {cartLine.pricing && (
                                    <>
                                        {enableVat && vatPriceDisplay === "DisplayWithAndWithoutVat" && (
                                            <>
                                                <SmallHeadingAndText
                                                    heading={`${translate("Subtotal")} (${translate("Ex. VAT")})`}
                                                    text={cartLine.pricing.extendedUnitNetPriceDisplay}
                                                    extendedStyles={styles.subtotalWithoutVatText}
                                                />
                                                <SmallHeadingAndText
                                                    heading={`${translate("Total VAT")} (${cartLine.pricing.vatRate}%)`}
                                                    text={cartLine.pricing.vatAmountDisplay}
                                                    extendedStyles={styles.vatAmount}
                                                />
                                            </>
                                        )}
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
                                    </>
                                )}
                            </GridItem>
                        </GridContainer>
                    </GridItem>
                    {cartLine.notes && (
                        <GridItem {...styles.orderLineNotesGridItem}>
                            <CartLineNotes
                                cart={cart}
                                editable={editable}
                                label={translate("Line Notes")}
                                extendedStyles={styles.cartLineNotes}
                            />
                        </GridItem>
                    )}
                    {cart.showCostCode && cartLine.costCode && (
                        <GridItem {...styles.costCodeGridItem}>
                            <Typography {...styles.costCodeValueText} as="p">
                                <Typography {...styles.costCodeLabelText}>{cart.costCodeLabel}:</Typography>
                                {cartLine.costCode}
                            </Typography>
                        </GridItem>
                    )}
                </GridContainer>
            </GridItem>
        </GridContainer>
    );
};

export default connect(mapStateToProps)(withCartLine(CartLineCardExpanded));
