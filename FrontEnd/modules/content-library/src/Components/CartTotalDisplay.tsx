import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { Cart } from "@insite/client-framework/Services/CartService";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import translate from "@insite/client-framework/Translate";
import { PromotionModel } from "@insite/client-framework/Types/ApiModels";
import LocalizedCurrency from "@insite/content-library/Components/LocalizedCurrency";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import React, { FC, Fragment } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    isLoading?: boolean;
    /**
     * If true, displays an empty cart total UI.
     * If false, displays amounts from the cart.
     * Default value: false
     */
    isCartEmpty?: boolean;
    /**
     * If true, displays tax, shipping and handling, and total amounts.
     * If false, does not display tax, shipping and handling, or total amounts.
     * Default value: true
     */
    showTaxAndShipping?: boolean;
    cart?: Cart;
    orderPromotions?: PromotionModel[];
    shippingPromotions?: PromotionModel[];
    discountTotal?: number;
    extendedStyles?: CartTotalDisplayStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    enableVat: getSettingsCollection(state).productSettings.enableVat,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export interface CartTotalDisplayStyles {
    container?: GridContainerProps;
    labelGridItem?: GridItemProps;
    valueGridItem?: GridItemProps;
    subtotalLabel?: TypographyProps;
    subtotalValue?: TypographyProps;
    promotionLabel?: TypographyProps;
    promotionValue?: TypographyProps;
    discountsLabel?: TypographyProps;
    discountsValue?: TypographyProps;
    shippingAndHandlingLabel?: TypographyProps;
    shippingAndHandlingValue?: TypographyProps;
    otherChargesLabel?: TypographyProps;
    otherChargesValue?: TypographyProps;
    taxLabel?: TypographyProps;
    taxValue?: TypographyProps;
    totalLabel?: TypographyProps;
    totalValue?: TypographyProps;
    loadingSpinner?: LoadingSpinnerProps;
}

export const cartTotalDisplayStyles: CartTotalDisplayStyles = {
    container: {
        gap: 10,
        css: css`
            background-color: ${getColor("common.accent")};
            padding: 20px;
        `,
    },
    labelGridItem: { width: 6 },
    valueGridItem: { width: 6 },
    subtotalValue: {
        css: css`
            margin-left: auto;
        `,
    },
    promotionValue: {
        css: css`
            margin-left: auto;
        `,
    },
    discountsValue: {
        css: css`
            margin-left: auto;
        `,
    },
    shippingAndHandlingValue: {
        css: css`
            margin-left: auto;
        `,
    },
    otherChargesValue: {
        css: css`
            margin-left: auto;
        `,
    },
    taxValue: {
        css: css`
            margin-left: auto;
        `,
    },
    totalLabel: { weight: "bold" },
    totalValue: {
        weight: "bold",
        css: css`
            margin-left: auto;
        `,
    },
    loadingSpinner: {
        size: 15,
        css: css`
            margin-top: auto;
            margin-bottom: auto;
            margin-left: auto;
        `,
    },
};

const CartTotalDisplay = ({
    isCartEmpty = false,
    showTaxAndShipping = true,
    cart,
    orderPromotions,
    shippingPromotions,
    discountTotal,
    isLoading,
    enableVat,
    extendedStyles,
}: Props) => {
    const [styles] = React.useState(() => mergeToNew(cartTotalDisplayStyles, extendedStyles));

    if (isLoading || !cart) {
        return (
            <GridContainer {...styles.container}>
                {showTaxAndShipping && (
                    <>
                        <GridItem {...styles.labelGridItem}>
                            <Typography {...styles.totalLabel}>{translate("Total")}</Typography>
                        </GridItem>
                        <GridItem {...styles.valueGridItem}>
                            <LoadingSpinner {...styles.loadingSpinner} />
                        </GridItem>
                    </>
                )}
                {!showTaxAndShipping && (
                    <>
                        <GridItem {...styles.labelGridItem}>
                            <Typography {...styles.subtotalLabel}>
                                {translate("Subtotal") + (enableVat ? ` (${translate("Ex. VAT")})` : "")}
                            </Typography>
                        </GridItem>
                        <GridItem {...styles.valueGridItem}>
                            <LoadingSpinner {...styles.loadingSpinner} />
                        </GridItem>
                    </>
                )}
            </GridContainer>
        );
    }

    if (isCartEmpty) {
        return (
            <GridContainer {...styles.container}>
                {showTaxAndShipping && (
                    <>
                        <GridItem {...styles.labelGridItem}>
                            <Typography {...styles.totalLabel}>{translate("Total")}</Typography>
                        </GridItem>
                        <GridItem {...styles.valueGridItem}>
                            <Typography {...styles.totalValue}>{`${cart.currencySymbol} -`}</Typography>
                        </GridItem>
                    </>
                )}
                {!showTaxAndShipping && (
                    <>
                        <GridItem {...styles.labelGridItem}>
                            <Typography {...styles.subtotalLabel}>
                                {translate("Subtotal") + (enableVat ? ` (${translate("Ex. VAT")})` : "")}
                            </Typography>
                        </GridItem>
                        <GridItem {...styles.valueGridItem}>
                            <Typography {...styles.subtotalValue}>{`${cart.currencySymbol} -`}</Typography>
                        </GridItem>
                    </>
                )}
            </GridContainer>
        );
    }

    return (
        <GridContainer {...styles.container} data-test-selector={`cartTotal_${cart.id}`}>
            <GridItem {...styles.labelGridItem}>
                <Typography {...styles.subtotalLabel}>
                    {translate("Subtotal") + (enableVat ? ` (${translate("Ex. VAT")})` : "")}
                </Typography>
            </GridItem>
            <GridItem {...styles.valueGridItem}>
                <Typography {...styles.subtotalValue} data-test-selector="cartTotal_subTotal">
                    {cart.orderSubTotalDisplay}
                </Typography>
            </GridItem>
            {orderPromotions &&
                orderPromotions.map(promotion => (
                    <Fragment key={promotion.id}>
                        <GridItem {...styles.labelGridItem}>
                            <Typography {...styles.promotionLabel} data-test-selector="cartTotalOrderPromotionName">
                                {`${translate("Promotion")}: ${promotion.name}`}
                            </Typography>
                        </GridItem>
                        <GridItem {...styles.valueGridItem}>
                            <Typography {...styles.promotionValue} data-test-selector="cartTotalOrderPromotionValue">
                                {`-${promotion.amountDisplay}`}
                            </Typography>
                        </GridItem>
                    </Fragment>
                ))}
            {showTaxAndShipping && cart.shippingAndHandlingDisplay.length > 0 && (
                <>
                    <GridItem {...styles.labelGridItem}>
                        <Typography {...styles.shippingAndHandlingLabel}>{translate("Shipping & Handling")}</Typography>
                    </GridItem>
                    <GridItem {...styles.valueGridItem}>
                        <Typography
                            {...styles.shippingAndHandlingValue}
                            data-test-selector="cartTotalShippingAndHandlingAmount"
                        >
                            {cart.shippingAndHandlingDisplay}
                        </Typography>
                    </GridItem>
                </>
            )}
            {shippingPromotions &&
                shippingPromotions.map(promotion => (
                    <Fragment key={promotion.id}>
                        <GridItem {...styles.labelGridItem}>
                            <Typography {...styles.promotionLabel}>
                                {`${translate("Promotion")}: ${promotion.name}`}
                            </Typography>
                        </GridItem>
                        <GridItem {...styles.valueGridItem}>
                            <Typography {...styles.promotionValue} data-test-selector="cartTotalShippingPromotionValue">
                                {`-${promotion.amountDisplay}`}
                            </Typography>
                        </GridItem>
                    </Fragment>
                ))}
            {showTaxAndShipping && cart.totalTaxDisplay.length > 0 && cart.customerOrderTaxes!.length === 0 && (
                <>
                    <GridItem {...styles.labelGridItem}>
                        <Typography {...styles.taxLabel}>{enableVat ? translate("VAT") : translate("Tax")}</Typography>
                    </GridItem>
                    <GridItem {...styles.valueGridItem}>
                        <Typography {...styles.taxValue} data-test-selector="cartTotal_totalTaxDisplay">
                            {cart.totalTaxDisplay}
                        </Typography>
                    </GridItem>
                </>
            )}
            {showTaxAndShipping &&
                cart.customerOrderTaxes!.map(tax => {
                    const key = `${tax.taxCode}_${tax.sortOrder}`;
                    return (
                        <Fragment key={key}>
                            <GridItem {...styles.labelGridItem}>
                                <Typography>{tax.taxDescription || translate("Tax")}</Typography>
                            </GridItem>
                            <GridItem {...styles.valueGridItem}>
                                <Typography {...styles.taxValue}>{tax.taxAmountDisplay}</Typography>
                            </GridItem>
                        </Fragment>
                    );
                })}
            {showTaxAndShipping && (
                <>
                    <GridItem {...styles.labelGridItem}>
                        <Typography {...styles.totalLabel}>{translate("Total")}</Typography>
                    </GridItem>
                    <GridItem {...styles.valueGridItem}>
                        <Typography {...styles.totalValue} data-test-selector="cartTotalOrderGrandTotalDisplay">
                            {cart.orderGrandTotalDisplay}
                        </Typography>
                    </GridItem>
                </>
            )}
            {discountTotal !== undefined && discountTotal > 0 && (
                <>
                    <GridItem {...styles.labelGridItem}>
                        <Typography {...styles.discountsLabel}>{translate("Discounts")}</Typography>
                    </GridItem>
                    <GridItem {...styles.valueGridItem}>
                        <Typography {...styles.discountsValue}>
                            {`${translate("You saved")} `}{" "}
                            <LocalizedCurrency amount={discountTotal} currencySymbol={cart.currencySymbol} />
                        </Typography>
                    </GridItem>
                </>
            )}
        </GridContainer>
    );
};

export default connect(mapStateToProps)(CartTotalDisplay);
