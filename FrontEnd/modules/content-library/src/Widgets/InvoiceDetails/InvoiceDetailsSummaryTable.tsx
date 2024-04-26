import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import { InvoiceStateContext } from "@insite/client-framework/Store/Data/Invoices/InvoicesSelectors";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import { InvoiceDetailsPageContext } from "@insite/content-library/Pages/InvoiceDetailsPage";
import InvoiceDetailsLineCard, {
    InvoiceDetailsLineCardStyles,
} from "@insite/content-library/Widgets/InvoiceDetails/InvoiceDetailsLineCard";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import LoadingSpinner, { LoadingSpinnerProps } from "@insite/mobius/LoadingSpinner";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import getColor from "@insite/mobius/utilities/getColor";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import * as React from "react";
import { useContext } from "react";
import { css } from "styled-components";

export interface InvoiceDetailsSummaryTableStyles {
    centeringWrapper?: InjectableCss;
    spinner?: LoadingSpinnerProps;
    container?: GridContainerProps;
    titleItem?: GridItemProps;
    title?: TypographyProps;
    linesItem?: GridItemProps;
    linesInnerContainer?: GridContainerProps;
    lineItem?: GridItemProps;
    lineStyles?: InvoiceDetailsLineCardStyles;
}

export const summaryTableStyles: InvoiceDetailsSummaryTableStyles = {
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
    titleItem: {
        width: 12,
        css: css`
            padding-bottom: 10px;
        `,
    },
    title: {
        weight: "bold",
        size: "18px",
        as: "h2",
        css: css`
            @media print {
                font-size: 15px;
            }
            width: 100%;
            padding: 15px 0;
            border-bottom: 1px solid ${getColor("common.border")};
        `,
    },
    linesItem: {
        width: 12,
    },
    lineItem: {
        width: 12,
        css: css`
            padding-top: 20px;
            border-bottom: 1px solid ${getColor("common.border")};
            &:first-child {
                padding-top: 10px;
            }
        `,
    },
};

const styles = summaryTableStyles;

const InvoiceDetailsSummaryTable = () => {
    const invoiceState = useContext(InvoiceStateContext);
    if (invoiceState.isLoading) {
        return (
            <StyledWrapper {...styles.centeringWrapper}>
                <LoadingSpinner {...styles.spinner}></LoadingSpinner>
            </StyledWrapper>
        );
    }

    const invoice = invoiceState.value;

    if (!invoice || !invoice.invoiceLines || invoice.invoiceLines.length === 0) {
        return null;
    }

    return (
        <GridContainer {...styles.container} data-test-selector="invoiceDetail_summaryTable">
            <GridItem {...styles.titleItem}>
                <Typography {...styles.title}>{translate("Invoice Summary")}</Typography>
            </GridItem>
            <GridItem {...styles.linesItem}>
                <GridContainer {...styles.linesInnerContainer}>
                    {invoice.invoiceLines.map(invoiceLine => (
                        <GridItem
                            key={invoiceLine.id}
                            {...styles.lineItem}
                            data-test-selector={`invoiceDetails_invoiceLine_${invoiceLine.id}`}
                        >
                            <InvoiceDetailsLineCard invoiceLine={invoiceLine} extendedStyles={styles.lineStyles} />
                        </GridItem>
                    ))}
                </GridContainer>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: InvoiceDetailsSummaryTable,
    definition: {
        group: "Invoice History",
        displayName: "Summary Table",
        allowedContexts: [InvoiceDetailsPageContext],
    },
};

export default widgetModule;
