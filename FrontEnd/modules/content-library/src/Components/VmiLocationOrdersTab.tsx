import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import getLocalizedDateTime from "@insite/client-framework/Common/Utilities/getLocalizedDateTime";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSession, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getCartsDataView } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { isVmiAdmin } from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsSelectors";
import exportVmiOrders from "@insite/client-framework/Store/Pages/VmiLocationDetails/Handlers/ExportVmiOrders";
import selectVmiItems from "@insite/client-framework/Store/Pages/VmiLocationDetails/Handlers/SelectVmiItems";
import updateOrderSearchFields from "@insite/client-framework/Store/Pages/VmiLocationDetails/Handlers/UpdateOrderSearchFields";
import { TableTabKeys } from "@insite/client-framework/Store/Pages/VmiLocationDetails/VmiLocationDetailsReducer";
import translate from "@insite/client-framework/Translate";
import Checkbox, { CheckboxPresentationProps } from "@insite/mobius/Checkbox";
import DataTable, { DataTableProps, SortOrderOptions } from "@insite/mobius/DataTable";
import DataTableBody from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell, { DataTableCellProps } from "@insite/mobius/DataTable/DataTableCell";
import DataTableHead from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow from "@insite/mobius/DataTable/DataTableRow";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Search from "@insite/mobius/Icons/Search";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import TextField, { TextFieldProps } from "@insite/mobius/TextField";
import Typography, { TypographyPresentationProps, TypographyProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => {
    const session = getSession(state);
    const settings = getSettingsCollection(state);
    return {
        selectedOrderIds: state.pages.vmiLocationDetails.selectedVmiItems[TableTabKeys.Orders] || {},
        isVmiAdmin: isVmiAdmin(settings.orderSettings, session),
        language: session.language,
        getVmiOrdersParameter: state.pages.vmiLocationDetails.getVmiOrdersParameter,
        vmiOrdersDataView: getCartsDataView(state, state.pages.vmiLocationDetails.getVmiOrdersParameter),
        orderNumber: state.pages.vmiLocationDetails.getVmiOrdersParameter.orderNumber,
    };
};

const mapDispatchToProps = {
    updateOrderSearchFields,
    exportVmiOrders,
    selectVmiItems,
};

type Props = ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface VmiLocationOrdersTabStyles {
    container?: InjectableCss;
    searchContainer?: GridContainerProps;
    searchGridItem?: GridItemProps;
    searchText?: TextFieldProps;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    headerContainer?: GridContainerProps;
    gridItem?: GridItemProps;
    exportLink?: LinkPresentationProps;
    capitalizeText?: TypographyProps;
    noResultsContainer?: InjectableCss;
    noResultsText?: TypographyProps;
    itemsCountText?: TypographyPresentationProps;
    dataTable?: DataTableProps;
    rowCheckbox?: CheckboxPresentationProps;
    pagination?: PaginationPresentationProps;
    nameHeader?: DataTableHeaderProps;
    orderDateHeader?: DataTableHeaderProps;
    orderTotalHeader?: DataTableHeaderProps;
    orderStatusHeader?: DataTableHeaderProps;
    nameCells?: DataTableCellProps;
    orderDateCells?: DataTableCellProps;
    orderTotalCells?: DataTableCellProps;
    orderStatusCells?: DataTableCellProps;
    checkboxHeader?: DataTableHeaderProps;
    checkboxCells?: DataTableCellProps;
    tableWrapper?: InjectableCss;
}

export const vmiLocationOrdersTabStyles: VmiLocationOrdersTabStyles = {
    searchGridItem: { width: [12, 12, 12, 6, 4] },
    searchText: { iconProps: { src: Search } },
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
    headerContainer: {
        gap: 8,
        css: css`
            padding: 20px 0;
        `,
    },
    gridItem: {
        width: 12,
        css: css`
            > * {
                padding-right: 10px;
            }
        `,
    },
    exportLink: {
        css: css`
            margin-left: 10px;
        `,
    },
    capitalizeText: {
        css: css`
            text-transform: capitalize;
        `,
    },
    noResultsContainer: {
        css: css`
            text-align: center;
            padding: 20px;
        `,
    },
    noResultsText: {
        variant: "h4",
    },
    checkboxHeader: {
        tight: true,
    },
    tableWrapper: {
        css: css`
            overflow: auto;
        `,
    },
};

const styles = vmiLocationOrdersTabStyles;

const VmiLocationOrdersTab = ({
    selectedOrderIds,
    isVmiAdmin,
    language,
    getVmiOrdersParameter,
    vmiOrdersDataView,
    updateOrderSearchFields,
    exportVmiOrders,
    selectVmiItems,
    orderNumber,
}: Props) => {
    const [orderNumberText, setOrderNumberText] = useState(orderNumber);

    let searchTimeoutId: number | undefined;
    const searchMinimumCharacterLength = 3;
    const searchTextChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (typeof searchTimeoutId === "number") {
            clearTimeout(searchTimeoutId);
        }
        const searchText = event.currentTarget.value;
        setOrderNumberText(searchText);
        if (searchText.length > 0 && searchText.length < searchMinimumCharacterLength) {
            return;
        }
        searchTimeoutId = setTimeout(() => {
            updateOrderSearchFields({
                orderNumber: searchText,
                page: 1,
            });
        }, 250);
    };

    const headerClick = (sortField: string) => {
        const sort = getVmiOrdersParameter.sort === sortField ? `${sortField} DESC` : sortField;
        updateOrderSearchFields({ sort, page: 1 });
    };

    const sorted = (sortField: string) => {
        let sorted: boolean | string = false;
        if (getVmiOrdersParameter.sort === sortField) {
            sorted = "ascending";
        } else if (getVmiOrdersParameter.sort === `${sortField} DESC`) {
            sorted = "descending";
        }
        return sorted as SortOrderOptions;
    };

    const checkboxChangeHandler = (value: boolean, tabKey: TableTabKeys, id?: string) => {
        if (id) {
            selectVmiItems({ ids: [id], tabKey });
        } else {
            let ids: string[] = [];
            if (value) {
                for (const row of vmiOrdersDataView.value!) {
                    if (!selectedOrderIds[row.id]) {
                        ids.push(row.id);
                    }
                }
            } else {
                ids = Object.keys(selectedOrderIds);
            }

            selectVmiItems({ ids, tabKey });
        }
    };

    const changePage = (newPageIndex: number) => {
        updateOrderSearchFields({
            page: newPageIndex,
        });
    };

    const changeResultsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(event.currentTarget.value, 10);

        updateOrderSearchFields({
            page: 1,
            pageSize: newPageSize,
        });
    };

    const handleExportButtonClick = (selectedOnly = false) => {
        exportVmiOrders({ ids: selectedOnly ? selectedOrderIds : {} });
    };

    const vmiOrdersPagination = vmiOrdersDataView.value ? vmiOrdersDataView.pagination : null;

    return (
        <StyledWrapper {...styles.container}>
            <GridContainer {...styles.searchContainer}>
                <GridItem {...styles.searchGridItem}>
                    <TextField
                        placeholder={translate("Search Orders")}
                        {...styles.searchText}
                        value={orderNumberText}
                        onChange={searchTextChangeHandler}
                    />
                </GridItem>
            </GridContainer>
            {vmiOrdersDataView.isLoading && (
                <StyledWrapper {...styles.centeringWrapper}>
                    <LoadingSpinner {...styles.spinner} />
                </StyledWrapper>
            )}
            {vmiOrdersDataView.value && vmiOrdersDataView.value.length > 0 && (
                <GridContainer {...styles.headerContainer}>
                    <GridItem {...styles.gridItem}>
                        <Typography {...styles.itemsCountText}>
                            {vmiOrdersPagination?.totalItemCount}{" "}
                            <Typography {...styles.capitalizeText}>{translate("orders")}</Typography>
                        </Typography>
                        {isVmiAdmin && (
                            <>
                                <Link
                                    {...styles.exportLink}
                                    disabled={Object.keys(selectedOrderIds).length === 0}
                                    onClick={() => handleExportButtonClick(true)}
                                >
                                    {translate("Export Selected")}
                                </Link>
                                <Link {...styles.exportLink} onClick={() => handleExportButtonClick()}>
                                    {translate("Export All")}
                                </Link>
                            </>
                        )}
                    </GridItem>
                </GridContainer>
            )}
            {vmiOrdersDataView.value && vmiOrdersDataView.value.length === 0 && (
                <StyledWrapper {...styles.noResultsContainer}>
                    <Typography as="p" {...styles.noResultsText}>
                        {translate("No orders found")}
                    </Typography>
                </StyledWrapper>
            )}
            {vmiOrdersDataView.value && vmiOrdersDataView.value.length > 0 && (
                <>
                    <StyledWrapper {...styles.tableWrapper}>
                        <DataTable {...styles.dataTable}>
                            <DataTableHead>
                                {isVmiAdmin && (
                                    <DataTableHeader {...styles.checkboxHeader}>
                                        <Checkbox
                                            {...styles.rowCheckbox}
                                            checked={
                                                Object.keys(selectedOrderIds).length === vmiOrdersDataView.value.length
                                            }
                                            onChange={(e, value) => checkboxChangeHandler(value, TableTabKeys.Orders)}
                                        />
                                    </DataTableHeader>
                                )}
                                <DataTableHeader
                                    {...styles.nameHeader}
                                    title={translate("Order #")}
                                    sorted={sorted("orderNumber")}
                                    onSortClick={() => headerClick("orderNumber")}
                                >
                                    {translate("Order #")}
                                </DataTableHeader>
                                <DataTableHeader
                                    {...styles.orderDateHeader}
                                    sorted={sorted("orderDate")}
                                    onSortClick={() => headerClick("orderDate")}
                                >
                                    {translate("Order Date")}
                                </DataTableHeader>
                                <DataTableHeader
                                    {...styles.orderTotalHeader}
                                    sorted={sorted("orderGrandTotalDisplay")}
                                    onSortClick={() => headerClick("orderGrandTotalDisplay")}
                                >
                                    {translate("Total")}
                                </DataTableHeader>
                                <DataTableHeader
                                    {...styles.orderStatusHeader}
                                    sorted={sorted("status")}
                                    onSortClick={() => headerClick("status")}
                                >
                                    {translate("Status")}
                                </DataTableHeader>
                            </DataTableHead>
                            <DataTableBody>
                                {vmiOrdersDataView.value.map(
                                    ({ id, orderNumber, orderDate, orderGrandTotalDisplay, status }) => (
                                        <DataTableRow key={id}>
                                            {isVmiAdmin && (
                                                <DataTableCell {...styles.checkboxCells}>
                                                    <Checkbox
                                                        {...styles.rowCheckbox}
                                                        checked={selectedOrderIds[id]}
                                                        onChange={(e, value) =>
                                                            checkboxChangeHandler(value, TableTabKeys.Orders, id)
                                                        }
                                                    />
                                                </DataTableCell>
                                            )}
                                            <DataTableCell {...styles.nameCells}>
                                                <Link>{orderNumber}</Link>
                                            </DataTableCell>
                                            <DataTableCell {...styles.orderDateCells}>
                                                {orderDate &&
                                                    getLocalizedDateTime({
                                                        dateTime: new Date(orderDate),
                                                        language,
                                                    })}
                                            </DataTableCell>
                                            <DataTableCell {...styles.orderTotalCells}>
                                                {orderGrandTotalDisplay}
                                            </DataTableCell>
                                            <DataTableCell {...styles.orderStatusCells}>{status}</DataTableCell>
                                        </DataTableRow>
                                    ),
                                )}
                            </DataTableBody>
                        </DataTable>
                    </StyledWrapper>
                    {vmiOrdersPagination && (
                        <Pagination
                            {...styles.pagination}
                            resultsCount={vmiOrdersPagination.totalItemCount}
                            currentPage={vmiOrdersPagination.page}
                            resultsPerPage={vmiOrdersPagination.pageSize}
                            resultsPerPageOptions={vmiOrdersPagination.pageSizeOptions}
                            onChangePage={changePage}
                            onChangeResultsPerPage={changeResultsPerPage}
                            pageSizeCookie="VmiOrders-PageSize"
                        />
                    )}
                </>
            )}
        </StyledWrapper>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(VmiLocationOrdersTab);
