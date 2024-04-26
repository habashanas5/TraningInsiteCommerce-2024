import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getSession, getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import removeVmiBins from "@insite/client-framework/Store/Data/VmiBins/Handlers/RemoveVmiBins";
import { getVmiBinsDataView } from "@insite/client-framework/Store/Data/VmiBins/VmiBinsSelectors";
import { isVmiAdmin } from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsSelectors";
import exportVmiProducts from "@insite/client-framework/Store/Pages/VmiLocationDetails/Handlers/ExportVmiProducts";
import selectVmiItems from "@insite/client-framework/Store/Pages/VmiLocationDetails/Handlers/SelectVmiItems";
import updateProductSearchFields from "@insite/client-framework/Store/Pages/VmiLocationDetails/Handlers/UpdateProductSearchFields";
import { TableTabKeys } from "@insite/client-framework/Store/Pages/VmiLocationDetails/VmiLocationDetailsReducer";
import translate from "@insite/client-framework/Translate";
import TwoButtonModal, { TwoButtonModalStyles } from "@insite/content-library/Components/TwoButtonModal";
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
        selectedProductIds: state.pages.vmiLocationDetails.selectedVmiItems[TableTabKeys.Products] || {},
        isRemoving: state.data.vmiLocations.isRemoving,
        isVmiAdmin: isVmiAdmin(settings.orderSettings, session),
        getVmiBinsParameter: state.pages.vmiLocationDetails.getVmiBinsParameter,
        vmiBinsDataView: getVmiBinsDataView(state, state.pages.vmiLocationDetails.getVmiBinsParameter),
        filter: state.pages.vmiLocationDetails.getVmiBinsParameter.filter,
    };
};

const mapDispatchToProps = {
    updateProductSearchFields,
    removeVmiBins,
    exportVmiProducts,
    selectVmiItems,
};

interface OwnProps {
    vmiLocationId: string;
}

type Props = ReturnType<typeof mapStateToProps> & OwnProps & ResolveThunks<typeof mapDispatchToProps>;

export interface VmiLocationProductsTabStyles {
    container?: InjectableCss;
    searchContainer?: GridContainerProps;
    searchGridItem?: GridItemProps;
    searchText?: TextFieldProps;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    headerContainer?: GridContainerProps;
    gridItem?: GridItemProps;
    removeLink?: LinkPresentationProps;
    exportLink?: LinkPresentationProps;
    noResultsContainer?: InjectableCss;
    noResultsText?: TypographyProps;
    itemsCountText?: TypographyPresentationProps;
    dataTable?: DataTableProps;
    rowCheckbox?: CheckboxPresentationProps;
    pagination?: PaginationPresentationProps;
    nameHeader?: DataTableHeaderProps;
    productNumberHeader?: DataTableHeaderProps;
    binNumberHeader?: DataTableHeaderProps;
    minQtyHeader?: DataTableHeaderProps;
    maxQtyHeader?: DataTableHeaderProps;
    nameCells?: DataTableCellProps;
    productNumberCells?: DataTableCellProps;
    binNumberCells?: DataTableCellProps;
    minQtyCells?: DataTableCellProps;
    maxQtyCells?: DataTableCellProps;
    twoButtonModalStyles?: TwoButtonModalStyles;
    checkboxHeader?: DataTableHeaderProps;
    checkboxCells?: DataTableCellProps;
    tableWrapper?: InjectableCss;
}

export const vmiLocationProductsTabStyles: VmiLocationProductsTabStyles = {
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
    noResultsContainer: {
        css: css`
            text-align: center;
            padding: 20px;
        `,
    },
    noResultsText: {
        variant: "h4",
    },
    productNumberHeader: {
        tight: true,
    },
    productNumberCells: {
        typographyProps: {
            ellipsis: true,
            css: css`
                display: block;
                max-width: 300px;
            `,
        },
    },
    twoButtonModalStyles: {
        submitButton: {
            color: "primary",
        },
    },
    checkboxHeader: {
        tight: true,
    },
    tableWrapper: {
        css: css`
            overflow: auto;
        `,
    },
    nameCells: {
        css: css`
            span {
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 300px;
            }
        `,
    },
};

const styles = vmiLocationProductsTabStyles;

const VmiLocationProductsTab = ({
    vmiLocationId,
    selectedProductIds,
    isRemoving,
    isVmiAdmin,
    getVmiBinsParameter,
    vmiBinsDataView,
    updateProductSearchFields,
    removeVmiBins,
    exportVmiProducts,
    selectVmiItems,
    filter,
}: Props) => {
    const [removeModalIsOpen, setRemoveModalIsOpen] = useState(false);
    const [filterText, setFilterText] = useState(filter);

    let searchTimeoutId: number | undefined;
    const searchMinimumCharacterLength = 3;
    const searchTextChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (typeof searchTimeoutId === "number") {
            clearTimeout(searchTimeoutId);
        }
        const searchText = event.currentTarget.value;
        setFilterText(searchText);
        if (searchText.length > 0 && searchText.length < searchMinimumCharacterLength) {
            return;
        }
        searchTimeoutId = setTimeout(() => {
            updateProductSearchFields({
                filter: searchText,
                page: 1,
            });
        }, 250);
    };

    const headerClick = (sortField: string) => {
        const sort = getVmiBinsParameter.sort === sortField ? `${sortField} DESC` : sortField;
        updateProductSearchFields({ sort, page: 1 });
    };

    const sorted = (sortField: string) => {
        let sorted: boolean | string = false;
        if (getVmiBinsParameter.sort === sortField) {
            sorted = "ascending";
        } else if (getVmiBinsParameter.sort === `${sortField} DESC`) {
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
                for (const row of vmiBinsDataView.value!) {
                    if (!selectedProductIds[row.id]) {
                        ids.push(row.id);
                    }
                }
            } else {
                ids = Object.keys(selectedProductIds);
            }

            selectVmiItems({ ids, tabKey });
        }
    };

    if (vmiBinsDataView.value?.length === 0) {
        if (getVmiBinsParameter.page && getVmiBinsParameter.page > 1) {
            updateProductSearchFields({ page: getVmiBinsParameter.page - 1 });
        }
    }

    const handleRemoveButtonClick = () => {
        setRemoveModalIsOpen(true);
    };

    const handleCancelModalButtonClick = () => {
        setRemoveModalIsOpen(false);
    };

    const handleDeleteModalButtonClick = () => {
        setRemoveModalIsOpen(false);
        removeVmiBins({
            vmiLocationId,
            ids: Object.keys(selectedProductIds),
        });
    };

    const changePage = (newPageIndex: number) => {
        updateProductSearchFields({
            page: newPageIndex,
        });
    };

    const changeResultsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(event.currentTarget.value, 10);

        updateProductSearchFields({
            page: 1,
            pageSize: newPageSize,
        });
    };

    const handleExportButtonClick = (selectedOnly = false) => {
        exportVmiProducts({ ids: selectedOnly ? selectedProductIds : {} });
    };

    const vmiBinsPagination = vmiBinsDataView.value ? vmiBinsDataView.pagination : null;

    return (
        <StyledWrapper {...styles.container}>
            <GridContainer {...styles.searchContainer}>
                <GridItem {...styles.searchGridItem}>
                    <TextField
                        placeholder={translate("Search Products")}
                        {...styles.searchText}
                        value={filterText}
                        onChange={searchTextChangeHandler}
                    />
                </GridItem>
            </GridContainer>
            {(vmiBinsDataView.isLoading || isRemoving) && (
                <StyledWrapper {...styles.centeringWrapper}>
                    <LoadingSpinner {...styles.spinner} />
                </StyledWrapper>
            )}
            {vmiBinsDataView.value && vmiBinsDataView.value.length > 0 && (
                <GridContainer {...styles.headerContainer}>
                    <GridItem {...styles.gridItem}>
                        <Typography {...styles.itemsCountText}>
                            {vmiBinsPagination?.totalItemCount} {translate("Products")}
                        </Typography>
                        {isVmiAdmin && (
                            <>
                                <Link
                                    {...styles.removeLink}
                                    disabled={isRemoving || Object.keys(selectedProductIds).length === 0}
                                    onClick={handleRemoveButtonClick}
                                >
                                    {translate("Remove")}
                                </Link>
                                <Link
                                    {...styles.exportLink}
                                    disabled={Object.keys(selectedProductIds).length === 0}
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
            <TwoButtonModal
                modalIsOpen={removeModalIsOpen}
                headlineText={translate("Delete bin")}
                messageText={translate("This will delete all information assigned to this bin")}
                cancelButtonText={translate("Cancel")}
                submitButtonText={translate("Delete")}
                extendedStyles={styles.twoButtonModalStyles}
                onCancel={handleCancelModalButtonClick}
                onSubmit={handleDeleteModalButtonClick}
            ></TwoButtonModal>
            {vmiBinsDataView.value && vmiBinsDataView.value.length === 0 && (
                <StyledWrapper {...styles.noResultsContainer}>
                    <Typography as="p" {...styles.noResultsText}>
                        {translate("No products found")}
                    </Typography>
                </StyledWrapper>
            )}
            {vmiBinsDataView.value && vmiBinsDataView.value.length > 0 && (
                <>
                    <StyledWrapper {...styles.tableWrapper}>
                        <DataTable {...styles.dataTable}>
                            <DataTableHead>
                                {isVmiAdmin && (
                                    <DataTableHeader {...styles.checkboxHeader}>
                                        <Checkbox
                                            {...styles.rowCheckbox}
                                            checked={
                                                Object.keys(selectedProductIds).length === vmiBinsDataView.value.length
                                            }
                                            onChange={(e, value) => checkboxChangeHandler(value, TableTabKeys.Products)}
                                        />
                                    </DataTableHeader>
                                )}
                                <DataTableHeader
                                    {...styles.nameHeader}
                                    title={translate("Product Name")}
                                    sorted={sorted("product.shortDescription")}
                                    onSortClick={() => headerClick("product.shortDescription")}
                                >
                                    {translate("Product Name")}
                                </DataTableHeader>
                                <DataTableHeader
                                    {...styles.productNumberHeader}
                                    sorted={sorted("product.erpNumber")}
                                    onSortClick={() => headerClick("product.erpNumber")}
                                >
                                    {translate("Part #")}
                                </DataTableHeader>
                                <DataTableHeader
                                    {...styles.binNumberHeader}
                                    sorted={sorted("binNumber")}
                                    onSortClick={() => headerClick("binNumber")}
                                >
                                    {translate("Bin #")}
                                </DataTableHeader>
                                <DataTableHeader
                                    {...styles.minQtyHeader}
                                    sorted={sorted("minimumQty")}
                                    onSortClick={() => headerClick("minimumQty")}
                                >
                                    {translate("Min")}
                                </DataTableHeader>
                                <DataTableHeader
                                    {...styles.maxQtyHeader}
                                    sorted={sorted("maximumQty")}
                                    onSortClick={() => headerClick("maximumQty")}
                                >
                                    {translate("Max")}
                                </DataTableHeader>
                            </DataTableHead>
                            <DataTableBody>
                                {vmiBinsDataView.value.map(({ id, binNumber, minimumQty, maximumQty, product }) => (
                                    <DataTableRow key={id}>
                                        {isVmiAdmin && (
                                            <DataTableCell {...styles.checkboxCells}>
                                                <Checkbox
                                                    {...styles.rowCheckbox}
                                                    checked={selectedProductIds[id]}
                                                    onChange={(e, value) =>
                                                        checkboxChangeHandler(value, TableTabKeys.Products, id)
                                                    }
                                                />
                                            </DataTableCell>
                                        )}
                                        <DataTableCell {...styles.nameCells}>
                                            <Link title={product.shortDescription} href={product.productDetailUrl}>
                                                {product.shortDescription}
                                            </Link>
                                        </DataTableCell>
                                        <DataTableCell {...styles.productNumberCells}>
                                            {product.erpNumber}
                                        </DataTableCell>
                                        <DataTableCell {...styles.binNumberCells}>{binNumber}</DataTableCell>
                                        <DataTableCell {...styles.minQtyCells}>{minimumQty}</DataTableCell>
                                        <DataTableCell {...styles.maxQtyCells}>{maximumQty}</DataTableCell>
                                    </DataTableRow>
                                ))}
                            </DataTableBody>
                        </DataTable>
                    </StyledWrapper>
                    {vmiBinsPagination && (
                        <Pagination
                            {...styles.pagination}
                            resultsCount={vmiBinsPagination.totalItemCount}
                            currentPage={vmiBinsPagination.page}
                            resultsPerPage={vmiBinsPagination.pageSize}
                            resultsPerPageOptions={vmiBinsPagination.pageSizeOptions}
                            onChangePage={changePage}
                            onChangeResultsPerPage={changeResultsPerPage}
                            pageSizeCookie="VmiBins-PageSize"
                        />
                    )}
                </>
            )}
        </StyledWrapper>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(VmiLocationProductsTab);
