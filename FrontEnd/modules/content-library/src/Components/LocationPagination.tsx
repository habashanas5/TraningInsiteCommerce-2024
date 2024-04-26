/* eslint-disable spire/export-styles */
import { LocationModel } from "@insite/client-framework/Common/Hooks/useLocationFilterSearch";
import { PaginationModel } from "@insite/client-framework/Types/ApiModels";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import * as React from "react";

type Props = PaginationPresentationProps & {
    locations: LocationModel[];
    locationsPagination?: PaginationModel;
    setPage: (page: number) => void;
    setPageSize: (pageSize: number) => void;
};

const LocationPagination: React.FC<Props> = ({
    locations,
    locationsPagination,
    setPageSize,
    setPage,
    ...otherProps
}) => {
    const [showPagination, setShowPagination] = React.useState(false);
    React.useEffect(() => {
        setShowPagination(
            locations.length > 0 &&
                !!locationsPagination &&
                locationsPagination.totalItemCount > locationsPagination.pageSize,
        );
    }, [locations, locationsPagination]);

    const onChangePage = (page: number) => {
        setPage(page);
    };

    const onChangeResultsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setPage(1);
        setPageSize(Number(event.currentTarget.value));
    };

    return showPagination ? (
        <Pagination
            currentPage={locationsPagination!.currentPage}
            resultsPerPage={locationsPagination!.pageSize}
            resultsCount={locationsPagination!.totalItemCount}
            resultsPerPageOptions={locationsPagination!.pageSizeOptions}
            onChangePage={onChangePage}
            onChangeResultsPerPage={onChangeResultsPerPage}
            {...otherProps}
        />
    ) : null;
};

export default LocationPagination;
