import { OrdersDataViewContext } from "@insite/client-framework/Store/Data/Orders/OrdersSelectors";
import updateSearchFields from "@insite/client-framework/Store/Pages/OrderHistory/Handlers/UpdateSearchFields";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { OrderHistoryPageContext } from "@insite/content-library/Pages/OrderHistoryPage";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import React, { FC, useContext } from "react";
import { connect, ResolveThunks } from "react-redux";

interface OwnProps extends WidgetProps {}

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = OwnProps & ResolveThunks<typeof mapDispatchToProps>;

export interface OrderHistoryPaginationStyles {
    pagination?: PaginationPresentationProps;
}

export const orderHistoryPaginationStyles: OrderHistoryPaginationStyles = {};

const styles = orderHistoryPaginationStyles;

const OrderHistoryPagination: FC<Props> = ({ updateSearchFields }) => {
    const ordersDataView = useContext(OrdersDataViewContext);

    if (!ordersDataView.value || !ordersDataView.pagination) {
        return null;
    }

    const { totalItemCount, page, pageSize, pageSizeOptions } = ordersDataView.pagination;

    if (totalItemCount === 0) {
        return null;
    }

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

    return (
        <Pagination
            {...styles.pagination}
            resultsCount={totalItemCount}
            currentPage={page}
            resultsPerPage={pageSize}
            resultsPerPageOptions={pageSizeOptions}
            onChangePage={changePage}
            onChangeResultsPerPage={changeResultsPerPage}
            pageSizeCookie="OrderHistory-PageSize"
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(OrderHistoryPagination),
    definition: {
        displayName: "Pagination",
        group: "Order History",
        allowedContexts: [OrderHistoryPageContext],
    },
};

export default widgetModule;
