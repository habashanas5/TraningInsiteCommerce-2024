import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import ApplicationState from "@insite/client-framework/Store/ApplicationState";
import { UploadError } from "@insite/client-framework/Store/Components/OrderUpload/Handlers/BatchLoadProducts";
import cleanupUploadData from "@insite/client-framework/Store/Components/OrderUpload/Handlers/CleanupUploadData";
import setContinueUpload from "@insite/client-framework/Store/Components/OrderUpload/Handlers/SetContinueUpload";
import setErrorsModalIsOpen from "@insite/client-framework/Store/Components/OrderUpload/Handlers/SetErrorsModalIsOpen";
import setIsBadFile from "@insite/client-framework/Store/Components/OrderUpload/Handlers/SetIsBadFile";
import setUploadLimitExceeded from "@insite/client-framework/Store/Components/OrderUpload/Handlers/SetUploadLimitExceeded";
import translate from "@insite/client-framework/Translate";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import DataTable, { DataTableProps } from "@insite/mobius/DataTable";
import DataTableBody, { DataTableBodyProps } from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell from "@insite/mobius/DataTable/DataTableCell";
import { DataTableCellBaseProps } from "@insite/mobius/DataTable/DataTableCellBase";
import DataTableHead, { DataTableHeadProps } from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow, { DataTableRowProps } from "@insite/mobius/DataTable/DataTableRow";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React, { useState } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps {
    descriptionText: React.ReactNode;
    uploadErrorText: React.ReactNode;
    rowsLimitExceededText: React.ReactNode;
    errorReasons: { [K in UploadError]?: React.ReactNode };
    extendedStyles?: OrderUploadErrorsModalStyles;
}

const mapStateToProps = (state: ApplicationState) => ({
    errorsModalIsOpen: state.components.orderUpload.errorsModalIsOpen,
    products: state.components.orderUpload.products,
    rowErrors: state.components.orderUpload.rowErrors,
    isBadFile: state.components.orderUpload.isBadFile,
    uploadLimitExceeded: state.components.orderUpload.uploadLimitExceeded,
});

const mapDispatchToProps = {
    setErrorsModalIsOpen,
    cleanupUploadData,
    setIsBadFile,
    setUploadLimitExceeded,
    setContinueUpload,
};

type Props = OwnProps & ReturnType<typeof mapStateToProps> & ResolveThunks<typeof mapDispatchToProps>;

export interface OrderUploadErrorsModalStyles {
    modal?: ModalPresentationProps;
    errorMessagesModal?: ModalPresentationProps;
    uploadErrorText?: TypographyPresentationProps;
    rowsLimitExceededErrorText?: TypographyPresentationProps;
    continueButton?: ButtonPresentationProps;
    descriptionText?: TypographyPresentationProps;
    dataTable?: DataTableProps;
    tableHead?: DataTableHeadProps;
    rowNumberHeader?: DataTableHeaderProps;
    itemNumberHeader?: DataTableHeaderProps;
    qtyHeader?: DataTableHeaderProps;
    unitOfMeasureHeader?: DataTableHeaderProps;
    reasonHeader?: DataTableHeaderProps;
    tableBody?: DataTableBodyProps;
    tableRow?: DataTableRowProps;
    rowNumberCell?: DataTableCellBaseProps;
    nameCell?: DataTableCellBaseProps;
    qtyCell?: DataTableCellBaseProps;
    umCell?: DataTableCellBaseProps;
    reasonCell?: DataTableCellBaseProps;
    buttonsWrapper?: InjectableCss;
    cancelUploadButton?: ButtonPresentationProps;
    continueUploadButton?: ButtonPresentationProps;
}

export const orderUploadErrorsModalStyles: OrderUploadErrorsModalStyles = {
    modal: {
        sizeVariant: "medium",
        cssOverrides: {
            modalTitle: css`
                padding: 10px 20px;
            `,
            modalContent: css`
                padding: 20px;
            `,
        },
    },
    errorMessagesModal: {
        sizeVariant: "small",
        cssOverrides: {
            modalTitle: css`
                padding: 10px 20px;
            `,
            modalContent: css`
                padding: 20px;
            `,
        },
    },
    uploadErrorText: {
        color: "danger",
        css: css`
            line-height: 25px;
        `,
    },
    rowsLimitExceededErrorText: {
        color: "danger",
        css: css`
            line-height: 25px;
        `,
    },
    continueButton: {
        variant: "tertiary",
        css: css`
            margin-top: 15px;
            float: right;
        `,
    },
    dataTable: {
        cssOverrides: {
            table: css`
                margin-top: 15px;
            `,
        },
    },
    buttonsWrapper: {
        css: css`
            margin-top: 30px;
            text-align: right;
        `,
    },
    cancelUploadButton: {
        variant: "secondary",
    },
    continueUploadButton: {
        css: css`
            margin-left: 10px;
        `,
    },
};

const OrderUploadErrorsModal: React.FC<Props> = ({
    errorsModalIsOpen,
    products,
    rowErrors,
    isBadFile,
    uploadLimitExceeded,
    setErrorsModalIsOpen,
    cleanupUploadData,
    setIsBadFile,
    setUploadLimitExceeded,
    setContinueUpload,
    descriptionText,
    uploadErrorText,
    rowsLimitExceededText,
    errorReasons,
    extendedStyles,
}) => {
    const [styles] = React.useState(() => mergeToNew(orderUploadErrorsModalStyles, extendedStyles));
    const [uploadCanceled, setUploadCanceled] = useState(false);

    const closeModal = () => {
        setErrorsModalIsOpen({ errorsModalIsOpen: false });
    };

    const modalOnAfterCloseHandler = () => {
        setIsBadFile({ isBadFile: false });
        setUploadLimitExceeded({ uploadLimitExceeded: false });
        if (uploadCanceled) {
            cleanupUploadData();
            setUploadCanceled(false);
        }
    };

    const cancelUploadClickHandler = () => {
        setErrorsModalIsOpen({ errorsModalIsOpen: false });
        setUploadCanceled(true);
    };

    const continueUploadClickHandler = () => {
        setErrorsModalIsOpen({ errorsModalIsOpen: false });
        setContinueUpload({ continueUpload: true });
    };

    return (
        <Modal
            {...(isBadFile || uploadLimitExceeded ? styles.errorMessagesModal : styles.modal)}
            headline={translate("Upload Error")}
            isOpen={errorsModalIsOpen}
            handleClose={closeModal}
            onAfterClose={modalOnAfterCloseHandler}
        >
            {isBadFile || uploadLimitExceeded ? (
                <>
                    {isBadFile && (
                        <Typography as="p" {...styles.uploadErrorText}>
                            {uploadErrorText}
                        </Typography>
                    )}
                    {uploadLimitExceeded && (
                        <Typography as="p" {...styles.rowsLimitExceededErrorText}>
                            {rowsLimitExceededText}
                        </Typography>
                    )}
                    <Button {...styles.continueButton} onClick={closeModal}>
                        {translate("Continue")}
                    </Button>
                </>
            ) : (
                <>
                    <Typography {...styles.descriptionText}>{descriptionText}</Typography>
                    <DataTable {...styles.dataTable}>
                        <DataTableHead {...styles.tableHead}>
                            <DataTableHeader {...styles.rowNumberHeader}>{translate("Row")}</DataTableHeader>
                            <DataTableHeader {...styles.itemNumberHeader}>{translate("Item #")}</DataTableHeader>
                            <DataTableHeader {...styles.qtyHeader}>{translate("QTY")}</DataTableHeader>
                            <DataTableHeader {...styles.unitOfMeasureHeader}>{translate("U/M")}</DataTableHeader>
                            <DataTableHeader {...styles.reasonHeader}>{translate("Reason")}</DataTableHeader>
                        </DataTableHead>
                        <DataTableBody {...styles.tableBody}>
                            {rowErrors.map(({ index, name, qtyRequested, umRequested, error }) => (
                                <DataTableRow key={index} {...styles.tableRow}>
                                    <DataTableCell {...styles.rowNumberCell}>{index}</DataTableCell>
                                    <DataTableCell {...styles.nameCell}>{name}</DataTableCell>
                                    <DataTableCell {...styles.qtyCell}>{qtyRequested}</DataTableCell>
                                    <DataTableCell {...styles.umCell}>{umRequested}</DataTableCell>
                                    <DataTableCell {...styles.reasonCell}>
                                        {error === UploadError.NotEnough && errorReasons[UploadError.NotEnough]}
                                        {error === UploadError.ConfigurableProduct &&
                                            errorReasons[UploadError.ConfigurableProduct]}
                                        {error === UploadError.StyledProduct && errorReasons[UploadError.StyledProduct]}
                                        {error === UploadError.Unavailable && errorReasons[UploadError.Unavailable]}
                                        {error === UploadError.InvalidUnit && errorReasons[UploadError.InvalidUnit]}
                                        {error === UploadError.NotFound && errorReasons[UploadError.NotFound]}
                                        {error === UploadError.OutOfStock && errorReasons[UploadError.OutOfStock]}
                                    </DataTableCell>
                                </DataTableRow>
                            ))}
                        </DataTableBody>
                    </DataTable>
                    <StyledWrapper {...styles.buttonsWrapper}>
                        <Button {...styles.cancelUploadButton} onClick={cancelUploadClickHandler}>
                            {translate("Cancel Upload")}
                        </Button>
                        <Button
                            {...styles.continueUploadButton}
                            onClick={continueUploadClickHandler}
                            disabled={!products || products.length === 0}
                        >
                            {translate("Continue Upload")}
                        </Button>
                    </StyledWrapper>
                </>
            )}
        </Modal>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderUploadErrorsModal);
