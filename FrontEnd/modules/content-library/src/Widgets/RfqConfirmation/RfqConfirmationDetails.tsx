import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getQuoteState } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import { RfqConfirmationPageContext } from "@insite/content-library/Pages/RfqConfirmationPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React, { FC } from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    quoteState: getQuoteState(state, state.pages.rfqConfirmation.quoteId),
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface RfqConfirmationDetailsStyles {
    detailsGridContainer?: GridContainerProps;
    leftColumnGridItem?: GridItemProps;
    leftColumnInnerGridContainer?: GridContainerProps;
    jobNameGridItem?: GridItemProps;
    jobNameHeadingAndText?: SmallHeadingAndTextStyles;
    salesRepGridItem?: GridItemProps;
    salesRepHeadingAndText?: SmallHeadingAndTextStyles;
    statusGridItem?: GridItemProps;
    statusHeadingAndText?: SmallHeadingAndTextStyles;
    dateGridItem?: GridItemProps;
    dateLabelText?: TypographyPresentationProps;
    customerGridItem?: GridItemProps;
    customerHeadingAndText?: SmallHeadingAndTextStyles;
    shipToGridItem?: GridItemProps;
    shipToHeadingAndText?: SmallHeadingAndTextStyles;
    rightColumnGridItem?: GridItemProps;
    notesHeadingAndText?: SmallHeadingAndTextStyles;
}

export const rfqConfirmationDetailsStyles: RfqConfirmationDetailsStyles = {
    detailsGridContainer: {
        gap: 10,
        css: css`
            margin-bottom: 20px;
        `,
    },
    leftColumnGridItem: { width: [12, 12, 12, 6, 6] },
    leftColumnInnerGridContainer: { gap: 10 },
    jobNameGridItem: { width: [6, 6, 4, 4, 4] },
    jobNameHeadingAndText: {
        heading: { transform: "initial", weight: "bold", size: 14 },
    },
    salesRepGridItem: { width: [6, 6, 4, 4, 4] },
    salesRepHeadingAndText: {
        heading: { transform: "initial", weight: "bold", size: 14 },
    },
    statusGridItem: { width: [6, 6, 4, 4, 4] },
    statusHeadingAndText: {
        heading: { transform: "initial", weight: "bold", size: 14 },
    },
    dateGridItem: {
        width: [6, 6, 4, 4, 4],
        css: css`
            flex-direction: column;
        `,
    },
    dateLabelText: { weight: "bold", size: 14 },
    customerGridItem: { width: 12 },
    customerHeadingAndText: {
        heading: { transform: "initial", weight: "bold", size: 14 },
    },
    shipToGridItem: { width: 12 },
    shipToHeadingAndText: {
        heading: { transform: "initial", weight: "bold", size: 14 },
    },
    rightColumnGridItem: { width: [12, 12, 12, 6, 6] },
    notesHeadingAndText: {
        heading: { transform: "initial", weight: "bold", size: 14 },
    },
};

const styles = rfqConfirmationDetailsStyles;

const RfqConfirmationDetails: FC<Props> = ({ quoteState }) => {
    if (!quoteState.value) {
        return null;
    }

    const quote = quoteState.value;

    return (
        <GridContainer {...styles.detailsGridContainer}>
            <GridItem {...styles.leftColumnGridItem}>
                <GridContainer {...styles.leftColumnInnerGridContainer}>
                    {quote.isJobQuote && (
                        <GridItem {...styles.jobNameGridItem}>
                            <SmallHeadingAndText
                                heading={translate("Job Name")}
                                text={quote.jobName}
                                extendedStyles={styles.jobNameHeadingAndText}
                            />
                        </GridItem>
                    )}
                    <GridItem {...styles.salesRepGridItem}>
                        <SmallHeadingAndText
                            heading={translate("Sales Rep")}
                            text={quote.salespersonName}
                            extendedStyles={styles.salesRepHeadingAndText}
                        />
                    </GridItem>
                    <GridItem {...styles.statusGridItem}>
                        <SmallHeadingAndText
                            heading={translate("Status")}
                            text={quote.statusDisplay}
                            extendedStyles={styles.statusHeadingAndText}
                        />
                    </GridItem>
                    {quote.orderDate && (
                        <GridItem {...styles.dateGridItem}>
                            <Typography {...styles.dateLabelText}>{translate("Date Submitted")}</Typography>
                            <LocalizedDateTime
                                dateTime={quote.orderDate}
                                options={{ year: "numeric", month: "numeric", day: "numeric" }}
                            />
                        </GridItem>
                    )}
                    {quote.billTo && (
                        <GridItem {...styles.customerGridItem}>
                            <SmallHeadingAndText
                                heading={translate("Customer")}
                                text={quote.customerName}
                                extendedStyles={styles.customerHeadingAndText}
                            />
                        </GridItem>
                    )}
                    <GridItem {...styles.shipToGridItem}>
                        <SmallHeadingAndText
                            heading={translate(quote.fulfillmentMethod === "PickUp" ? "Pick Up" : "Ship To")}
                            text={quote.shipToFullAddress}
                            extendedStyles={styles.shipToHeadingAndText}
                        />
                    </GridItem>
                </GridContainer>
            </GridItem>
            <GridItem {...styles.rightColumnGridItem}>
                {quote.notes.trim().length > 0 && (
                    <SmallHeadingAndText
                        heading={translate("Notes")}
                        text={quote.notes}
                        extendedStyles={styles.notesHeadingAndText}
                    />
                )}
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(RfqConfirmationDetails),
    definition: {
        displayName: "Details",
        allowedContexts: [RfqConfirmationPageContext],
        fieldDefinitions: [],
        group: "RFQ Quote Confirmation",
    },
};

export default widgetModule;
