import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getJobQuotesDataView } from "@insite/client-framework/Store/Data/JobQuotes/JobQuotesSelector";
import updateSearchFields from "@insite/client-framework/Store/Pages/RfqJobQuotes/Handlers/UpdateSearchFields";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RfqJobQuotesPageContext } from "@insite/content-library/Pages/RfqJobQuotesPage";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import React, { ChangeEvent } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    jobQuotesDataView: getJobQuotesDataView(state, state.pages.rfqJobQuotes.getJobQuotesParameter),
});

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RfqJobQuotesPaginationStyles {
    pagination?: PaginationPresentationProps;
}

export const rfqJobQuotesPaginationStyles: RfqJobQuotesPaginationStyles = {};

const styles = rfqJobQuotesPaginationStyles;

const RfqJobQuotesPagination = ({ jobQuotesDataView, updateSearchFields }: Props) => {
    const changePage = (newPageIndex: number) => {
        updateSearchFields({
            page: newPageIndex,
        });
    };

    const changeResultsPerPage = (event: ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(event.currentTarget.value, 10);
        updateSearchFields({
            page: 1,
            pageSize: newPageSize,
        });
    };

    if (!jobQuotesDataView.value) {
        return null;
    }

    const { pagination } = jobQuotesDataView;
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
    component: connect(mapStateToProps, mapDispatchToProps)(RfqJobQuotesPagination),
    definition: {
        group: "RFQ Job Quotes",
        displayName: "Pagination",
        allowedContexts: [RfqJobQuotesPageContext],
    },
};

export default widgetModule;
