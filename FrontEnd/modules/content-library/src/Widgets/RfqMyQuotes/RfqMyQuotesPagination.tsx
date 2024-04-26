import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getQuotesDataView } from "@insite/client-framework/Store/Data/Quotes/QuotesSelector";
import updateSearchFields from "@insite/client-framework/Store/Pages/RfqMyQuotes/Handlers/UpdateSearchFields";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RfqMyQuotesPageContext } from "@insite/content-library/Pages/RfqMyQuotesPage";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import React, { ChangeEvent } from "react";
import { connect, ResolveThunks } from "react-redux";

const mapStateToProps = (state: ApplicationState) => ({
    quotesDataView: getQuotesDataView(state, state.pages.rfqMyQuotes.getQuotesParameter),
});

const mapDispatchToProps = {
    updateSearchFields,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RfqMyQuotesPaginationStyles {
    pagination?: PaginationPresentationProps;
}

export const rfqMyQuotesPaginationStyles: RfqMyQuotesPaginationStyles = {};

const styles = rfqMyQuotesPaginationStyles;

const RfqMyQuotesPagination = ({ quotesDataView, updateSearchFields }: Props) => {
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

    if (!quotesDataView.value) {
        return null;
    }

    const { pagination } = quotesDataView;
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
    component: connect(mapStateToProps, mapDispatchToProps)(RfqMyQuotesPagination),
    definition: {
        group: "RFQ My Quotes",
        displayName: "Pagination",
        allowedContexts: [RfqMyQuotesPageContext],
    },
};

export default widgetModule;
