import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getQuoteState } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import translate from "@insite/client-framework/Translate";
import RfqQuoteDetailsProposedDetailsGridItem, {
    RfqQuoteDetailsProposedDetailsGridItemStyles,
} from "@insite/content-library/Widgets/RfqQuoteDetails/RfqQuoteDetailsProposedDetailsGridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    quoteState: getQuoteState(state, state.pages.rfqQuoteDetails.quoteId),
    enableVat: getSettingsCollection(state).productSettings.enableVat,
    vatPriceDisplay: getSettingsCollection(state).productSettings.vatPriceDisplay,
});

type Props = ReturnType<typeof mapStateToProps>;

export interface RfqQuoteDetailsProposedDetailsGridStyles {
    mainWrapper?: InjectableCss;
    headerWrapper?: InjectableCss;
    countLabelText?: TypographyPresentationProps;
    countValueText?: TypographyPresentationProps;
    itemStyles?: RfqQuoteDetailsProposedDetailsGridItemStyles;
    footerWrapper?: InjectableCss;
    totalLabelText?: TypographyPresentationProps;
    totalValueText?: TypographyPresentationProps;
    vatLabelText?: TypographyPresentationProps;
    totalWithoutVatText?: TypographyPresentationProps;
}

export const rfqQuoteDetailsProposedDetailsGridStyles: RfqQuoteDetailsProposedDetailsGridStyles = {
    headerWrapper: {
        css: css`
            display: flex;
            padding-bottom: 15px;
            border-bottom: 1px solid ${getColor("common.border")};
        `,
    },
    countLabelText: {
        weight: 600,
        css: css`
            margin-left: 5px;
        `,
    },
    countValueText: {
        weight: 600,
    },
    footerWrapper: {
        css: css`
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            justify-content: flex-end;
            margin-top: 20px;
        `,
    },
    totalLabelText: {
        size: 20,
        weight: "bold",
        css: css`
            margin-right: 10px;
        `,
    },
    totalValueText: {
        size: 20,
    },
    vatLabelText: {
        size: 12,
    },
    totalWithoutVatText: {
        size: 20,
        css: css`
            margin-top: 5px;
        `,
    },
};

const styles = rfqQuoteDetailsProposedDetailsGridStyles;

const RfqQuoteDetailsProposedDetailsGrid = ({ quoteState, enableVat, vatPriceDisplay }: Props) => {
    const quote = quoteState.value;
    if (!quote || !quote.quoteLineCollection) {
        return null;
    }

    return (
        <StyledWrapper {...styles.mainWrapper}>
            <StyledWrapper {...styles.headerWrapper}>
                <Typography as="p" {...styles.countValueText}>
                    {quote.quoteLineCollection.length}
                    <Typography {...styles.countLabelText}>
                        {quote.quoteLineCollection.length > 1 ? translate("Products") : translate("Product")}
                    </Typography>
                </Typography>
            </StyledWrapper>
            {quote.quoteLineCollection.map(quoteLine => (
                <RfqQuoteDetailsProposedDetailsGridItem
                    key={`${quoteLine.productId}_${quoteLine.unitOfMeasure}`}
                    quote={quote}
                    quoteLine={quoteLine}
                    extendedStyles={styles.itemStyles}
                />
            ))}
            <StyledWrapper {...styles.footerWrapper}>
                <Typography {...styles.totalValueText} as="p">
                    <Typography {...styles.totalLabelText}>{translate("Total")}:</Typography>
                    {enableVat && vatPriceDisplay !== "DisplayWithoutVat"
                        ? quote.orderGrandTotalDisplay
                        : quote.orderSubTotalDisplay}
                </Typography>
                {enableVat && (
                    <>
                        <Typography as="p" {...styles.vatLabelText}>
                            {vatPriceDisplay === "DisplayWithVat" || vatPriceDisplay === "DisplayWithAndWithoutVat"
                                ? translate("Inc. VAT")
                                : translate("Ex. VAT")}
                        </Typography>
                        {vatPriceDisplay === "DisplayWithAndWithoutVat" && (
                            <>
                                <Typography {...styles.totalWithoutVatText}>{quote.orderSubTotalDisplay}</Typography>
                                <Typography as="p" {...styles.vatLabelText}>
                                    {translate("Ex. VAT")}
                                </Typography>
                            </>
                        )}
                    </>
                )}
            </StyledWrapper>
        </StyledWrapper>
    );
};

export default connect(mapStateToProps)(RfqQuoteDetailsProposedDetailsGrid);
