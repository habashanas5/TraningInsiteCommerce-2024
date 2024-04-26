import baseTheme, { BaseTheme } from "@insite/mobius/globals/baseTheme";
import GridContext from "@insite/mobius/GridContainer/GridContext";
import { GridItemStyle } from "@insite/mobius/GridItem/GridItem";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import * as React from "react";
import styled, { css } from "styled-components";

export type GridContainerProps = MobiusStyledComponentProps<
    "div",
    {
        /** CSS string or styled-components function to be injected into this component. */
        css?: StyledProp<GridContainerProps>;
        /** The amount of space between grid items, in pixels. */
        gap?: number;
        /** Props to be passed to grid offset. */
        offsetProps?: MobiusStyledComponentProps<"div">;
        /** CSS string or styled-components function to be injected into this component. */
        offsetCss?: StyledProp<GridContainerProps>;
    }
>;

const GridOffset = styled.div<{ gap: number }>`
    margin: ${({ gap }) => -gap / 2}px;
    ${injectCss}
`;

const GridWrapper = styled.div<GridContainerProps>`
    flex-grow: 1;
    width: 100%;
    ${({ theme }: { theme: BaseTheme }) => {
        const { maxWidths } = theme.breakpoints || baseTheme.breakpoints;
        return breakpointMediaQueries(
            theme,
            maxWidths.map(mw =>
                mw
                    ? css`
                          max-width: ${mw}px;
                      `
                    : null,
            ),
        );
    }}

    @media print {
        max-width: 100%;
    }
    ${GridOffset} {
        display: flex;
        flex-wrap: wrap;
        width: ${({ gap }) => ((gap as number) > 0 ? `calc(100% + ${gap}px)` : "100%")};

        @media print {
            display: block;
        }
    }
    ${GridItemStyle} {
        box-sizing: border-box;
        margin: 0;
        flex-grow: 0;
        flex-shrink: 1;

        @media print {
            display: inline-block;
            margin-right: -0.22rem;
            vertical-align: top;
        }
    }
    ${injectCss}
`;

/**
 * GridContainer provides a 12-column grid scaffolding for GridItem components.
 */
const GridContainer: React.FC<GridContainerProps> = ({ children, css, offsetCss, offsetProps, ...otherProps }) => {
    if (!React.Children.count(children)) {
        return null;
    }
    return (
        <GridWrapper css={css} {...otherProps} gap={otherProps.gap ?? 30}>
            <GridContext.Provider value={{ gap: otherProps.gap ?? 30 }}>
                <GridOffset {...offsetProps} css={offsetCss} gap={otherProps.gap ?? 30}>
                    {children}
                </GridOffset>
            </GridContext.Provider>
        </GridWrapper>
    );
};

GridContainer.defaultProps = {
    gap: 30,
};

/** @component */
export default GridContainer;

export { GridOffset, GridWrapper };
