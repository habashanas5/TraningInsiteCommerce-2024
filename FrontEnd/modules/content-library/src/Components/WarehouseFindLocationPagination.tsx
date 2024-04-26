/* eslint-disable spire/export-styles */
import { PaginationModel, WarehouseModel } from "@insite/client-framework/Types/ApiModels";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import * as React from "react";

type Props = PaginationPresentationProps & {
    warehouses: WarehouseModel[];
    warehousesPagination?: PaginationModel;
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
};

const WarehouseFindLocationPagination: React.FC<Props> = ({
    warehouses,
    warehousesPagination,
    setPageSize,
    setPage,
    ...otherProps
}) => {
    const [showPagination, setShowPagination] = React.useState(false);
    React.useEffect(() => {
        setShowPagination(
            warehouses.length > 0 &&
                !!warehousesPagination &&
                warehousesPagination.totalItemCount > warehousesPagination.pageSize,
        );
    }, [warehouses, warehousesPagination]);

    const onChangePage = (page: number) => {
        setPage(page);
    };

    const onChangeResultsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPage(1);
        setPageSize(Number(event.currentTarget.value));
    };

    return showPagination ? (
        <Pagination
            currentPage={warehousesPagination!.currentPage}
            resultsPerPage={warehousesPagination!.pageSize}
            resultsCount={warehousesPagination!.totalItemCount}
            resultsPerPageOptions={warehousesPagination!.pageSizeOptions}
            onChangePage={onChangePage}
            onChangeResultsPerPage={onChangeResultsPerPage}
            {...otherProps}
        />
    ) : null;
};

export default WarehouseFindLocationPagination;
