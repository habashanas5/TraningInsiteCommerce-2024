import StyledWrapper from "@insite/client-framework/Common/StyledWrapper";
import Zone from "@insite/client-framework/Components/Zone";
import WidgetModule from "@insite/client-framework/Types/WidgetModule";
import WidgetProps from "@insite/client-framework/Types/WidgetProps";
import { CartPageContext } from "@insite/content-library/Pages/CartPage";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import React from "react";
import { css } from "styled-components";

export interface CartPageContainerStyles {
    container?: InjectableCss;
    headerContainer?: InjectableCss;
    cartLinesContainer?: InjectableCss;
    fulfillmentMethodContainer?: InjectableCss;
    cartTotalContainer?: InjectableCss;
    productCarouselContainer?: InjectableCss;
}

export const cartPageContainerStyles: CartPageContainerStyles = {
    container: {
        css: css`
            /* stylelint-disable value-no-vendor-prefix */
            display: -ms-grid;
            display: grid;
            padding: 1.5rem 0 0 1.5rem;
            margin: -1.5rem;
            overflow: hidden;
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            grid-template-columns: minmax(0, 1fr);
                            -ms-grid-columns: minmax(0, 1fr);
                        `,
                        null,
                        css`
                            grid-template-columns: repeat(2, minmax(0, 1fr));
                            -ms-grid-columns: minmax(0, 1fr) minmax(0, 1fr);
                            grid-template-rows: repeat(5, auto);
                            -ms-grid-rows: auto auto auto auto auto;
                        `,
                        css`
                            grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
                            -ms-grid-columns: minmax(0, 2fr) minmax(0, 1fr);
                        `,
                    ],
                    "min",
                )}
        `,
    },
    headerContainer: {
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            border: 0 solid transparent;
                            border-width: 0 1.5rem 1.5rem 0;
                        `,
                        null,
                        css`
                            grid-column-start: 1;
                            -ms-grid-column: 1;
                            grid-column-end: 3;
                            -ms-grid-column-span: 3;
                            grid-row-start: 1;
                            -ms-grid-row: 1;
                        `,
                    ],
                    "min",
                )}
        `,
    },
    cartLinesContainer: {
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            border: 0 solid transparent;
                            border-width: 0 1.5rem 1.5rem 0;
                        `,
                        null,
                        css`
                            grid-column-start: 1;
                            -ms-grid-column: 1;
                            grid-row-start: 2;
                            -ms-grid-row: 2;
                            grid-row-end: 6;
                            -ms-grid-row-span: 6;
                        `,
                    ],
                    "min",
                )}
        `,
    },
    fulfillmentMethodContainer: {
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            border: 0 solid transparent;
                            border-width: 0 1.5rem 1.5rem 0;
                        `,
                        null,
                        css`
                            grid-column-start: 2;
                            -ms-grid-column: 2;
                            grid-row-start: 2;
                            -ms-grid-row: 2;
                        `,
                    ],
                    "min",
                )}
        `,
    },
    cartTotalContainer: {
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            border: 0 solid transparent;
                            border-width: 0 1.5rem 1.5rem 0;
                        `,
                        null,
                        css`
                            grid-column-start: 2;
                            -ms-grid-column: 2;
                            grid-row-start: 3;
                            -ms-grid-row: 3;
                        `,
                    ],
                    "min",
                )}
        `,
    },
    productCarouselContainer: {
        css: css`
            ${({ theme }: { theme: BaseTheme }) =>
                breakpointMediaQueries(
                    theme,
                    [
                        css`
                            border: 0 solid transparent;
                            border-width: 0 1.5rem 1.5rem 0;
                        `,
                        null,
                        css`
                            grid-column-start: 2;
                            -ms-grid-column: 2;
                            grid-row-start: 4;
                            -ms-grid-row: 4;
                        `,
                    ],
                    "min",
                )}
        `,
    },
};

const styles = cartPageContainerStyles;

const CartPageContainer = ({ id }: WidgetProps) => {
    return (
        <StyledWrapper {...styles.container}>
            <StyledWrapper {...styles.headerContainer}>
                <Zone zoneName="Content0" contentId={id} />
            </StyledWrapper>
            <StyledWrapper {...styles.cartLinesContainer}>
                <Zone zoneName="Content2" contentId={id} />
            </StyledWrapper>
            <StyledWrapper {...styles.fulfillmentMethodContainer}>
                <Zone zoneName="Content3" contentId={id} />
            </StyledWrapper>
            <StyledWrapper {...styles.cartTotalContainer}>
                <Zone zoneName="Content1" contentId={id} />
            </StyledWrapper>
            <StyledWrapper {...styles.productCarouselContainer}>
                <Zone zoneName="Content4" contentId={id} />
            </StyledWrapper>
        </StyledWrapper>
    );
};

const widgetModule: WidgetModule = {
    component: CartPageContainer,
    definition: {
        group: "Cart",
        allowedContexts: [CartPageContext],
        displayName: "Page Container",
    },
};

export default widgetModule;
