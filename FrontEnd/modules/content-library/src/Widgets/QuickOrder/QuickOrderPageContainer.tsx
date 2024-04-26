import Zone from "@insite/client-framework/Components/Zone";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { QuickOrderPageContext } from "@insite/content-library/Pages/QuickOrderPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import Hidden, { HiddenProps } from "@insite/mobius/Hidden";
import * as React from "react";
import { css } from "styled-components";

export interface QuickOrderPageContainerStyles {
    container?: GridContainerProps;
    firstGridItem?: GridItemProps;
    innerContainer?: GridContainerProps;
    leftColumnGridItem?: GridItemProps;
    rightColumnGridItem?: GridItemProps;
    rightColumnGridItemHidden?: HiddenProps;
    secondGridItem?: GridItemProps;
    thirdGridItem?: GridItemProps;
    thirdGridItemHidden?: HiddenProps;
    bottomGridItem?: GridItemProps;
}

export const quickOrderPageContainerStyles: QuickOrderPageContainerStyles = {
    firstGridItem: { width: 12 },
    leftColumnGridItem: { width: [12, 12, 6, 4, 4] },
    rightColumnGridItem: { width: [0, 0, 6, 8, 8] },
    rightColumnGridItemHidden: {
        below: "md",
        css: css`
            width: 100%;
        `,
    },
    secondGridItem: { width: 12 },
    thirdGridItem: { width: [12, 12, 0, 0, 0] },
    thirdGridItemHidden: {
        above: "sm",
        css: css`
            width: 100%;
        `,
    },
    bottomGridItem: { width: 12 },
};

/**
 * @deprecated Use quickOrderPageContainerStyles instead.
 */
export const viewStyles = quickOrderPageContainerStyles;
const styles = quickOrderPageContainerStyles;

const QuickOrderPageContainer: React.FC<WidgetProps> = props => {
    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.firstGridItem}>
                <GridContainer {...styles.innerContainer}>
                    <GridItem {...styles.leftColumnGridItem}>
                        <Zone contentId={props.id} zoneName="Content0" />
                    </GridItem>
                    <GridItem {...styles.rightColumnGridItem}>
                        <Hidden {...styles.rightColumnGridItemHidden}>
                            <Zone contentId={props.id} zoneName="Content1" />
                        </Hidden>
                    </GridItem>
                </GridContainer>
            </GridItem>
            <GridItem {...styles.secondGridItem}>
                <Zone contentId={props.id} zoneName="Content2" />
            </GridItem>
            <GridItem {...styles.thirdGridItem}>
                <Hidden {...styles.thirdGridItemHidden}>
                    <Zone contentId={props.id} zoneName="Content3" />
                </Hidden>
            </GridItem>
            <GridItem {...styles.bottomGridItem}>
                <Zone contentId={props.id} zoneName="Content4" />
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: QuickOrderPageContainer,
    definition: {
        displayName: "Page Container",
        group: "Quick Order",
        allowedContexts: [QuickOrderPageContext],
    },
};

export default widgetModule;
