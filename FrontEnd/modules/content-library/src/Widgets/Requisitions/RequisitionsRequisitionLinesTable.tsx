import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import loadRequisition from "@insite/client-framework/Store/Data/Requisitions/Handlers/LoadRequisition";
import { getRequisitionState } from "@insite/client-framework/Store/Data/Requisitions/RequisitionsSelectors";
import translate from "@insite/client-framework/Translate";
import RequisitionsRequisitionLineRow from "@insite/content-library/Widgets/Requisitions/RequisitionsRequisitionLineRow";
import DataTable, { DataTablePresentationProps } from "@insite/mobius/DataTable";
import DataTableBody, { DataTableBodyProps } from "@insite/mobius/DataTable/DataTableBody";
import DataTableHead, { DataTableHeadProps } from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderPresentationProps } from "@insite/mobius/DataTable/DataTableHeader";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useEffect } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    requisitionId: string;
}

const mapStateToProps = (state: ApplicationState, ownProps: OwnProps) => ({
    requisitionState: getRequisitionState(state, ownProps.requisitionId),
});

const mapDispatchToProps = {
    loadRequisition,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface RequisitionsRequisitionLinesTableStyles {
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    wrapper?: InjectableCss;
    table?: DataTablePresentationProps;
    head?: DataTableHeadProps;
    qtyOrderedHeader?: DataTableHeaderPresentationProps;
    dateHeader?: DataTableHeaderPresentationProps;
    costCodeHeader?: DataTableHeaderPresentationProps;
    firstNameHeader?: DataTableHeaderPresentationProps;
    lastNameHeader?: DataTableHeaderPresentationProps;
    usernameHeader?: DataTableHeaderPresentationProps;
    removeHeader?: DataTableHeaderPresentationProps;
    body?: DataTableBodyProps;
}

export const requisitionsRequisitionLinesTableStyles: RequisitionsRequisitionLinesTableStyles = {
    centeringWrapper: {
        css: css`
            height: 100px;
            display: flex;
            align-items: center;
        `,
    },
    spinner: {
        css: css`
            margin: auto;
        `,
    },
    wrapper: {
        css: css`
            overflow: auto;
        `,
    },
};

const styles = requisitionsRequisitionLinesTableStyles;

const RequisitionsRequisitionLinesTable = ({ requisitionId, requisitionState, loadRequisition }: Props) => {
    useEffect(() => {
        if (
            (!requisitionState.value && !requisitionState.isLoading) ||
            !requisitionState.value.requisitionLineCollection?.requisitionLines
        ) {
            loadRequisition({ requisitionId, expand: ["requisitionLines"] });
        }
    }, [requisitionState.value]);

    const requisitionLines = requisitionState.value?.requisitionLineCollection?.requisitionLines;
    if (!requisitionLines) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner {...styles.spinner} />
            </StyledWrapper>
        );
    }

    return (
        <>
            <StyledWrapper {...styles.wrapper} data-test-selector="requisitionLines">
                <DataTable {...styles.table}>
                    <DataTableHead {...styles.head}>
                        <DataTableHeader {...styles.qtyOrderedHeader}>{translate("QTY")}</DataTableHeader>
                        <DataTableHeader {...styles.dateHeader}>{translate("Date")}</DataTableHeader>
                        <DataTableHeader {...styles.costCodeHeader}>{translate("Cost Code")}</DataTableHeader>
                        <DataTableHeader {...styles.firstNameHeader}>{translate("First Name")}</DataTableHeader>
                        <DataTableHeader {...styles.lastNameHeader}>{translate("Last Name")}</DataTableHeader>
                        <DataTableHeader {...styles.usernameHeader}>{translate("Username")}</DataTableHeader>
                        <DataTableHeader {...styles.removeHeader}></DataTableHeader>
                    </DataTableHead>
                    <DataTableBody {...styles.body}>
                        {requisitionLines.map(requisitionLine => (
                            <RequisitionsRequisitionLineRow
                                key={requisitionLine.id}
                                requisitionId={requisitionId}
                                requisitionLine={requisitionLine}
                            />
                        ))}
                    </DataTableBody>
                </DataTable>
            </StyledWrapper>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(RequisitionsRequisitionLinesTable);
