import Zone from "@insite/client-framework/Components/Zone";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { MyListsPageContext } from "@insite/content-library/Pages/MyListsPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import * as React from "react";
import { css } from "styled-components";

export interface MyListsHeaderStyles {
    container?: GridContainerProps;
    leftTopGridItem?: GridItemProps;
    rightTopGridItem?: GridItemProps;
    leftBottomGridItem?: GridItemProps;
    rightBottomGridItem?: GridItemProps;
}

export const headerStyles: MyListsHeaderStyles = {
    container: {
        gap: 10,
        css: css`
            padding-bottom: 20px;
        `,
    },
    leftTopGridItem: {
        width: [10, 10, 6, 6, 6],
    },
    rightTopGridItem: {
        width: [2, 2, 6, 6, 6],
    },
    leftBottomGridItem: {
        width: [12, 6, 6, 6, 6],
    },
    rightBottomGridItem: {
        width: [12, 6, 6, 6, 6],
    },
};

const styles = headerStyles;

const MyListsHeader: React.FC<WidgetProps> = props => {
    return (
        <>
            <GridContainer {...styles.container}>
                <GridItem {...styles.leftTopGridItem}>
                    <Zone contentId={props.id} zoneName="Content00" />
                </GridItem>
                <GridItem {...styles.rightTopGridItem}>
                    <Zone contentId={props.id} zoneName="Content01" />
                </GridItem>
                <GridItem {...styles.leftBottomGridItem}>
                    <Zone contentId={props.id} zoneName="Content10" />
                </GridItem>
                <GridItem {...styles.rightBottomGridItem}>
                    <Zone contentId={props.id} zoneName="Content11" />
                </GridItem>
            </GridContainer>
        </>
    );
};

const widgetModule: WidgetModule = {
    component: MyListsHeader,
    definition: {
        group: "My Lists",
        displayName: "Header",
        allowedContexts: [MyListsPageContext],
    },
};

export default widgetModule;
