import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import translate from "@insite/client-framework/Translate";
import { OrderModel } from "@insite/client-framework/Types/ApiModels";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import React, { FC } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    order?: OrderModel;
    extendedStyles?: OrderTotalDisplayStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    enableVat: getSettingsCollection(state).productSettings.enableVat,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export interface OrderTotalDisplayStyles {
    container?: GridContainerProps;
    subtotalLabelGridItem?: GridItemProps;
    subtotalLabel?: TypographyProps;
    subtotalValueGridItem?: GridItemProps;
    subtotalValue?: TypographyProps;
    discountsLabelGridItem?: GridItemProps;
    discountsLabel?: TypographyProps;
    discountsValueGridItem?: GridItemProps;
    discountsValue?: TypographyProps;
    shippingAndHandlingLabelGridItem?: GridItemProps;
    shippingAndHandlingLabel?: TypographyProps;
    shippingAndHandlingValueGridItem?: GridItemProps;
    shippingAndHandlingValue?: TypographyProps;
    otherChargesLabelGridItem?: GridItemProps;
    otherChargesLabel?: TypographyProps;
    otherChargesValueGridItem?: GridItemProps;
    otherChargesValue?: TypographyProps;
    taxLabelGridItem?: GridItemProps;
    taxLabel?: TypographyProps;
    taxValueGridItem?: GridItemProps;
    taxValue?: TypographyProps;
    totalLabelGridItem?: GridItemProps;
    totalLabel?: TypographyProps;
    totalValueGridItem?: GridItemProps;
    totalValue?: TypographyProps;
}

export const orderTotalDisplayStyles: OrderTotalDisplayStyles = {
    container: {
        gap: 10,
        css: css`
            background-color: ${getColor("common.accent")};
            padding: 20px;
        `,
    },
    subtotalLabelGridItem: { width: 6 },
    subtotalValueGridItem: {
        css: css`
            @media print {
                text-align: right;
            }
        `,
        width: 6,
    },
    subtotalValue: {
        css: css`
            margin-left: auto;
        `,
    },
    discountsLabelGridItem: { width: 6 },
    discountsValueGridItem: {
        css: css`
            @media print {
                text-align: right;
            }
        `,
        width: 6,
    },
    discountsValue: {
        css: css`
            margin-left: auto;
        `,
    },
    shippingAndHandlingLabelGridItem: { width: 6 },
    shippingAndHandlingValueGridItem: {
        css: css`
            @media print {
                text-align: right;
            }
        `,
        width: 6,
    },
    shippingAndHandlingValue: {
        css: css`
            margin-left: auto;
        `,
    },
    otherChargesLabelGridItem: { width: 6 },
    otherChargesValueGridItem: {
        css: css`
            @media print {
                text-align: right;
            }
        `,
        width: 6,
    },
    otherChargesValue: {
        css: css`
            margin-left: auto;
        `,
    },
    taxLabelGridItem: { width: 6 },
    taxValueGridItem: {
        css: css`
            @media print {
                text-align: right;
            }
        `,
        width: 6,
    },
    taxValue: {
        css: css`
            margin-left: auto;
        `,
    },
    totalLabelGridItem: { width: 6 },
    totalLabel: { weight: "bold" },
    totalValueGridItem: {
        css: css`
            @media print {
                text-align: right;
            }
        `,
        width: 6,
    },
    totalValue: {
        weight: "bold",
        css: css`
            margin-left: auto;
        `,
    },
};

const OrderTotalDisplay: FC<Props> = ({ order, enableVat, extendedStyles }) => {
    const [styles] = React.useState(() => mergeToNew(orderTotalDisplayStyles, extendedStyles));

    if (!order) {
        return null;
    }

    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.subtotalLabelGridItem}>
                <Typography {...styles.subtotalLabel}>
                    {translate("Subtotal") + (enableVat ? ` (${translate("Ex. VAT")})` : "")}
                </Typography>
            </GridItem>
            <GridItem {...styles.subtotalValueGridItem}>
                <Typography {...styles.subtotalValue}>{order.orderSubTotalDisplay}</Typography>
            </GridItem>
            {order.discountAmount > 0 && (
                <>
                    <GridItem {...styles.discountsLabelGridItem}>
                        <Typography {...styles.discountsLabel}>{translate("Discounts")}</Typography>
                    </GridItem>
                    <GridItem {...styles.discountsValueGridItem}>
                        <Typography {...styles.discountsValue}>{`-${order.orderDiscountAmountDisplay}`}</Typography>
                    </GridItem>
                </>
            )}
            {order.shippingCharges + order.handlingCharges > 0 && (
                <>
                    <GridItem {...styles.shippingAndHandlingLabelGridItem}>
                        <Typography {...styles.shippingAndHandlingLabel}>{translate("Shipping & Handling")}</Typography>
                    </GridItem>
                    <GridItem {...styles.shippingAndHandlingValueGridItem}>
                        <Typography {...styles.shippingAndHandlingValue}>{order.shippingAndHandlingDisplay}</Typography>
                    </GridItem>
                </>
            )}
            {order.otherCharges > 0 && (
                <>
                    <GridItem {...styles.otherChargesLabelGridItem}>
                        <Typography {...styles.otherChargesLabel}>{translate("Other Charges")}</Typography>
                    </GridItem>
                    <GridItem {...styles.otherChargesValueGridItem}>
                        <Typography {...styles.otherChargesValue}>{order.otherChargesDisplay}</Typography>
                    </GridItem>
                </>
            )}
            {(!order.orderHistoryTaxes || order.orderHistoryTaxes.length === 0) && (
                <>
                    <GridItem {...styles.taxLabelGridItem}>
                        <Typography {...styles.taxLabel}>{enableVat ? translate("VAT") : translate("Tax")}</Typography>
                    </GridItem>
                    <GridItem {...styles.taxValueGridItem}>
                        <Typography {...styles.taxValue} data-test-selector="orderDetails_totalTaxDisplay">
                            {order.totalTaxDisplay}
                        </Typography>
                    </GridItem>
                </>
            )}
            {order.orderHistoryTaxes &&
                order.orderHistoryTaxes.map(tax => (
                    <>
                        <GridItem {...styles.taxLabelGridItem}>
                            <Typography>{tax.taxDescription || translate("Tax")}</Typography>
                        </GridItem>
                        <GridItem {...styles.taxValueGridItem}>
                            <Typography {...styles.taxValue}>{tax.taxAmountDisplay}</Typography>
                        </GridItem>
                    </>
                ))}
            <GridItem {...styles.totalLabelGridItem}>
                <Typography {...styles.totalLabel}>{translate("Total")}</Typography>
            </GridItem>
            <GridItem {...styles.totalValueGridItem}>
                <Typography {...styles.totalValue} data-test-selector="orderDetail_orderGrandTotalDisplay">
                    {order.orderGrandTotalDisplay}
                </Typography>
            </GridItem>
        </GridContainer>
    );
};

export default connect(mapStateToProps)(OrderTotalDisplay);
