/* eslint-disable spire/export-styles */
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import InjectableCss from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import styled, { css } from "styled-components";

export type FlexItemProps = {
    /**
     * The columns that should span across the a row, or an array with column spans for each breakpoint defined in the theme.
     * If the column is set to `0`, the FlexItem css will be `display: none;` for that size.
     */
    flexColumns?: number | number[];
} & InjectableCss;

const getWidthStyle = (x: number) => {
    if (x === 0) {
        return css`
            display: none;
        `;
    }
    return css`
        flex-basis: ${getColumnWidth(x)};
        max-width: ${getColumnWidth(x)};
    `;
};

/**
 * Gives the width, in percent, of a column based on the FlexColumns passed in.
 * @param {*} flexColumns The expected columns the row will be split into.
 */
function getColumnWidth(flexColumns: number) {
    return `${Math.round(1e8 / flexColumns) / 1e6}%`;
}

/**
 * FlexItem is used to easily allocate the space for content inside a column, based on a flexColumns the size of column/cell will be calculated. Wrapped, preferably by the FlexWrapContainer, any display:flex wrapper.
 */
const FlexItem = styled.div<FlexItemProps>`
    overflow: visible;
    display: flex;
    flex-direction: row;
    ${({ flexColumns, theme }) => {
        if (Array.isArray(flexColumns)) {
            const rules = flexColumns.map(getWidthStyle);
            return breakpointMediaQueries(theme, rules);
        }
        return getWidthStyle(flexColumns || 0);
    }}
    ${injectCss}
`;

/** @component */
export default FlexItem;
