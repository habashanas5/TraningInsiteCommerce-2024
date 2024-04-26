import useAccessibleSubmit from "@insite/client-framework/Common/Hooks/useAccessibleSubmit";
import siteMessage from "@insite/client-framework/SiteMessage";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import deleteRequisitionLine from "@insite/client-framework/Store/Pages/Requisitions/Handlers/DeleteRequisitionLine";
import updateRequisitionLine from "@insite/client-framework/Store/Pages/Requisitions/Handlers/UpdateRequisitionLine";
import translate from "@insite/client-framework/Translate";
import { RequisitionLineModel } from "@insite/client-framework/Types/ApiModels";
import LocalizedDateTime from "@insite/content-library/Components/LocalizedDateTime";
import DataTableCell, { DataTableCellProps } from "@insite/mobius/DataTable/DataTableCell";
import DataTableRow, { DataTableRowProps } from "@insite/mobius/DataTable/DataTableRow";
import Link from "@insite/mobius/Link";
import TextField, { TextFieldPresentationProps } from "@insite/mobius/TextField";
import { HasToasterContext, withToaster } from "@insite/mobius/Toast/ToasterContext";
import React from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    requisitionId: string;
    requisitionLine: RequisitionLineModel;
}

const mapStateToProps = (state: ApplicationState) => ({
    isEditing: state.pages.requisitions.isEditing,
});

const mapDispatchToProps = {
    updateRequisitionLine,
    deleteRequisitionLine,
};

type Props = OwnProps &
    HasToasterContext &
    ReturnType<typeof mapStateToProps> &
    ResolveThunks<typeof mapDispatchToProps>;

export interface RequisitionsRequisitionLineRowStyles {
    row?: DataTableRowProps;
    qtyOrderedCell?: DataTableCellProps;
    qtyOrderedTextField?: TextFieldPresentationProps;
    dateCell?: DataTableCellProps;
    costCodeCell?: DataTableCellProps;
    firstNameCell?: DataTableCellProps;
    lastNameCell?: DataTableCellProps;
    usernameCell?: DataTableCellProps;
    removeCell?: DataTableCellProps;
}

export const requisitionsRequisitionLineRowStyles: RequisitionsRequisitionLineRowStyles = {
    qtyOrderedTextField: {
        cssOverrides: {
            formField: css`
                width: 70px;
            `,
        },
    },
};

const styles = requisitionsRequisitionLineRowStyles;

const RequisitionsRequisitionLineRow = ({
    requisitionId,
    requisitionLine,
    toaster,
    updateRequisitionLine,
    deleteRequisitionLine,
    isEditing,
}: Props) => {
    const qtyOrderedSubmitHandler = (value: string) => {
        const inputQty = Number.parseInt(value, 10);
        if (Number.isNaN(inputQty) || requisitionLine.qtyOrdered === inputQty) {
            return;
        }

        updateRequisitionLine({
            requisitionId,
            requisitionLineId: requisitionLine.id,
            requisitionLine: {
                ...requisitionLine,
                qtyOrdered: inputQty,
            },
            onSuccess: () => {
                toaster.addToast({ body: siteMessage("Requisition_ItemUpdated"), messageType: "success" });
            },
            onComplete(resultProps) {
                if (resultProps.result) {
                    // "this" is targeting the object being created, not the parent SFC
                    // eslint-disable-next-line react/no-this-in-sfc
                    this.onSuccess?.();
                }
            },
        });
    };

    const {
        value: qtyOrdered,
        changeHandler: qtyOrderedChangeHandler,
        keyDownHandler: qtyOrderedKeyDownHandler,
        blurHandler: qtyOrderedBlurHandler,
    } = useAccessibleSubmit(requisitionLine.qtyOrdered!.toString(), qtyOrderedSubmitHandler);

    const removeLineClickHandler = () => {
        deleteRequisitionLine({
            requisitionId,
            requisitionLineId: requisitionLine.id,
            onSuccess: () => {
                toaster.addToast({ body: siteMessage("Requisition_ItemDeleted"), messageType: "success" });
            },
            onComplete() {
                // "this" is targeting the object being created, not the parent SFC
                // eslint-disable-next-line react/no-this-in-sfc
                this.onSuccess?.();
            },
        });
    };

    return (
        <>
            <DataTableRow {...styles.row} data-test-selector="requisitionLine" data-test-key={requisitionLine.id}>
                <DataTableCell {...styles.qtyOrderedCell}>
                    <TextField
                        {...styles.qtyOrderedTextField}
                        type="number"
                        min={1}
                        value={qtyOrdered}
                        disabled={isEditing}
                        onChange={qtyOrderedChangeHandler}
                        onKeyDown={qtyOrderedKeyDownHandler}
                        onBlur={qtyOrderedBlurHandler}
                    />
                </DataTableCell>
                <DataTableCell {...styles.dateCell}>
                    <LocalizedDateTime dateTime={requisitionLine.orderDate} />
                </DataTableCell>
                <DataTableCell {...styles.costCodeCell}>{requisitionLine.costCode}</DataTableCell>
                <DataTableCell {...styles.firstNameCell}>{requisitionLine.firstName}</DataTableCell>
                <DataTableCell {...styles.lastNameCell}>{requisitionLine.lastName}</DataTableCell>
                <DataTableCell {...styles.usernameCell}>{requisitionLine.userName}</DataTableCell>
                <DataTableCell {...styles.removeCell}>
                    <Link onClick={removeLineClickHandler} disabled={isEditing} data-test-selector="delete">
                        {translate("Remove")}
                    </Link>
                </DataTableCell>
            </DataTableRow>
        </>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withToaster(RequisitionsRequisitionLineRow));
