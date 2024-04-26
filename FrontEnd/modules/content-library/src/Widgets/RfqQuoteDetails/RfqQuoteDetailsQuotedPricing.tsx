import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import translate from "@insite/client-framework/Translate";
import { BreakPriceDto, QuoteLineModel, QuoteModel } from "@insite/client-framework/Types/ApiModels";
import DataTable, { DataTableProps } from "@insite/mobius/DataTable";
import DataTableCell, { DataTableCellProps } from "@insite/mobius/DataTable/DataTableCell";
import DataTableRow, { DataTableRowProps } from "@insite/mobius/DataTable/DataTableRow";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import React, { useState } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    quote: QuoteModel;
    quoteLine: QuoteLineModel;
    extendedStyles?: RfqQuoteDetailsQuotedPricingStyles;
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => ({
    enableVat: getSettingsCollection(state).productSettings.enableVat,
    vatPriceDisplay: getSettingsCollection(state).productSettings.vatPriceDisplay,
});

type Props = OwnProps & ReturnType<typeof mapStateToProps>;

export interface RfqQuoteDetailsQuotedPricingStyles {
    table?: DataTableProps;
    row?: DataTableRowProps;
    quantityCell?: DataTableCellProps;
    quantityText?: TypographyPresentationProps;
    priceCell?: DataTableCellProps;
    priceWithoutVatCell?: DataTableCellProps;
    priceText?: TypographyPresentationProps;
    vatLabelText?: TypographyPresentationProps;
}

export const rfqQuoteDetailsQuotedPricingStyles: RfqQuoteDetailsQuotedPricingStyles = {
    row: {
        evenRowCss: css`
            background: transparent;
        `,
    },
    quantityCell: {
        css: css`
            border: none;
            height: 30px;
            vertical-align: top;
        `,
    },
    priceCell: {
        css: css`
            border: none;
            height: 30px;
        `,
    },
    priceText: {
        weight: "bold",
    },
    priceWithoutVatCell: {
        css: css`
            border: none;
            height: 30px;
        `,
    },
    vatLabelText: {
        size: 12,
        css: css`
            display: block;
        `,
    },
};

const baseStyles = rfqQuoteDetailsQuotedPricingStyles;

const RfqQuoteDetailsQuotedPricing = ({ quote, quoteLine, enableVat, vatPriceDisplay, extendedStyles }: Props) => {
    const [styles] = useState(() => mergeToNew(baseStyles, extendedStyles));

    const getBreakQtyText = (
        quoteLine: QuoteLineModel,
        breakPrices: BreakPriceDto[],
        breakPrice: BreakPriceDto,
        index: number,
    ) => {
        if (index !== breakPrices.length - 1) {
            return `${breakPrice.breakQty} - ${breakPrices[index + 1].breakQty - 1}`;
        }

        if (quoteLine.maxQty > 0) {
            return `${breakPrice.breakQty} - ${quoteLine.maxQty}`;
        }

        return `${breakPrice.breakQty}+`;
    };

    const renderRow = (qty: string, price: string, priceWithVat: string) => {
        return (
            <DataTableRow key={qty} {...styles.row}>
                <DataTableCell {...styles.quantityCell}>
                    <VisuallyHidden>{translate("QTY")}</VisuallyHidden>
                    <Typography {...styles.quantityText}>{qty}</Typography>
                </DataTableCell>
                <DataTableCell {...styles.priceCell}>
                    <VisuallyHidden>{translate("Price")}</VisuallyHidden>
                    <Typography {...styles.priceText}>
                        {enableVat && vatPriceDisplay !== "DisplayWithoutVat" ? priceWithVat : price}
                    </Typography>
                    {enableVat && (
                        <Typography {...styles.vatLabelText}>
                            {vatPriceDisplay !== "DisplayWithoutVat"
                                ? `${translate("Inc. VAT")} (${quoteLine.pricing?.vatRate}%)`
                                : translate("Ex. VAT")}
                        </Typography>
                    )}
                </DataTableCell>
                {enableVat && vatPriceDisplay === "DisplayWithAndWithoutVat" && (
                    <DataTableCell {...styles.priceWithoutVatCell}>
                        <VisuallyHidden>{`${translate("Price")} ${translate("Ex. VAT")}`}</VisuallyHidden>
                        <Typography {...styles.priceText}>{price}</Typography>
                        <Typography {...styles.vatLabelText}>{translate("Ex. VAT")}</Typography>
                    </DataTableCell>
                )}
            </DataTableRow>
        );
    };

    const renderRows = () => {
        if (quote.isJobQuote) {
            return renderRow(
                quoteLine.qtyOrdered!.toString(),
                quoteLine.pricing!.unitNetPriceDisplay,
                quoteLine.pricing!.unitRegularPriceWithVatDisplay,
            );
        }

        if (!quoteLine.pricing?.unitRegularBreakPrices || quoteLine.pricing!.unitRegularBreakPrices.length === 0) {
            return renderRow(
                "1+",
                quoteLine.pricing!.unitNetPriceDisplay,
                quoteLine.pricing!.unitRegularPriceWithVatDisplay,
            );
        }

        const breakPrices = quoteLine.pricing.unitRegularBreakPrices;

        return (
            <>
                {breakPrices.map((breakPrice, index) => {
                    const breakQtyText = getBreakQtyText(quoteLine, breakPrices, breakPrice, index);
                    return renderRow(breakQtyText, breakPrice.breakPriceDisplay, breakPrice.breakPriceWithVatDisplay);
                })}
            </>
        );
    };

    return <DataTable {...styles.table}>{renderRows()}</DataTable>;
};

export default connect(mapStateToProps)(RfqQuoteDetailsQuotedPricing);
