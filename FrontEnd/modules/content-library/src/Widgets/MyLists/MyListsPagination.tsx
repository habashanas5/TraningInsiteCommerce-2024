import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getWishListsDataView } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import updateLoadParameter from "@insite/client-framework/Store/Pages/MyLists/Handlers/UpdateLoadParameter";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { MyListsPageContext } from "@insite/content-library/Pages/MyListsPage";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    wishListsDataView: getWishListsDataView(state, state.pages.myLists.getWishListsParameter),
});

const mapDispatchToProps = {
    updateLoadParameter,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface MyListsPaginationStyles {
    wrapper?: InjectableCss;
    pagination?: PaginationPresentationProps;
}

export const paginationStyles: MyListsPaginationStyles = {
    wrapper: {
        css: css`
            padding: 20px 0;
        `,
    },
};

const styles = paginationStyles;

const MyListsPagination: React.FC<Props> = ({ wishListsDataView, updateLoadParameter }) => {
    if (!wishListsDataView.value || !wishListsDataView.pagination) {
        return null;
    }

    const pagination = wishListsDataView.pagination;

    const changePage = (newPageIndex: number) => {
        updateLoadParameter({ page: newPageIndex });
    };

    const changeResultsPerPage = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(event.currentTarget.value, 10);
        updateLoadParameter({ pageSize: newPageSize });
    };

    if (!pagination.totalItemCount) {
        return null;
    }

    return (
        <StyledWrapper {...styles.wrapper}>
            <Pagination
                {...styles.pagination}
                resultsCount={pagination.totalItemCount}
                currentPage={pagination.page}
                resultsPerPage={pagination.pageSize}
                resultsPerPageOptions={pagination.pageSizeOptions}
                onChangePage={changePage}
                onChangeResultsPerPage={changeResultsPerPage}
                pageSizeCookie="Lists-PageSize"
            />
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(MyListsPagination),
    definition: {
        group: "My Lists",
        displayName: "Pagination",
        allowedContexts: [MyListsPageContext],
    },
};

export default widgetModule;
