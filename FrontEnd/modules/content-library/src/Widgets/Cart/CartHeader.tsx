import Zone from "@insite/client-framework/Components/Zone";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { CartPageContext } from "@insite/content-library/Pages/CartPage";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import React, { FC } from "react";
import { css } from "styled-components";

interface OwnProps extends WidgetProps {}

type Props = OwnProps;

export interface CartHeaderStyles {
    container?: GridContainerProps;
    gridItem1?: GridItemProps;
    gridItem2?: GridItemProps;
    approverInfoGridItem?: GridItemProps;
}

export const cartHeaderStyles: CartHeaderStyles = {
    gridItem1: {
        width: [10, 10, 8, 9, 9],
    },
    gridItem2: {
        width: [2, 2, 4, 3, 3],
    },
    approverInfoGridItem: {
        width: 12,
        css: css`
            padding: 0 15px;
        `,
    },
};

const styles = cartHeaderStyles;

const CartHeader: FC<Props> = ({ id }) => {
    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.gridItem1}>
                <Zone contentId={id} zoneName="Content0" />
            </GridItem>
            <GridItem {...styles.gridItem2}>
                <Zone contentId={id} zoneName="Content1" />
            </GridItem>
            <GridItem {...styles.approverInfoGridItem}>
                <Zone contentId={id} zoneName="Content2" />
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: CartHeader,
    definition: {
        group: "Cart",
        displayName: "Page Header",
        allowedContexts: [CartPageContext],
    },
};

export default widgetModule;
