import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { CartsDataViewContext } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { getPageLinkByPageType } from "@insite/client-framework/Store/Links/LinksSelectors";
import updateSearchFields from "@insite/client-framework/Store/Pages/SavedOrderList/Handlers/UpdateSearchFields";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { SavedOrderListPageContext } from "@insite/content-library/Pages/SavedOrderListPage";
import DataTable, { DataTableProps, SortOrderOptions } from "@insite/mobius/DataTable";
import DataTableBody, { DataTableBodyProps } from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell from "@insite/mobius/DataTable/DataTableCell";
import { DataTableCellBaseProps } from "@insite/mobius/DataTable/DataTableCellBase";
import DataTableHead, { DataTableHeadProps } from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderPresentationProps } from "@insite/mobius/DataTable/DataTableHeader";
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
    getSavedOrdersParameter: state.pages.savedOrderList.getCartsApiParameter,
    language: state.context.session.language,
    savedOrderDetailsLink: getPageLinkByPageType(state, "SavedOrderDetailsPage"),
});

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface SavedOrderListTableStyles {
    container?: InjectableCss;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    noResultsContainer?: InjectableCss;
    noResultsText?: TypographyPresentationProps;
    dataTable?: DataTableProps;
    dataTableHead?: DataTableHeadProps;
    dataTableBody?: DataTableBodyProps;
    dataTableRow?: DataTableRowProps;
    orderDateHeader?: DataTableHeaderPresentationProps;
    shipToLabelHeader?: DataTableHeaderPresentationProps;
    subtotalHeader?: DataTableHeaderPresentationProps;
    orderDateCell?: DataTableCellBaseProps;
    shipToLabelCell?: DataTableCellBaseProps;
    subtotalCell?: DataTableCellBaseProps;
}

export const savedOrderListTableStyles: SavedOrderListTableStyles = {
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
    subtotalHeader: {
        sortClickableProps: {
            css: css`
                justify-content: flex-end;
                width: 100%;
            `,
        },
    },
    subtotalCell: {
        alignX: "right",
    },
};

const styles = savedOrderListTableStyles;

const SavedOrderListTable = ({
    getSavedOrdersParameter,
    updateSearchFields,
    language,
    savedOrderDetailsLink,
}: Props) => {
    const headerClick = (sortField: string) => {
        const sort = getSavedOrdersParameter.sort === sortField ? `${sortField} DESC` : sortField;
        updateSearchFields({ sort });
    };

    const sorted = (sortField: string) => {
        let sorted: boolean | string = false;
        if (getSavedOrdersParameter.sort === sortField) {
            sorted = "ascending";
        } else if (getSavedOrdersParameter.sort === `${sortField} DESC`) {
            sorted = "descending";
        }
        return sorted as SortOrderOptions;
    };

    const savedOrderListDataView = useContext(CartsDataViewContext);
    if (!savedOrderListDataView.value) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner {...styles.spinner}></LoadingSpinner>
            </StyledWrapper>
        );
    }

    if (savedOrderListDataView.value.length === 0) {
        return (
            <StyledWrapper {...styles.noResultsContainer}>
                <Typography {...styles.noResultsText}>{translate("No saved orders found.")}</Typography>
            </StyledWrapper>
        );
    }

    const rows = savedOrderListDataView.value.map(savedOrder => {
        return {
            id: savedOrder.id,
            date: savedOrder.orderDate
                ? getLocalizedDateTime({
                      dateTime: new Date(savedOrder.orderDate),
                      language,
                  })
                : "",
            shipToLabel: savedOrder.collectionShipToLabel ?? savedOrder.shipToLabel,
            subtotal: savedOrder.orderSubTotalDisplay,
        };
    });

    return (
        <StyledWrapper {...styles.container}>
            <DataTable {...styles.dataTable}>
                <DataTableHead {...styles.dataTableHead}>
                    <DataTableHeader
                        tight
                        sorted={sorted("orderDate")}
                        onSortClick={() => headerClick("orderDate")}
                        {...styles.orderDateHeader}
                    >
                        {translate("Date")}
                    </DataTableHeader>
                    <DataTableHeader
                        tight
                        sorted={sorted("customerSequence")}
                        {...styles.shipToLabelHeader}
                        onSortClick={() => headerClick("customerSequence")}
                    >
                        {translate("Ship To / Pick Up")}
                    </DataTableHeader>
                    <DataTableHeader
                        tight
                        sorted={sorted("orderSubtotal")}
                        {...styles.subtotalHeader}
                        onSortClick={() => headerClick("orderSubtotal")}
                    >
                        {translate("Order Subtotal")}
                    </DataTableHeader>
                </DataTableHead>
                <DataTableBody {...styles.dataTableBody}>
                    {rows.map(({ id, date, shipToLabel, subtotal }) => (
                        <DataTableRow data-test-selector="savedOrderList_orderLine" key={id} {...styles.dataTableRow}>
                            <DataTableCell data-test-selector="savedOrderList_orderLine_date" {...styles.orderDateCell}>
                                <Link href={`${savedOrderDetailsLink?.url}?cartId=${id}`}>{date}</Link>
                            </DataTableCell>
                            <DataTableCell {...styles.shipToLabelCell}>{shipToLabel}</DataTableCell>
                            <DataTableCell data-test-selector="savedOrderList_orderLine_total" {...styles.subtotalCell}>
                                {subtotal}
                            </DataTableCell>
                        </DataTableRow>
                    ))}
                </DataTableBody>
            </DataTable>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(SavedOrderListTable),
    definition: {
        group: "Saved Order List",
        displayName: "Search Results Table",
        allowedContexts: [SavedOrderListPageContext],
        isSystem: true,
    },
};

export default widgetModule;
