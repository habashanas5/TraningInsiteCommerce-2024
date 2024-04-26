import { VmiLocationsDataViewContext } from "@insite/client-framework/Store/Data/VmiLocations/VmiLocationsSelectors";
import updateSearchFields from "@insite/client-framework/Store/Pages/VmiLocations/Handlers/UpdateSearchFields";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { LocationsPageContext } from "@insite/content-library/Pages/VmiLocationsPage";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import React, { useContext } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = WidgetProps & ResolveThunks<typeof mapDispatchToProps>;

export interface VmiLocationsPaginationPaginationStyles {
    pagination?: PaginationPresentationProps;
}

export const vmiLocationsPaginationPaginationStyles: VmiLocationsPaginationPaginationStyles = {};

const styles = vmiLocationsPaginationPaginationStyles;

const VmiLocationsPagination = ({ updateSearchFields }: Props) => {
    const vmiLocationsDataView = useContext(VmiLocationsDataViewContext);

    if (!vmiLocationsDataView.value || !vmiLocationsDataView.pagination) {
        return null;
    }

    const { totalItemCount, page, pageSize, pageSizeOptions } = vmiLocationsDataView.pagination;

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
            pageSizeCookie="VmiLocations-PageSize"
        />
    );
};

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(VmiLocationsPagination),
    definition: {
        displayName: "Pagination",
        group: "VMI Locations",
        allowedContexts: [LocationsPageContext],
    },
};

export default widgetModule;
