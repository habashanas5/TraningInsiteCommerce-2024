import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { InvoiceStateContext } from "@insite/client-framework/Store/Data/Invoices/InvoicesSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { InvoiceDetailsPageContext } from "@insite/content-library/Pages/InvoiceDetailsPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import React, { Fragment, useContext } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    enableVat: getSettingsCollection(state).productSettings.enableVat,
});

type Props = ReturnType<typeof mapStateToProps>;

export interface InvoiceDetailsTotalStyles {
    container?: GridContainerProps;
    labelGridItem?: GridItemProps;
    valueGridItem?: GridItemProps;
    subtotalLabelText?: TypographyProps;
    subtotalValueText?: TypographyProps;
    discountsLabelText?: TypographyProps;
    discountsValueText?: TypographyProps;
    shippingAndHandlingLabelText?: TypographyProps;
    shippingAndHandlingValueText?: TypographyProps;
    otherChargesLabelText?: TypographyProps;
    otherChargesValueText?: TypographyProps;
    taxLabelText?: TypographyProps;
    taxValueText?: TypographyProps;
    totalLabelText?: TypographyProps;
    totalValueText?: TypographyProps;
}

export const totalStyles: InvoiceDetailsTotalStyles = {
    container: {
        gap: 10,
        css: css`
            background-color: ${getColor("common.accent")};
            padding: 20px;
        `,
    },
    labelGridItem: { width: 6 },
    valueGridItem: { width: 6 },
    subtotalValueText: {
        css: css`
            margin-left: auto;
        `,
    },
    discountsValueText: {
        css: css`
            margin-left: auto;
        `,
    },
    shippingAndHandlingValueText: {
        css: css`
            margin-left: auto;
        `,
    },
    otherChargesValueText: {
        css: css`
            margin-left: auto;
        `,
    },
    taxValueText: {
        css: css`
            margin-left: auto;
        `,
    },
    totalLabelText: { weight: "bold" },
    totalValueText: {
        weight: "bold",
        css: css`
            margin-left: auto;
        `,
    },
};

const styles = totalStyles;

const InvoiceDetailsTotal = ({ enableVat }: Props) => {
    const { value: invoice } = useContext(InvoiceStateContext);
    if (!invoice) {
        return null;
    }

    return (
        <GridContainer {...styles.container} data-test-selector="invoiceDetails_total">
            <GridItem {...styles.labelGridItem}>
                <Typography {...styles.subtotalLabelText}>
                    {translate("Subtotal") + (enableVat ? ` (${translate("Ex. VAT")})` : "")}
                </Typography>
            </GridItem>
            <GridItem {...styles.valueGridItem}>
                <Typography {...styles.subtotalValueText}>{invoice.productTotalDisplay}</Typography>
            </GridItem>
            {invoice.discountAmount > 0 && (
                <>
                    <GridItem {...styles.labelGridItem}>
                        <Typography {...styles.discountsLabelText}>{translate("Discounts")}</Typography>
                    </GridItem>
                    <GridItem {...styles.valueGridItem}>
                        <Typography {...styles.discountsValueText}>{invoice.discountAmountDisplay}</Typography>
                    </GridItem>
                </>
            )}
            {invoice.shippingAndHandling > 0 && (
                <>
                    <GridItem {...styles.labelGridItem}>
                        <Typography {...styles.shippingAndHandlingLabelText}>
                            {translate("Shipping & Handling")}
                        </Typography>
                    </GridItem>
                    <GridItem {...styles.valueGridItem}>
                        <Typography {...styles.shippingAndHandlingValueText}>
                            {invoice.shippingAndHandlingDisplay}
                        </Typography>
                    </GridItem>
                </>
            )}
            {invoice.otherCharges > 0 && (
                <>
                    <GridItem {...styles.labelGridItem}>
                        <Typography {...styles.otherChargesLabelText}>{translate("Other Charges")}</Typography>
                    </GridItem>
                    <GridItem {...styles.valueGridItem}>
                        <Typography {...styles.otherChargesValueText}>{invoice.otherChargesDisplay}</Typography>
                    </GridItem>
                </>
            )}
            {(!invoice.invoiceHistoryTaxes || invoice.invoiceHistoryTaxes.length === 0) && (
                <>
                    <GridItem {...styles.labelGridItem}>
                        <Typography {...styles.taxLabelText}>
                            {enableVat ? translate("VAT") : translate("Tax")}
                        </Typography>
                    </GridItem>
                    <GridItem {...styles.valueGridItem}>
                        <Typography {...styles.taxValueText}>{invoice.taxAmountDisplay}</Typography>
                    </GridItem>
                </>
            )}
            {invoice.invoiceHistoryTaxes &&
                invoice
                    .invoiceHistoryTaxes!.sort(tax => tax.sortOrder)
                    .map(tax => {
                        const key = `${tax.taxCode}_${tax.sortOrder}`;
                        return (
                            <Fragment key={key}>
                                <GridItem {...styles.labelGridItem}>
                                    <Typography>{tax.taxDescription || translate("Taxes")}</Typography>
                                </GridItem>
                                <GridItem {...styles.valueGridItem}>
                                    <Typography {...styles.taxValueText}>{tax.taxAmountDisplay}</Typography>
                                </GridItem>
                            </Fragment>
                        );
                    })}
            <GridItem {...styles.labelGridItem}>
                <Typography {...styles.totalLabelText}>{translate("Invoice Total")}</Typography>
            </GridItem>
            <GridItem {...styles.valueGridItem}>
                <Typography {...styles.totalValueText}>{invoice.invoiceTotalDisplay}</Typography>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(InvoiceDetailsTotal),
    definition: {
        group: "Invoice History",
        displayName: "Total",
        allowedContexts: [InvoiceDetailsPageContext],
    },
};

export default widgetModule;
