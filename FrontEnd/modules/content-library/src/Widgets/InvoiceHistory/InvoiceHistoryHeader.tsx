import Zone from "@insite/client-framework/Components/Zone";
import { InvoicesDataViewContext } from "@insite/client-framework/Store/Data/Invoices/InvoicesSelectors";
import toggleFiltersOpen from "@insite/client-framework/Store/Pages/InvoiceHistory/Handlers/ToggleFiltersOpen";
import translate from "@insite/client-framework/Translate";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { InvoiceHistoryPageContext } from "@insite/content-library/Pages/InvoiceHistoryPage";
import Clickable from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Icon, { IconProps } from "@insite/mobius/Icon";
import Filter from "@insite/mobius/Icons/Filter";
import Typography, { TypographyProps } from "@insite/mobius/Typography";
import * as React from "react";
import { useContext } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

const mapDispatchToProps = {
    toggleFiltersOpen,
};

type Props = WidgetProps & ResolveThunks<typeof mapDispatchToProps>;

export interface InvoiceHistoryHeaderStyles {
    container?: GridContainerProps;
    heading?: TypographyProps;
    invoiceCountGridItem?: GridItemProps;
    emptyGridItem?: GridItemProps;
    toggleFilterGridItem?: GridItemProps;
    toggleFilterIcon?: IconProps;
}

export const headerStyles: InvoiceHistoryHeaderStyles = {
    container: {
        gap: 8,
        css: css`
            padding-bottom: 10px;
        `,
    },
    heading: { variant: "h2", as: "h1" },
    invoiceCountGridItem: {
        width: 11,
        style: { marginTop: "8px", fontWeight: 600 },
    },
    toggleFilterGridItem: {
        width: 1,
        style: { marginTop: "8px", justifyContent: "flex-end" },
    },
    toggleFilterIcon: { size: 24 },
};

const styles = headerStyles;

const InvoiceHistoryHeader = (props: Props) => {
    const invoicesDataView = useContext(InvoicesDataViewContext);
    const invoicesCount =
        invoicesDataView.value && invoicesDataView.pagination ? invoicesDataView.pagination.totalItemCount : 0;

    return (
        <>
            <Typography {...styles.heading}>{translate("Invoice History")}</Typography>
            <Zone contentId={props.id} zoneName="Content00" />
            <GridContainer {...styles.container}>
                <GridItem {...styles.invoiceCountGridItem} data-test-selector="invoiceHistory_invoiceTotal">
                    {invoicesCount} {translate("Invoices")}
                </GridItem>
                <GridItem {...styles.toggleFilterGridItem}>
                    <Clickable onClick={props.toggleFiltersOpen} data-test-selector="invoiceHistory_toggleFilter">
                        <Icon src={Filter} {...styles.toggleFilterIcon} />
                    </Clickable>
                </GridItem>
            </GridContainer>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(InvoiceHistoryHeader),
    definition: {
        group: "Invoice History",
        displayName: "Page Header",
        allowedContexts: [InvoiceHistoryPageContext],
    },
};

export default widgetModule;
