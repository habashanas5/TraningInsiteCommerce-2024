import openPrintDialog from "@insite/client-framework/Common/Utilities/openPrintDialog";
import { InvoiceStateContext } from "@insite/client-framework/Store/Data/Invoices/InvoicesSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import ShareEntityButton, { ShareEntityButtonStyles } from "@insite/content-library/Components/ShareEntityButton";
import { InvoiceDetailsPageContext } from "@insite/content-library/Pages/InvoiceDetailsPage";
import Button, { ButtonPresentationProps } from "@insite/mobius/Button";
import Clickable, { ClickableProps } from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import OverflowMenu, { OverflowMenuProps } from "@insite/mobius/OverflowMenu/OverflowMenu";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import React, { FC, useContext } from "react";
import { css } from "styled-components";

const enum fields {
    generateEmailAttachmentFromWebpage = "generateEmailAttachmentFromWebpage",
}

export interface InvoiceDetailHeaderStyles {
    shareEntityButtonStyles?: ShareEntityButtonStyles;
    buttonsHiddenContainer?: HiddenProps;
    menuHiddenContainer?: HiddenProps;
    headerGridContainer?: GridContainerProps;
    narrowOverflowMenu?: OverflowMenuProps;
    title: TypographyProps;
    titleGridItem: GridItemProps;
    printButton?: ButtonPresentationProps;
    buttonGridItem?: GridItemProps;
    printClickable?: ClickableProps;
    emailClickable?: ClickableProps;
}

export const headerStyles: InvoiceDetailHeaderStyles = {
    shareEntityButtonStyles: {
        button: {
            buttonType: "outline",
            variant: "secondary",
        },
    },
    printButton: {
        buttonType: "outline",
        variant: "secondary",
        css: css`
            margin-left: 10px;
        `,
    },
    buttonGridItem: {
        css: css`
            justify-content: flex-end;
        `,
        width: [1, 1, 1, 6, 6],
    },
    titleGridItem: {
        width: [11, 11, 11, 6, 6],
    },
    title: {
        variant: "h2",
        as: "h1",
    },
    buttonsHiddenContainer: {
        below: "lg",
    },
    menuHiddenContainer: {
        above: "md",
    },
};

const styles = headerStyles;
const InvoiceDetailHeader: FC<WidgetProps> = ({ fields }) => {
    const { value: invoice } = useContext(InvoiceStateContext);
    const resolvedGenerateEmailAttachmentFromWebpage =
        fields.generateEmailAttachmentFromWebpage === true || fields.generateEmailAttachmentFromWebpage === undefined;
    if (!invoice) {
        return null;
    }

    const printLabel = translate("Print");

    return (
        <GridContainer {...styles.headerGridContainer}>
            <GridItem {...styles.titleGridItem}>
                <Typography {...styles.title} data-test-selector="tst_invoiceDetail_header">
                    {`${translate("Invoice")} ${invoice.invoiceNumber}`}
                </Typography>
            </GridItem>
            <GridItem {...styles.buttonGridItem}>
                <Hidden {...styles.menuHiddenContainer}>
                    <OverflowMenu hasChildPortal position="end" {...styles.narrowOverflowMenu}>
                        <ShareEntityButton
                            entityId={invoice.invoiceNumber}
                            variant="clickable"
                            entityName="Invoice"
                            extendedStyles={styles.shareEntityButtonStyles}
                            generateAttachmentFromWebpage={resolvedGenerateEmailAttachmentFromWebpage}
                        />
                        <Clickable
                            {...styles.printClickable}
                            onClick={openPrintDialog}
                            data-test-selector="invoiceDetails_print"
                        >
                            {printLabel}
                        </Clickable>
                    </OverflowMenu>
                </Hidden>
                <Hidden {...styles.buttonsHiddenContainer}>
                    <ShareEntityButton
                        entityId={invoice.invoiceNumber}
                        entityName="Invoice"
                        extendedStyles={styles.shareEntityButtonStyles}
                        generateAttachmentFromWebpage={resolvedGenerateEmailAttachmentFromWebpage}
                    />
                    <Button {...styles.printButton} onClick={openPrintDialog} data-test-selector="invoiceDetails_print">
                        {printLabel}
                    </Button>
                </Hidden>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: InvoiceDetailHeader,
    definition: {
        displayName: "Page Header",
        allowedContexts: [InvoiceDetailsPageContext],
        group: "Invoice History",
        fieldDefinitions: [
            {
                name: fields.generateEmailAttachmentFromWebpage,
                fieldType: "General",
                editorTemplate: "CheckboxField",
                defaultValue: true,
                tooltip:
                    "If checked, sharing the invoice generates an email attachment using the Invoice Details page, rather than a pre-defined PDF file.",
            },
        ],
    },
};

export default widgetModule;
