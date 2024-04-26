import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getJobQuoteState } from "@insite/client-framework/Store/Data/JobQuotes/JobQuotesSelector";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import { RfqQuoteDetailsPageContext } from "@insite/content-library/Pages/RfqQuoteDetailsPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    jobQuoteState: getJobQuoteState(state, state.pages.rfqJobQuoteDetails.jobQuoteId),
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface RfqQuoteDetailsInformationStyles {
    detailsGridContainer?: GridContainerProps;
    expirationDateGridItem?: GridItemProps;
    expirationDateLabelText?: TypographyPresentationProps;
    jobNameGridItem?: GridItemProps;
    jobNameHeadingAndText?: SmallHeadingAndTextStyles;
    customerGridItem?: GridItemProps;
    customerHeadingAndText?: SmallHeadingAndTextStyles;
    shipToGridItem?: GridItemProps;
    shipToHeadingAndText?: SmallHeadingAndTextStyles;
}

export const rfqQuoteDetailsInformationStyles: RfqQuoteDetailsInformationStyles = {
    detailsGridContainer: {
        gap: 20,
        css: css`
            margin-bottom: 20px;
        `,
    },
    expirationDateGridItem: {
        width: [6, 6, 4, 2, 2],
        css: css`
            flex-direction: column;
        `,
    },
    expirationDateLabelText: { weight: "bold", size: 14 },
    jobNameGridItem: { width: [6, 6, 4, 2, 2] },
    jobNameHeadingAndText: {
        heading: { transform: "initial", weight: "bold", size: 14 },
    },
    customerGridItem: { width: 12 },
    customerHeadingAndText: {
        heading: { transform: "initial", weight: "bold", size: 14 },
    },
    shipToGridItem: { width: 12 },
    shipToHeadingAndText: {
        heading: { transform: "initial", weight: "bold", size: 14 },
    },
};

const styles = rfqQuoteDetailsInformationStyles;

const RfqJobQuoteDetailsInformation = ({ jobQuoteState }: Props) => {
    const jobQuote = jobQuoteState.value;

    if (!jobQuote) {
        return null;
    }

    return (
        <GridContainer {...styles.detailsGridContainer} data-test-selector="rfqQuoteDetails_info">
            <GridItem {...styles.jobNameGridItem}>
                <SmallHeadingAndText
                    heading={translate("Job Name")}
                    text={jobQuote.jobName}
                    extendedStyles={styles.jobNameHeadingAndText}
                />
            </GridItem>
            {jobQuote.expirationDate && (
                <GridItem {...styles.expirationDateGridItem}>
                    <Typography {...styles.expirationDateLabelText}>{translate("Expiration Date")}</Typography>
                    <LocalizedDateTime
                        dateTime={jobQuote.expirationDate}
                        options={{ year: "numeric", month: "numeric", day: "numeric" }}
                    />
                </GridItem>
            )}
            {jobQuote.billTo && (
                <GridItem {...styles.customerGridItem}>
                    <SmallHeadingAndText
                        heading={translate("Customer")}
                        text={jobQuote.customerName}
                        extendedStyles={styles.customerHeadingAndText}
                    />
                </GridItem>
            )}
            <GridItem {...styles.shipToGridItem}>
                <SmallHeadingAndText
                    heading={translate(jobQuote.fulfillmentMethod === "PickUp" ? "Pick Up" : "Ship To")}
                    text={jobQuote.shipToFullAddress}
                    extendedStyles={styles.shipToHeadingAndText}
                />
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(RfqJobQuoteDetailsInformation),
    definition: {
        displayName: "Details",
        allowedContexts: [RfqQuoteDetailsPageContext],
        fieldDefinitions: [],
        group: "RFQ Job Quote Details",
    },
};

export default widgetModule;
