import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getWishListLinesDataView } from "@insite/client-framework/Store/Data/WishListLines/WishListLinesSelectors";
import { getWishListState } from "@insite/client-framework/Store/Data/WishLists/WishListsSelectors";
import loadWishListLines from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListLines";
import updateLoadWishListLinesParameter from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/UpdateLoadWishListLinesParameter";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { MyListsDetailsPageContext } from "@insite/content-library/Pages/MyListsDetailsPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    wishListDataView: getWishListState(state, state.pages.myListDetails.wishListId),
    wishListLinesDataView: getWishListLinesDataView(state, state.pages.myListDetails.loadWishListLinesParameter),
});

const mapDispatchToProps = {
    updateLoadWishListLinesParameter,
    loadWishListLines,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface MyListsDetailsOptionsStyles {
    paginationContainer?: GridContainerProps;
    paginationGridItem?: GridItemProps;
    pagination?: PaginationPresentationProps;
}

export const myListsDetailsOptionsStyles: MyListsDetailsOptionsStyles = {
    paginationContainer: {
        css: css`
            margin: 0;
        `,
    },
    paginationGridItem: {
        width: 12,
        css: css`
            justify-content: flex-end;
        `,
    },
    pagination: {
        cssOverrides: {
            pagination: css`
                @media print {
                    display: none;
                }
            `,
        },
    },
};

const styles = myListsDetailsOptionsStyles;

const MyListDetailsPagination: React.FC<Props> = ({
    wishListDataView,
    wishListLinesDataView,
    updateLoadWishListLinesParameter,
    loadWishListLines,
}) => {
    if (
        !wishListDataView.value ||
        !wishListLinesDataView.value ||
        wishListLinesDataView.isLoading ||
        !wishListLinesDataView.pagination
    ) {
        return null;
    }

    const changePageHandler = (newPageIndex: number) => {
        updateLoadWishListLinesParameter({ page: newPageIndex });
        loadWishListLines();
    };

    const changeResultsPerPageHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(event.currentTarget.value, 10);
        updateLoadWishListLinesParameter({ pageSize: newPageSize });
        loadWishListLines();
    };

    const pagination = wishListLinesDataView.pagination;

    return (
        <GridContainer {...styles.paginationContainer}>
            <GridItem {...styles.paginationGridItem} data-test-selector="pagination">
                <Pagination
                    {...styles.pagination}
                    currentPage={pagination.currentPage}
                    resultsPerPage={pagination.pageSize}
                    resultsCount={pagination.totalItemCount}
                    resultsPerPageOptions={pagination.pageSizeOptions}
                    onChangePage={changePageHandler}
                    onChangeResultsPerPage={changeResultsPerPageHandler}
                />
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(MyListDetailsPagination),
    definition: {
        group: "My Lists Details",
        displayName: "Pagination",
        allowedContexts: [MyListsDetailsPageContext],
    },
};

export default widgetModule;
