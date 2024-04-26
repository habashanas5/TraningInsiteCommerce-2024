import Zone from "@insite/client-framework/Components/Zone";
import toggleFiltersOpen from "@insite/client-framework/Store/Pages/SavedOrderList/Handlers/ToggleFiltersOpen";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { SavedOrderListPageContext } from "@insite/content-library/Pages/SavedOrderListPage";
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

export interface SavedOrderListHeaderStyles {
    container?: GridContainerProps;
    titleGridItem?: GridItemProps;
    emptyGridItem?: GridItemProps;
    toggleFilterGridItem?: GridItemProps;
    toggleFilterIcon?: IconPresentationProps;
    toggleFilterClickable?: ClickablePresentationProps;
}

export const savedOrderListHeaderStyles: SavedOrderListHeaderStyles = {
    container: {
        gap: 8,
        css: css`
            padding-bottom: 20px;
        `,
    },
    titleGridItem: {
        width: 11,
        style: { fontWeight: 600 },
    },
    toggleFilterGridItem: {
        width: 1,
        style: {
            justifyContent: "flex-end",
            alignSelf: "flex-end",
        },
    },
    toggleFilterIcon: {
        src: "Filter",
        size: 24,
    },
};
const styles = savedOrderListHeaderStyles;

const SavedOrderListHeader: FC<Props> = ({ toggleFiltersOpen, id }) => {
    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.titleGridItem}>
                <Zone contentId={id} zoneName="Content" />
            </GridItem>
            <GridItem {...styles.toggleFilterGridItem}>
                <Clickable
                    {...styles.toggleFilterClickable}
                    onClick={toggleFiltersOpen}
                    data-test-selector="savedOrderList_showHideFilters"
                >
                    <Icon {...styles.toggleFilterIcon} />
                </Clickable>
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: connect(null, mapDispatchToProps)(SavedOrderListHeader),
    definition: {
        group: "Saved Order List",
        displayName: "Header",
        allowedContexts: [SavedOrderListPageContext],
    },
};

export default widgetModule;
