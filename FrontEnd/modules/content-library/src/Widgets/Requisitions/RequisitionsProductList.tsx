import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { getRequisitionsDataView } from "@insite/client-framework/Store/Data/Requisitions/RequisitionsSelectors";
import setAllRequisitionsIsSelected from "@insite/client-framework/Store/Pages/Requisitions/Handlers/SetAllRequisitionsIsSelected";
import updateGetRequisitionsParameter from "@insite/client-framework/Store/Pages/Requisitions/Handlers/UpdateGetRequisitionsParameter";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { RequisitionsPageContext } from "@insite/content-library/Pages/RequisitionsPage";
import RequisitionsProductListLine from "@insite/content-library/Widgets/Requisitions/RequisitionsProductListLine";
import Checkbox, { CheckboxPresentationProps, CheckboxProps } from "@insite/mobius/Checkbox";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Pagination, { PaginationPresentationProps } from "@insite/mobius/Pagination";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapStateToProps = (state: ApplicationState) => ({
    requisitionsDataView: getRequisitionsDataView(state, state.pages.requisitions.getRequisitionsParameter),
    selectedRequisitionIds: state.pages.requisitions.selectedRequisitionIds,
});

const mapDispatchToProps = {
    setAllRequisitionsIsSelected,
    updateGetRequisitionsParameter,
};

type Props = WidgetProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RequisitionsProductListStyles {
    wrapper?: InjectableCss;
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    noResultsContainer?: InjectableCss;
    noResultsText?: TypographyPresentationProps;
    countText?: TypographyPresentationProps;
    selectAllCheckbox?: CheckboxPresentationProps;
    linesWrapper?: InjectableCss;
    paginationWrapper?: InjectableCss;
    pagination?: PaginationPresentationProps;
}

export const requisitionsProductListStyles: RequisitionsProductListStyles = {
    wrapper: {
        css: css`
            overflow: auto;
        `,
    },
    centeringWrapper: {
        css: css`
            height: 300px;
            display: flex;
            align-items: center;
        `,
    },
    spinner: {
        css: css`
            margin: auto;
        `,
    },
    noResultsContainer: {
        css: css`
            text-align: center;
            padding: 20px;
        `,
    },
    noResultsText: {
        size: 16,
        weight: 600,
    },
    countText: {
        css: css`
            vertical-align: top;
        `,
    },
    selectAllCheckbox: {
        css: css`
            margin-left: 20px;
        `,
    },
    linesWrapper: {
        css: css`
            margin-top: 20px;
        `,
    },
};

const styles = requisitionsProductListStyles;

const RequisitionsProductList = ({
    requisitionsDataView,
    selectedRequisitionIds,
    setAllRequisitionsIsSelected,
    updateGetRequisitionsParameter,
}: Props) => {
    if (requisitionsDataView.isLoading || !requisitionsDataView.value) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner {...styles.spinner}></LoadingSpinner>
            </StyledWrapper>
        );
    }

    const requisitions = requisitionsDataView.value;
    if (requisitions.length === 0) {
        return (
            <StyledWrapper {...styles.noResultsContainer}>
                <Typography {...styles.noResultsText}>{translate("No requisitions found")}</Typography>
            </StyledWrapper>
        );
    }

    const isAllSelected =
        requisitionsDataView.value &&
        requisitionsDataView.value.length > 0 &&
        requisitionsDataView.value.every(o => selectedRequisitionIds.indexOf(o.id) >= 0);

    const selectAllChangeHandler: CheckboxProps["onChange"] = (_, value) => {
        const allRequisitionIds = value ? requisitionsDataView?.value?.map(o => o.id) : undefined;
        setAllRequisitionsIsSelected({ isSelected: value, requisitionIds: allRequisitionIds });
    };

    const changePageHandler = (newPageIndex: number) => {
        updateGetRequisitionsParameter({ page: newPageIndex });
    };

    const changeResultsPerPageHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newPageSize = parseInt(event.currentTarget.value, 10);
        updateGetRequisitionsParameter({ pageSize: newPageSize });
    };

    const pagination = requisitionsDataView.pagination;
    const totalCount = pagination?.totalItemCount || 0;

    return (
        <>
            <Typography {...styles.countText}>
                {totalCount === 1 && translate("{0} Requisition", totalCount.toString())}
                {totalCount > 1 && translate("{0} Requisitions", totalCount.toString())}
            </Typography>
            <Checkbox {...styles.selectAllCheckbox} checked={isAllSelected} onChange={selectAllChangeHandler}>
                {translate("Select All")}
            </Checkbox>
            <StyledWrapper {...styles.linesWrapper}>
                {requisitions.map(requisition => (
                    <RequisitionsProductListLine key={requisition.id} requisition={requisition} />
                ))}
            </StyledWrapper>
            {pagination && (
                <StyledWrapper {...styles.paginationWrapper}>
                    <Pagination
                        {...styles.pagination}
                        currentPage={pagination.currentPage}
                        resultsPerPage={pagination.pageSize}
                        resultsCount={pagination.totalItemCount}
                        resultsPerPageOptions={pagination.pageSizeOptions}
                        onChangePage={changePageHandler}
                        onChangeResultsPerPage={changeResultsPerPageHandler}
                    />
                </StyledWrapper>
            )}
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(mapStateToProps, mapDispatchToProps)(RequisitionsProductList),
    definition: {
        displayName: "Product List",
        allowedContexts: [RequisitionsPageContext],
        group: "Requisitions",
    },
};

export default widgetModule;
