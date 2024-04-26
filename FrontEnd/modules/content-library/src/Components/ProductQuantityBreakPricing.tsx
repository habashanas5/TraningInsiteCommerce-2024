import mergeToNew from "@insite/client-framework/Common/mergeToNew";
import { HasProduct, withProduct } from "@insite/client-framework/Components/ProductContext";
import translate from "@insite/client-framework/Translate";
import DataTable, { DataTableProps } from "@insite/mobius/DataTable";
import DataTableBody, { DataTableBodyProps } from "@insite/mobius/DataTable/DataTableBody";
import DataTableCell from "@insite/mobius/DataTable/DataTableCell";
import { DataTableCellBaseProps } from "@insite/mobius/DataTable/DataTableCellBase";
import DataTableHead, { DataTableHeadProps } from "@insite/mobius/DataTable/DataTableHead";
import DataTableHeader, { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import DataTableRow, { DataTableRowProps } from "@insite/mobius/DataTable/DataTableRow";
import Link, { LinkPresentationProps } from "@insite/mobius/Link";
import Modal, { ModalPresentationProps } from "@insite/mobius/Modal";
import React, { FC } from "react";
import { css } from "styled-components";

interface OwnProps {
    extendedStyles?: ProductQuantityBreakPricingStyles;
}

export interface ProductQuantityBreakPricingStyles {
    viewLink?: LinkPresentationProps;
    modal?: ModalPresentationProps;
    table?: DataTableProps;
    tableHead?: DataTableHeadProps;
    breakQtyHeader?: DataTableHeaderProps;
    breakPriceHeader?: DataTableHeaderProps;
    savingsHeader?: DataTableHeaderProps;
    tableBody?: DataTableBodyProps;
    tableRow?: DataTableRowProps;
    breakQtyCell?: DataTableCellBaseProps;
    breakPriceCell?: DataTableCellBaseProps;
    savingsCell?: DataTableCellBaseProps;
}

export const productQuantityBreakPricingStyles: ProductQuantityBreakPricingStyles = {
    modal: {
        size: 400,
        cssOverrides: {
            modalContent: css`
                padding: 0;
            `,
            modalTitle: css`
                padding: 10px 10px 10px 20px;
            `,
            headlineTypography: css`
                font-size: 20px;
                margin-bottom: 0;
            `,
        },
    },
    breakQtyHeader: { alignX: "center" },
    breakPriceHeader: { alignX: "center" },
    savingsHeader: { alignX: "center" },
    breakQtyCell: { alignX: "center" },
    breakPriceCell: { alignX: "center" },
    savingsCell: { alignX: "center" },
};

const ProductQuantityBreakPricing: FC<OwnProps & HasProduct> = ({
    product,
    productInfo: { pricing },
    extendedStyles,
}) => {
    const [modalIsOpen, setModalIsOpen] = React.useState(false);
    const modalCloseHandler = () => {
        setModalIsOpen(false);
    };
    const viewLinkClickHandler = () => {
        setModalIsOpen(true);
    };

    const [styles] = React.useState(() => mergeToNew(productQuantityBreakPricingStyles, extendedStyles));

    if (
        !product ||
        product.quoteRequired ||
        !pricing ||
        !pricing.unitRegularBreakPrices ||
        pricing.unitRegularBreakPrices.length < 2
    ) {
        return null;
    }

    return (
        <>
            <Link {...styles.viewLink} onClick={viewLinkClickHandler} data-test-selector="quantityBreakPricingLink">
                {translate("View Quantity Break Pricing")}
            </Link>
            <Modal
                {...styles.modal}
                headline={translate("Quantity Pricing")}
                isOpen={modalIsOpen}
                handleClose={modalCloseHandler}
                data-test-selector="quantityBreakPricingModal"
            >
                <DataTable {...styles.table}>
                    <DataTableHead {...styles.tableHead}>
                        <DataTableHeader {...styles.breakQtyHeader}>{translate("Min Qty")}</DataTableHeader>
                        <DataTableHeader {...styles.breakPriceHeader}>{translate("Price Per")}</DataTableHeader>
                        <DataTableHeader {...styles.savingsHeader} title={translate("Savings")} />
                    </DataTableHead>
                    <DataTableBody {...styles.tableBody}>
                        {pricing!.unitRegularBreakPrices!.map(breakPrice => (
                            <DataTableRow
                                {...styles.tableRow}
                                key={breakPrice.breakQty}
                                data-test-selector="breakPriceRow"
                            >
                                <DataTableCell {...styles.breakQtyCell} data-test-selector="breakQty">
                                    {breakPrice.breakQty}
                                </DataTableCell>
                                <DataTableCell {...styles.breakPriceCell} data-test-selector="price">
                                    {breakPrice.breakPriceDisplay}
                                </DataTableCell>
                                <DataTableCell {...styles.savingsCell} data-test-selector="message">
                                    {breakPrice.savingsMessage}
                                </DataTableCell>
                            </DataTableRow>
                        ))}
                    </DataTableBody>
                </DataTable>
            </Modal>
        </>
    );
};

export default withProduct(ProductQuantityBreakPricing);
