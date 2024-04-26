import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { OrderApprovalsDataViewContext } from "@insite/client-framework/Store/Data/OrderApprovals/OrderApprovalsSelectors";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import updateSearchFields from "@insite/client-framework/Store/Pages/OrderApprovalList/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { OrderApprovalListPageContext } from "@insite/content-library/Pages/OrderApprovalListPage";
import DataTable, { DataTableProps, SortOrderOptions } from "@insite/mobius/DataTable";
import DataTableBody, { DataTableBodyProps } from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell from "@insite/mobius/DataTable/DataTableCell";
import { DataTableCellBaseProps } from "@insite/mobius/DataTable/DataTableCellBase";
import DataTableHead, { DataTableHeadProps } from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow, { DataTableRowProps } from "@insite/mobius/DataTable/DataTableRow";
import Link from "@insite/mobius/Link";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { useContext } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    getOrderApprovalsParameter: state.pages.orderApprovalList.getOrderApprovalsParameter,
    language: state.context.session.language,
    orderApprovalDetailsLink: getPageLinkByPageType(state, "OrderApprovalDetailsPage"),
});

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface OrderApprovalListTableStyles {
    container?: InjectableCss;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    noResultsContainer?: InjectableCss;
    noResultsText?: TypographyPresentationProps;
    dataTable?: DataTableProps;
    dataTableHead?: DataTableHeadProps;
    dataTableBody?: DataTableBodyProps;
    dataTableRow?: DataTableRowProps;
    orderNumberHeader?: DataTableHeaderProps;
    orderDateHeader?: DataTableHeaderProps;
    shipToLabelHeader?: DataTableHeaderProps;
    approverReasonHeader?: DataTableHeaderProps;
    totalHeader?: DataTableHeaderProps;
    orderNumberCell?: DataTableCellBaseProps;
    orderDateCell?: DataTableCellBaseProps;
    shipToLabelCell?: DataTableCellBaseProps;
    approverReasonCell?: DataTableCellBaseProps;
    totalCell?: DataTableCellBaseProps;
}

export const tableStyles: OrderApprovalListTableStyles = {
    container: {
        css: css`
            overflow: auto;
            margin-top: 5px;
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
    totalHeader: {
        alignX: "right",
    },
    totalCell: {
        alignX: "right",
    },
};

const styles = tableStyles;

const OrderApprovalListTable = (props: Props) => {
    const headerClick = (sortField: string) => {
        const sort = props.getOrderApprovalsParameter.sort === sortField ? `${sortField} DESC` : sortField;
        props.updateSearchFields({ sort });
    };

    const orderApprovalsDataView = useContext(OrderApprovalsDataViewContext);
    if (!orderApprovalsDataView.value) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner {...styles.spinner}></LoadingSpinner>
            </StyledWrapper>
        );
    }

    if (orderApprovalsDataView.value.length === 0) {
        return (
            <StyledWrapper {...styles.noResultsContainer}>
                <Typography {...styles.noResultsText}>{translate("No order approvals found.")}</Typography>
            </StyledWrapper>
        );
    }

    const sorted = (sortField: string) => {
        let sorted: boolean | string = false;
        if (props.getOrderApprovalsParameter.sort === sortField) {
            sorted = "ascending";
        } else if (props.getOrderApprovalsParameter.sort === `${sortField} DESC`) {
            sorted = "descending";
        }
        return sorted as SortOrderOptions;
    };

    const rows = orderApprovalsDataView.value.map(orderApproval => {
        return {
            id: orderApproval.id,
            orderNumber: orderApproval.orderNumber,
            date: orderApproval.orderDate
                ? getLocalizedDateTime({
                      dateTime: new Date(orderApproval.orderDate),
                      language: props.language,
                  })
                : "",
            shipToLabel: orderApproval.shipToLabel,
            approverReason: orderApproval.approverReason,
            total: orderApproval.orderGrandTotalDisplay,
        };
    });

    return (
        <StyledWrapper {...styles.container}>
            <DataTable {...styles.dataTable}>
                <DataTableHead {...styles.dataTableHead}>
                    <DataTableHeader
                        tight
                        sorted={sorted("orderNumber")}
                        onSortClick={() => headerClick("orderNumber")}
                        {...styles.orderNumberHeader}
                    >
                        {translate("Order #")}
                    </DataTableHeader>
                    <DataTableHeader
                        tight
                        sorted={sorted("orderDate")}
                        onSortClick={() => headerClick("orderDate")}
                        {...styles.orderDateHeader}
                    >
                        {translate("Order Date")}
                    </DataTableHeader>
                    <DataTableHeader
                        tight
                        sorted={sorted("customerSequence")}
                        onSortClick={() => headerClick("customerSequence")}
                        {...styles.shipToLabelHeader}
                    >
                        {translate("Ship To / Pick Up")}
                    </DataTableHeader>
                    <DataTableHeader
                        tight
                        sorted={sorted("approverMessage")}
                        onSortClick={() => headerClick("approverMessage")}
                        {...styles.approverReasonHeader}
                    >
                        {translate("Approval Reason")}
                    </DataTableHeader>
                    <DataTableHeader
                        tight
                        sorted={sorted("orderGrandTotal")}
                        onSortClick={() => headerClick("orderGrandTotal")}
                        {...styles.totalHeader}
                    >
                        {translate("Order Total")}
                    </DataTableHeader>
                </DataTableHead>
                <DataTableBody {...styles.dataTableBody}>
                    {rows.map(({ id, orderNumber, date, shipToLabel, approverReason, total }) => (
                        <DataTableRow data-test-selector="orderApproval_orderLine" key={id} {...styles.dataTableRow}>
                            <DataTableCell
                                data-test-selector="orderApproval_orderLine_number"
                                {...styles.orderNumberCell}
                            >
                                <Link href={`${props.orderApprovalDetailsLink?.url}?cartId=${id}`}>{orderNumber}</Link>
                            </DataTableCell>
                            <DataTableCell data-test-selector="orderApproval_orderLine_date" {...styles.orderDateCell}>
                                {date}
                            </DataTableCell>
                            <DataTableCell {...styles.shipToLabelCell}>{shipToLabel}</DataTableCell>
                            <DataTableCell {...styles.approverReasonCell}>{approverReason}</DataTableCell>
                            <DataTableCell {...styles.totalCell}>{total}</DataTableCell>
                        </DataTableRow>
                    ))}
                </DataTableBody>
            </DataTable>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(OrderApprovalListTable),
    definition: {
        group: "Order Approval List",
        displayName: "Search Results Table",
        allowedContexts: [OrderApprovalListPageContext],
        isSystem: true,
    },
};

export default widgetModule;
