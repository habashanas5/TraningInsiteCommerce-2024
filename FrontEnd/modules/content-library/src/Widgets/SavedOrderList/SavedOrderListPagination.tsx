import { CartsDataViewContext } from "@insite/client-framework/Store/Data/Carts/CartsSelector";
import { InvoicesDataViewContext } from "@insite/client-framework/Store/Data/Invoices/InvoicesSelectors";
import updateSearchFields from "@insite/client-framework/Store/Pages/SavedOrderList/Handlers/UpdateSearchFields";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { SavedOrderListPageContext } from "@insite/content-library/Pages/SavedOrderListPage";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import React, { FC, useContext } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = WidgetProps & ResolveThunks<typeof mapDispatchToProps>;

export interface SavedOrderListPaginationStyles {
    pagination?: PaginationPresentationProps;
}

export const savedOrderListPaginationStyles: SavedOrderListPaginationStyles = {};

const styles = savedOrderListPaginationStyles;

const SavedOrderListPagination = ({ updateSearchFields }: Props) => {
    const savedOrderListDataView = useContext(CartsDataViewContext);

    const changePage = (newPageIndex: number) => {
        updateSearchFields({
            page: newPageIndex,
        });
    };

    const changeResultsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(event.currentTarget.value, 10);
        updateSearchFields({
            page: 1,
            pageSize: newPageSize,
        });
    };

    if (!savedOrderListDataView.value) {
        return null;
    }

    const { pagination } = savedOrderListDataView;
    if (!pagination || pagination.totalItemCount === 0) {
        return null;
    }

    return (
        <Pagination
            {...styles.pagination}
            resultsCount={pagination.totalItemCount}
            currentPage={pagination.page}
            resultsPerPage={pagination.pageSize}
            resultsPerPageOptions={pagination.pageSizeOptions}
            onChangePage={changePage}
            onChangeResultsPerPage={changeResultsPerPage}
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(SavedOrderListPagination),
    definition: {
        group: "Saved Order List",
        displayName: "Pagination",
        allowedContexts: [SavedOrderListPageContext],
    },
};

export default widgetModule;
