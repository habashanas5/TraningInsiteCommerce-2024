import { LayoutCellStyle } from "@insite/mobius/LayoutCell/LayoutCell";
import LayoutTableContext, { LayoutTableContextData } from "@insite/mobius/LayoutTable/LayoutTableContext";
import getProp from "@insite/mobius/utilities/getProp";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import * as React from "react";
import styled, { css } from "styled-components";

export type LayoutTableProps = MobiusStyledComponentProps<
    "div",
    LayoutTableContextData & {
        children?: React.ReactNode;
        /** CSS string or styled-components function to be injected into this component. */
        css?: StyledProp<LayoutTableProps>;
    }
>;

const margins = {
    column: ["left", "right", "top", "bottom"],
    row: ["top", "bottom", "left", "right"],
};

const LayoutTableStyle = styled.div<LayoutTableProps>`
    display: grid;
    grid-auto-flow: ${getProp("cellFlow")};
    ${({ cellFlow = "row", cellsPerGroup = 1, gap = 2, numberOfGroups = 1 }) => {
        const rowRepeat = cellFlow === "row" ? numberOfGroups : cellsPerGroup;
        const columnRepeat = cellFlow === "row" ? cellsPerGroup : numberOfGroups;
        const halfGap = `${gap / 2}px`;
        const allButFirstCellOfEachGroup = css`
            ${LayoutCellStyle}:not(:nth-child(${cellsPerGroup}n + 1)) > div {
                margin-${margins[cellFlow][2]}: ${halfGap};
            }
        `;
        const allButLastCellOfEachGroup = css`
            ${LayoutCellStyle}:not(:nth-child(${cellsPerGroup}n)) > div {
                margin-${margins[cellFlow][3]}: ${halfGap};
            }
        `;
        const allButFirstGroup = css`
            ${LayoutCellStyle}:nth-child(n + ${cellsPerGroup + 1}) > div {
                margin-${margins[cellFlow][0]}: ${halfGap};
            }
        `;
        const allButLastGroup = css`
            ${LayoutCellStyle}:not(:nth-child(n + ${1 + (numberOfGroups - 1) * cellsPerGroup})) > div {
                margin-${margins[cellFlow][1]}: ${halfGap};
            }
        `;
        const width = `${100 / columnRepeat}%`;
        const edgeColumnWidth = `calc(${width} - ${gap / 2 - gap / columnRepeat}px)`;
        const middleColumns =
            columnRepeat > 2 ? `repeat(${columnRepeat - 2}, calc(${width} + ${gap / columnRepeat}px))` : "";

        return css`
            grid-template-rows: repeat(${rowRepeat}, max-content);
            grid-template-columns: ${edgeColumnWidth} ${middleColumns} ${edgeColumnWidth};
            -ms-grid-rows: (max-content) [ ${rowRepeat}];
            -ms-grid-columns: (1fr) [ ${columnRepeat}];
            ${allButFirstCellOfEachGroup}
            ${allButLastCellOfEachGroup}
            ${allButFirstGroup}
            ${allButLastGroup}
        `;
    }}
    ${injectCss}
`;

/**
 * Useful for layouts that require table-like responsiveness while maintaining semantic markup order (for accessibility) and cross-browser compatibility.
 */
const LayoutTable: React.FC<LayoutTableProps> = ({
    cellFlow,
    cellsPerGroup,
    children,
    css: cssProp,
    gap,
    numberOfGroups,
    ...otherProps
}) => (
    <LayoutTableContext.Provider
        value={{
            cellFlow,
            cellsPerGroup,
            gap,
            numberOfGroups,
        }}
    >
        <LayoutTableStyle
            css={cssProp}
            {...{
                cellFlow,
                cellsPerGroup,
                gap,
                numberOfGroups,
            }}
            {...otherProps}
        >
            {children}
        </LayoutTableStyle>
    </LayoutTableContext.Provider>
);

LayoutTable.defaultProps = {
    cellFlow: "row",
    gap: 0, // calculations would fail if gap is undefined
};

/** @component */
export default LayoutTable;

export { LayoutTableStyle };
