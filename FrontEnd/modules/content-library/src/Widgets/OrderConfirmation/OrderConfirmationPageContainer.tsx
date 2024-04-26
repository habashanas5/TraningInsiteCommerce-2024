import Zone from "@insite/client-framework/Components/Zone";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { OrderConfirmationPageContext } from "@insite/content-library/Pages/OrderConfirmationPage";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContainer, { GridContainerProps } from "@insite/mobius/GridContainer";
import GridItem, { GridItemProps } from "@insite/mobius/GridItem";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import React from "react";
import { css } from "styled-components";

export interface OrderConfirmationPageContainerStyles {
    container?: GridContainerProps;
    headerGridItem?: GridItemProps;
    accountSignUpGridItem?: GridItemProps;
    orderInformationGridItem?: GridItemProps;
    orderTotalGridItem?: GridItemProps;
    productListGridItem?: GridItemProps;
}

export const orderConfirmationPageContainerStyles: OrderConfirmationPageContainerStyles = {
    headerGridItem: {
        css: css`
            order: 1;
        `,
        width: 12,
    },
    accountSignUpGridItem: {
        css: css`
            order: 2;
        `,
        width: 12,
    },
    orderInformationGridItem: {
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        order: 3;
                    `,
                    css`
                        order: 3;
                    `,
                    css`
                        order: 2;
                    `,
                    css`
                        order: 2;
                    `,
                    css`
                        order: 2;
                    `,
                ])}
        `,
        width: [12, 12, 6, 8, 8],
    },
    orderTotalGridItem: {
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(theme, [
                    css`
                        order: 2;
                    `,
                    css`
                        order: 2;
                    `,
                    css`
                        order: 3;
                    `,
                    css`
                        order: 3;
                    `,
                    css`
                        order: 3;
                    `,
                ])}
        `,
        width: [12, 12, 6, 4, 4],
    },
    productListGridItem: {
        css: css`
            order: 4;
        `,
        width: [12, 12, 12, 8, 8],
    },
};

const styles = orderConfirmationPageContainerStyles;

const OrderConfirmationPageContainer = ({ id }: WidgetProps) => {
    return (
        <GridContainer {...styles.container}>
            <GridItem {...styles.headerGridItem}>
                <Zone zoneName="Content00" contentId={id} />
            </GridItem>
            <GridItem {...styles.accountSignUpGridItem}>
                <Zone zoneName="Content04" contentId={id} />
            </GridItem>
            <GridItem {...styles.orderInformationGridItem}>
                <Zone zoneName="Content01" contentId={id} />
            </GridItem>
            <GridItem {...styles.orderTotalGridItem}>
                <Zone zoneName="Content02" contentId={id} />
            </GridItem>
            <GridItem {...styles.productListGridItem}>
                <Zone zoneName="Content03" contentId={id} />
            </GridItem>
        </GridContainer>
    );
};

const widgetModule: WidgetModule = {
    component: OrderConfirmationPageContainer,
    definition: {
        displayName: "Page Container",
        group: "Order Confirmation",
        allowedContexts: [OrderConfirmationPageContext],
    },
};
export default widgetModule;
