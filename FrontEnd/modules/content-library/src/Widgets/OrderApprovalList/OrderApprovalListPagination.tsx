import { OrderApprovalsDataViewContext } from "@insite/client-framework/Store/Data/OrderApprovals/OrderApprovalsSelectors";
import updateSearchFields from "@insite/client-framework/Store/Pages/OrderApprovalList/Handlers/UpdateSearchFields";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { OrderApprovalListPageContext } from "@insite/content-library/Pages/OrderApprovalListPage";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import React, { useContext } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = WidgetProps & ResolveThunks<typeof mapDispatchToProps>;

export interface OrderApprovalListPaginationStyles {
    pagination?: PaginationPresentationProps;
}

export const paginationStyles: OrderApprovalListPaginationStyles = {};

const styles = paginationStyles;

const OrderApprovalListPagination = ({ updateSearchFields }: Props) => {
    const orderApprovalsDataView = useContext(OrderApprovalsDataViewContext);
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

    if (!orderApprovalsDataView.value) {
        return null;
    }

    const { pagination } = orderApprovalsDataView;
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
    component: connect(null, mapDispatchToProps)(OrderApprovalListPagination),
    definition: {
        group: "Order Approval List",
        displayName: "Pagination",
        allowedContexts: [OrderApprovalListPageContext],
        isSystem: true,
    },
};

export default widgetModule;
