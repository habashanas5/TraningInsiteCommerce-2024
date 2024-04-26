import GridContext from "@insite/mobius/GridContainer/GridContext";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import gridWidth from "@insite/mobius/utilities/gridWidth";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import * as React from "react";
import styled, { css } from "styled-components";

export type GridWidths = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export type GridItemProps = MobiusStyledComponentProps<
    "div",
    {
        /** The vertical alignment of the contents inside the GridItem */
        align?: keyof typeof alignments;
        /** CSS string or styled-components function to be injected into this component. */
        css?: StyledProp<GridItemProps>;
        /**
         * The number of columns to span, or an array with column widths for each breakpoint defined in the theme.
         * If the width is set to `0`, the GridItem css will be `display: none;` for that size.
         */
        width?: GridWidths | GridWidths[];
        /** @ignore */
        printWidth?: GridWidths;
    }
>;

const alignments = {
    top: "flex-start",
    middle: "center",
    bottom: "flex-end",
} as const;

const gridItemWidthStyle = (x: GridWidths) => {
    if (x === 0) {
        return css`
            display: none;
        `;
    }
    return css`
        overflow-wrap: break-word;
        word-wrap: break-word;
        -ms-word-break: break-all;
        word-break: break-all;
        word-break: break-word;
        flex-basis: ${gridWidth(x)};
        max-width: ${gridWidth(x)};
    `;
};

const GridItemStyle = styled.div<GridItemProps & { gap: number; _width: GridItemProps["width"] }>`
    overflow: visible;
    display: flex;
    flex-direction: row;
    padding: ${({ gap }) => gap / 2}px;
    align-items: ${({ align }) => alignments[align ?? "top"]};
    ${({ _width, theme }) => {
        if (Array.isArray(_width)) {
            const rules = _width.map(gridItemWidthStyle);
            return breakpointMediaQueries(theme, rules);
        }
        return gridItemWidthStyle(_width as GridWidths);
    }}
    ${({ _width, printWidth }) => {
        let w;
        if (printWidth) {
            w = printWidth;
        } else if (Array.isArray(_width)) {
            w = _width[_width.length - 1];
        } else {
            w = _width;
        }
        return w && w > 0
            ? css`
                  @media print {
                      width: ${gridWidth(w)};
                  }
              `
            : "";
    }}
    ${injectCss}
`;

/**
 * GridItem is used to allocate space for content inside a 12-column grid set up by GridContainer.
 */
const GridItem: React.FC<GridItemProps> = ({ css, width, ...otherProps }) => (
    <GridContext.Consumer>
        {({ gap }) => <GridItemStyle _width={width ?? 1} gap={gap} css={css} {...otherProps} />}
    </GridContext.Consumer>
);

GridItem.defaultProps = {
    align: "top",
    width: 1,
};

/** @component */
export default GridItem;

export { GridItemStyle };
