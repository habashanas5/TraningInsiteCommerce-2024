import addDays from "@insite/client-framework/Common/Utilities/addDays";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getQuoteState } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import setExpirationDate from "@insite/client-framework/Store/Pages/RfqQuoteDetails/Handlers/SetExpirationDate";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import SmallHeadingAndText, { SmallHeadingAndTextStyles } from "@insite/content-library/Components/SmallHeadingAndText";
import { RfqQuoteDetailsPageContext } from "@insite/content-library/Pages/RfqQuoteDetailsPage";
import DatePicker, { DatePickerPresentationProps, DatePickerState } from "@insite/mobius/DatePicker";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    quoteState: getQuoteState(state, state.pages.rfqQuoteDetails.quoteId),
    expirationDate: state.pages.rfqQuoteDetails.expirationDate,
    expirationDateError: state.pages.rfqQuoteDetails.expirationDateError,
    quoteSettings: getSettingsCollection(state).quoteSettings,
});

const mapDispatchToProps = {
    setExpirationDate,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RfqQuoteDetailsInformationStyles {
    detailsGridContainer?: GridContainerProps;
    expirationDateGridItem?: GridItemProps;
    expirationDateDatePicker?: DatePickerPresentationProps;
    expirationDateLabelText?: TypographyPresentationProps;
    jobNameGridItem?: GridItemProps;
    jobNameHeadingAndText?: SmallHeadingAndTextStyles;
    salesRepGridItem?: GridItemProps;
    salesRepHeadingAndText?: SmallHeadingAndTextStyles;
    userGridItem?: GridItemProps;
    userHeadingAndText?: SmallHeadingAndTextStyles;
    statusGridItem?: GridItemProps;
    statusHeadingAndText?: SmallHeadingAndTextStyles;
    dateGridItem?: GridItemProps;
    dateLabelText?: TypographyPresentationProps;
    customerGridItem?: GridItemProps;
    customerHeadingAndText?: SmallHeadingAndTextStyles;
    shipToGridItem?: GridItemProps;
    shipToHeadingAndText?: SmallHeadingAndTextStyles;
    notesGridItem?: GridItemProps;
    notesHeadingAndText?: SmallHeadingAndTextStyles;
}

export const rfqQuoteDetailsInformationStyles: RfqQuoteDetailsInformationStyles = {
    detailsGridContainer: {
        gap: 20,
        css: css`
            margin-bottom: 20px;
        `,
    },
    expirationDateGridItem: {
        width: 12,
        css: css`
            flex-direction: column;
        `,
    },
    expirationDateDatePicker: {
        cssOverrides: {
            datePicker: css`
                width: 200px;
            `,
        },
    },
    expirationDateLabelText: { weight: "bold", size: 14 },
    jobNameGridItem: { width: [6, 6, 4, 4, 4] },
    jobNameHeadingAndText: {
        heading: { transform: "initial", weight: "bold", size: 14 },
    },
    salesRepGridItem: { width: [6, 6, 4, 4, 4] },
    salesRepHeadingAndText: {
        heading: { transform: "initial", weight: "bold", size: 14 },
    },
    userGridItem: { width: [6, 6, 4, 4, 4] },
    userHeadingAndText: {
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
    notesGridItem: { width: 12 },
    notesHeadingAndText: {
        heading: { transform: "initial", weight: "bold", size: 14 },
    },
};

const styles = rfqQuoteDetailsInformationStyles;

const RfqQuoteDetailsInformation = ({
    quoteState,
    expirationDate,
    expirationDateError,
    setExpirationDate,
    quoteSettings,
}: Props) => {
    const quote = quoteState.value;

    const expirationDateChangeHandler = ({ selectedDay }: Pick<DatePickerState, "selectedDay">) => {
        setExpirationDate({ expirationDate: selectedDay });
    };

    if (!quote) {
        return null;
    }

    const expirationDateLabel = translate(`${quote.isJobQuote ? "Job" : "Quote"} Expiration Date`);

    return (
        <GridContainer {...styles.detailsGridContainer} data-test-selector="rfqQuoteDetails_info">
            {quote.isEditable && (
                <GridItem {...styles.expirationDateGridItem} data-test-selector="rfqQuoteDetails_expirationDate">
                    <DatePicker
                        {...styles.expirationDateDatePicker}
                        label={expirationDateLabel}
                        selectedDay={expirationDate}
                        error={expirationDateError}
                        dateTimePickerProps={{
                            minDate: new Date(),
                            maxDate: quote.isJobQuote ? undefined : addDays(new Date(), quoteSettings.quoteExpireDays),
                            ...styles.expirationDateDatePicker?.dateTimePickerProps,
                        }}
                        onDayChange={expirationDateChangeHandler}
                    />
                </GridItem>
            )}
            {!quote.isEditable && quote.expirationDate && (
                <GridItem {...styles.expirationDateGridItem}>
                    <Typography {...styles.expirationDateLabelText}>{expirationDateLabel}</Typography>
                    <LocalizedDateTime
                        dateTime={quote.expirationDate}
                        options={{ year: "numeric", month: "numeric", day: "numeric" }}
                    />
                </GridItem>
            )}
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
            <GridItem {...styles.userGridItem}>
                <SmallHeadingAndText
                    heading={translate("User")}
                    text={quote.userName}
                    extendedStyles={styles.userHeadingAndText}
                    data-test-selector="user"
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
            {quote.notes.trim().length > 0 && (
                <GridItem {...styles.notesGridItem}>
                    <SmallHeadingAndText
                        heading={translate("Notes")}
                        text={quote.notes}
                        extendedStyles={styles.notesHeadingAndText}
                    />
                </GridItem>
            )}
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RfqQuoteDetailsInformation),
    definition: {
        displayName: "Details",
        allowedContexts: [RfqQuoteDetailsPageContext],
        fieldDefinitions: [],
        group: "RFQ Quote Details",
    },
};

export default widgetModule;
