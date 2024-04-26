import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getJobQuotesDataView } from "@insite/client-framework/Store/Data/JobQuotes/JobQuotesSelector";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RfqJobQuotesPageContext } from "@insite/content-library/Pages/RfqJobQuotesPage";
import DataTable, { DataTableProps } from "@insite/mobius/DataTable";
import DataTableBody, { DataTableBodyProps } from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell, { DataTableCellProps } from "@insite/mobius/DataTable/DataTableCell";
import DataTableHead, { DataTableHeadProps } from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow, { DataTableRowProps } from "@insite/mobius/DataTable/DataTableRow";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    jobQuotesDataView: getJobQuotesDataView(state, state.pages.rfqJobQuotes.getJobQuotesParameter),
    rfqJobQuoteDetailsPageUrl: getPageLinkByPageType(state, "RfqJobQuoteDetailsPage")?.url,
    language: state.context.session.language,
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface RfqJobQuotesTableStyles {
    wrapper?: InjectableCss;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    noResultsContainer?: InjectableCss;
    noResultsText?: TypographyPresentationProps;
    countText?: TypographyPresentationProps;
    dataTable?: DataTableProps;
    dataTableHead?: DataTableHeadProps;
    dataTableHeaders?: DataTableHeaderProps;
    dataTableBody?: DataTableBodyProps;
    dataTableRow?: DataTableRowProps;
    jobQuoteNumberHeader?: DataTableHeaderProps;
    expirationDateHeader?: DataTableHeaderProps;
    jobNameHeader?: DataTableHeaderProps;
    customerHeader?: DataTableHeaderProps;
    shipToHeader?: DataTableHeaderProps;
    jobQuoteNumberCell?: DataTableCellProps;
    jobQuoteLink?: LinkPresentationProps;
    expirationDateCell?: DataTableCellProps;
    jobNameCell?: DataTableCellProps;
    customerCell?: DataTableCellProps;
    shipToCell?: DataTableCellProps;
}

export const rfqJobQuotesTableStyles: RfqJobQuotesTableStyles = {
    wrapper: {
        css: css`
            overflow: auto;
        `,
    },
    centeringWrapper: {
        css: css`
            height: 300px;
            display: flex;
            align-items: center;
        `,
    },
    spinner: {
        css: css`
            margin: auto;
        `,
    },
    noResultsContainer: {
        css: css`
            text-align: center;
            padding: 20px;
        `,
    },
    noResultsText: {
        size: 16,
        weight: 600,
    },
    countText: {
        weight: 800,
        css: css`
            padding: 10px 0;
        `,
    },
    customerCell: {
        typographyProps: {
            ellipsis: true,
            css: css`
                display: block;
                max-width: 400px;
            `,
        },
    },
    shipToCell: {
        typographyProps: {
            ellipsis: true,
            css: css`
                display: block;
                max-width: 400px;
            `,
        },
    },
};

const styles = rfqJobQuotesTableStyles;

const RfqJobQuotesTable = ({ jobQuotesDataView, rfqJobQuoteDetailsPageUrl, language }: Props) => {
    if (jobQuotesDataView.isLoading) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner {...styles.spinner}></LoadingSpinner>
            </StyledWrapper>
        );
    }

    const jobQuotes = jobQuotesDataView.value;
    if (!jobQuotes || jobQuotes.length === 0) {
        return (
            <StyledWrapper {...styles.noResultsContainer}>
                <Typography {...styles.noResultsText}>{translate("No job quotes found")}</Typography>
            </StyledWrapper>
        );
    }

    const rows = jobQuotes.map(jobQuote => ({
        id: jobQuote.id,
        jobQuoteNumber: jobQuote.orderNumber,
        jobName: jobQuote.jobName,
        expirationDate: jobQuote.expirationDate
            ? getLocalizedDateTime({ dateTime: jobQuote.expirationDate, language })
            : "",
        customer: jobQuote.customerName,
        shipTo: jobQuote.shipToFullAddress,
    }));

    return (
        <StyledWrapper {...styles.wrapper}>
            <Typography {...styles.countText} as="p" data-test-selector="rfqJobQuotes_count">
                {jobQuotes.length === 1 && translate("{0} Job Quote", jobQuotes.length.toString())}
                {jobQuotes.length > 1 && translate("{0} Job Quotes", jobQuotes.length.toString())}
            </Typography>
            <DataTable {...styles.dataTable}>
                <DataTableHead {...styles.dataTableHead}>
                    <DataTableHeader tight {...styles.jobQuoteNumberHeader} title={translate("Job Quote Number")}>
                        {translate("Job Quote #")}
                    </DataTableHeader>
                    <DataTableHeader tight {...styles.jobNameHeader}>
                        {translate("Job Name")}
                    </DataTableHeader>
                    <DataTableHeader tight {...styles.expirationDateHeader}>
                        {translate("Expires")}
                    </DataTableHeader>
                    <DataTableHeader tight {...styles.customerHeader}>
                        {translate("Customer")}
                    </DataTableHeader>
                    <DataTableHeader {...styles.shipToHeader} title={translate("Fulfillment")}>
                        {translate("Ship To/Pick Up")}
                    </DataTableHeader>
                </DataTableHead>
                <DataTableBody {...styles.dataTableBody}>
                    {rows.map(({ id, jobQuoteNumber, jobName, expirationDate, customer, shipTo }) => (
                        <DataTableRow
                            key={id}
                            {...styles.dataTableRow}
                            data-test-selector={`rfqJobQuotes_jobQuoteLine_${id}`}
                        >
                            <DataTableCell {...styles.jobQuoteNumberCell}>
                                <Link
                                    {...styles.jobQuoteLink}
                                    href={`${rfqJobQuoteDetailsPageUrl}?jobQuoteId=${id}`}
                                    data-test-selector="link"
                                >
                                    {jobQuoteNumber}
                                </Link>
                            </DataTableCell>
                            <DataTableCell {...styles.jobNameCell}>{jobName}</DataTableCell>
                            <DataTableCell {...styles.expirationDateCell}>{expirationDate}</DataTableCell>
                            <DataTableCell {...styles.customerCell}>{customer}</DataTableCell>
                            <DataTableCell {...styles.shipToCell}>{shipTo}</DataTableCell>
                        </DataTableRow>
                    ))}
                </DataTableBody>
            </DataTable>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(RfqJobQuotesTable),
    definition: {
        group: "RFQ My Quotes",
        displayName: "Search Results Table",
        allowedContexts: [RfqJobQuotesPageContext],
    },
};

export default widgetModule;
