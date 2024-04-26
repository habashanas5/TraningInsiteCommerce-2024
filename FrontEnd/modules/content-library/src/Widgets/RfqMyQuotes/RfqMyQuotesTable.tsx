import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getQuotesDataView } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RfqMyQuotesPageContext } from "@insite/content-library/Pages/RfqMyQuotesPage";
import DataTable, { DataTableProps } from "@insite/mobius/DataTable";
import DataTableBody, { DataTableBodyProps } from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell, { DataTableCellProps } from "@insite/mobius/DataTable/DataTableCell";
import DataTableHead, { DataTableHeadProps } from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow, { DataTableRowProps } from "@insite/mobius/DataTable/DataTableRow";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    session: state.context.session,
    quotesDataView: getQuotesDataView(state, state.pages.rfqMyQuotes.getQuotesParameter),
    rfqQuoteDetailsPageUrl: getPageLinkByPageType(state, "RfqQuoteDetailsPage")?.url,
    language: state.context.session.language,
});

type Props = WidgetProps & ReturnType<typeof mapStateToProps>;

export interface RfqMyQuotesTableStyles {
    wrapper?: InjectableCss;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    noResultsContainer?: InjectableCss;
    noResultsText?: TypographyProps;
    dataTable?: DataTableProps;
    dataTableHead?: DataTableHeadProps;
    dataTableHeaders?: DataTableHeaderProps;
    dataTableBody?: DataTableBodyProps;
    dataTableRow?: DataTableRowProps;
    quoteNumberHeader?: DataTableHeaderProps;
    typeHeader?: DataTableHeaderProps;
    statusHeader?: DataTableHeaderProps;
    orderDateHeader?: DataTableHeaderProps;
    expirationDateHeader?: DataTableHeaderProps;
    salesRepHeader?: DataTableHeaderProps;
    userHeader?: DataTableHeaderProps;
    customerHeader?: DataTableHeaderProps;
    shipToHeader?: DataTableHeaderProps;
    quoteNumberCell?: DataTableCellProps;
    quoteLink?: LinkPresentationProps;
    typeCell?: DataTableCellProps;
    statusCell?: DataTableCellProps;
    orderDateCell?: DataTableCellProps;
    expirationDateCell?: DataTableCellProps;
    salesRepCell?: DataTableCellProps;
    userCell?: DataTableCellProps;
    customerCell?: DataTableCellProps;
    shipToCell?: DataTableCellProps;
}

export const rfqMyQuotesTableStyles: RfqMyQuotesTableStyles = {
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
    customerCell: {
        typographyProps: {
            ellipsis: true,
            css: css`
                display: block;
                max-width: 200px;
            `,
        },
    },
    shipToCell: {
        typographyProps: {
            ellipsis: true,
            css: css`
                display: block;
                max-width: 200px;
            `,
        },
    },
};

const styles = rfqMyQuotesTableStyles;

const RfqMyQuotesTable = ({ session, quotesDataView, rfqQuoteDetailsPageUrl, language }: Props) => {
    const quotes = quotesDataView.value;
    if (!quotes) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner {...styles.spinner}></LoadingSpinner>
            </StyledWrapper>
        );
    }

    if (quotes.length === 0) {
        return (
            <StyledWrapper {...styles.noResultsContainer}>
                <Typography {...styles.noResultsText}>{translate("No quotes found")}</Typography>
            </StyledWrapper>
        );
    }

    const rows = quotes.map(quote => ({
        id: quote.id,
        quoteNumber: quote.quoteNumber,
        type: quote.typeDisplay,
        status: quote.statusDisplay,
        orderDate: quote.orderDate ? getLocalizedDateTime({ dateTime: new Date(quote.orderDate), language }) : "",
        expirationDate: quote.expirationDate
            ? getLocalizedDateTime({ dateTime: new Date(quote.expirationDate), language })
            : "",
        salesRep: quote.salespersonName,
        user: quote.userName,
        customer: quote.customerName,
        shipTo: quote.shipToFullAddress,
    }));

    return (
        <StyledWrapper {...styles.wrapper}>
            <DataTable {...styles.dataTable}>
                <DataTableHead {...styles.dataTableHead}>
                    <DataTableHeader {...styles.quoteNumberHeader} title={translate("Quote Number")}>
                        {translate("Quote #")}
                    </DataTableHeader>
                    <DataTableHeader tight {...styles.typeHeader}>
                        {translate("Type")}
                    </DataTableHeader>
                    <DataTableHeader tight {...styles.statusHeader}>
                        {translate("Status")}
                    </DataTableHeader>
                    <DataTableHeader tight {...styles.orderDateHeader}>
                        {translate("Requested")}
                    </DataTableHeader>
                    <DataTableHeader tight {...styles.expirationDateHeader}>
                        {translate("Expires")}
                    </DataTableHeader>
                    {session.isSalesPerson && (
                        <>
                            <DataTableHeader tight {...styles.salesRepHeader}>
                                {translate("Sales Rep")}
                            </DataTableHeader>
                            <DataTableHeader tight {...styles.userHeader}>
                                {translate("User")}
                            </DataTableHeader>
                        </>
                    )}
                    <DataTableHeader tight {...styles.customerHeader}>
                        {translate("Customer")}
                    </DataTableHeader>
                    {!session.isSalesPerson && (
                        <DataTableHeader tight {...styles.shipToHeader} title={translate("Fulfillment")}>
                            {translate("Ship To/Pick Up")}
                        </DataTableHeader>
                    )}
                </DataTableHead>
                <DataTableBody {...styles.dataTableBody}>
                    {rows.map(
                        ({
                            id,
                            quoteNumber,
                            type,
                            status,
                            orderDate,
                            expirationDate,
                            salesRep,
                            user,
                            customer,
                            shipTo,
                        }) => (
                            <DataTableRow
                                key={id}
                                {...styles.dataTableRow}
                                data-test-selector={`rfqMyQuotes_quoteLine_${id}`}
                            >
                                <DataTableCell {...styles.quoteNumberCell}>
                                    <Link
                                        {...styles.quoteLink}
                                        href={`${rfqQuoteDetailsPageUrl}?quoteId=${id}`}
                                        data-test-selector="link"
                                    >
                                        {quoteNumber}
                                    </Link>
                                </DataTableCell>
                                <DataTableCell {...styles.typeCell}>{type}</DataTableCell>
                                <DataTableCell {...styles.statusCell}>{status}</DataTableCell>
                                <DataTableCell {...styles.orderDateCell}>{orderDate}</DataTableCell>
                                <DataTableCell {...styles.expirationDateCell}>{expirationDate}</DataTableCell>
                                {session.isSalesPerson && (
                                    <>
                                        <DataTableCell {...styles.salesRepCell}>{salesRep}</DataTableCell>
                                        <DataTableCell {...styles.userCell} data-test-selector="user">
                                            {user}
                                        </DataTableCell>
                                    </>
                                )}
                                <DataTableCell {...styles.customerCell}>{customer}</DataTableCell>
                                {!session.isSalesPerson && (
                                    <DataTableCell {...styles.shipToCell}>{shipTo}</DataTableCell>
                                )}
                            </DataTableRow>
                        ),
                    )}
                </DataTableBody>
            </DataTable>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps)(RfqMyQuotesTable),
    definition: {
        group: "RFQ My Quotes",
        displayName: "Search Results Table",
        allowedContexts: [RfqMyQuotesPageContext],
    },
};

export default widgetModule;
