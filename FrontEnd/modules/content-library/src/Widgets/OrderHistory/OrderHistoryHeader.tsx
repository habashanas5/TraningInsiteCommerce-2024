import Zone from "@insite/client-framework/Components/Zone";
import toggleFiltersOpen from "@insite/client-framework/Store/Pages/OrderHistory/Handlers/ToggleFiltersOpen";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { OrderHistoryPageContext } from "@insite/content-library/Pages/OrderHistoryPage";
import Clickable, { ClickablePresentationProps } from "@insite/mobius/Clickable";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import Filter from "@insite/mobius/Icons/Filter";
import React, { FC } from "react";
import { connect, ResolveThunks } from "react-redux";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {}

const mapDispatchToProps = {
    toggleFiltersOpen,
};

type Props = ResolveThunks<typeof mapDispatchToProps> & OwnProps;

export interface OrderHistoryHeaderStyles {
    container?: GridContainerProps;
    invoiceCountGridItem?: GridItemProps;
    emptyGridItem?: GridItemProps;
    toggleFilterGridItem?: GridItemProps;
    toggleFilterIcon?: IconPresentationProps;
    toggleFilterClickable?: ClickablePresentationProps;
}

export const headerStyles: OrderHistoryHeaderStyles = {
    container: {
        gap: 8,
        css: css`
            padding-bottom: 20px;
        `,
    },
    invoiceCountGridItem: {
        width: 11,
        style: { fontWeight: 600 },
    },
    toggleFilterGridItem: {
        width: 1,
        style: { justifyContent: "flex-end" },
    },
    toggleFilterIcon: {
        src: Filter,
        size: 24,
    },
};
const styles = headerStyles;

const OrderHistoryHeader: FC<Props> = ({ toggleFiltersOpen, id }) => {
    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.invoiceCountGridItem}>
                <Zone contentId={id} zoneName="Content" />
            </GridItem>
            <GridItem {...styles.toggleFilterGridItem}>
                <Clickable
                    {...styles.toggleFilterClickable}
                    onClick={toggleFiltersOpen}
                    data-test-selector="orderHistory_showHideFilters"
                >
                    <Icon {...styles.toggleFilterIcon} />
                </Clickable>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(OrderHistoryHeader),
    definition: {
        group: "Order History",
        displayName: "Header",
        allowedContexts: [OrderHistoryPageContext],
    },
};

export default widgetModule;
