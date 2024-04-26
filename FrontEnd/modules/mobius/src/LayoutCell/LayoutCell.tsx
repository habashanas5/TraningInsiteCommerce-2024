import LayoutGroupContext from "@insite/mobius/LayoutGroup/LayoutGroupContext";
import LayoutTableContext, { LayoutTableContextData } from "@insite/mobius/LayoutTable/LayoutTableContext";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import * as React from "react";
import styled from "styled-components";

export type LayoutCellProps = MobiusStyledComponentProps<
    "div",
    LayoutTableContextData & {
        /** CSS string or styled-components function to be injected into this component. */
        css?: StyledProp<LayoutCellProps>;
        /** Order of appearance of this LayoutCell within its parent LayoutGroup. */
        index: number;
    }
>;

const LayoutCellStyle = styled.div<{
    cellFlow: LayoutTableContextData["cellFlow"];
    cellIndex: number;
    groupIndex: number;
}>`
    ${({ cellFlow, cellIndex, groupIndex }) => {
        const row = (cellFlow === "row" ? groupIndex : cellIndex) + 1;
        const column = (cellFlow === "row" ? cellIndex : groupIndex) + 1;
        return `
            -ms-grid-row: ${row};
            -ms-grid-column: ${column};
        `;
    }}
    ${injectCss}
`;

/**
 * LayoutTable equivalent to a `<td>` in an HTML table.
 */
const LayoutCell: React.FC<LayoutCellProps> = ({ index, children, css, ...otherProps }) => (
    <LayoutTableContext.Consumer>
        {({ cellFlow, gap }) => (
            <LayoutGroupContext.Consumer>
                {({ groupIndex }) => (
                    <LayoutCellStyle cellIndex={index} css={css} {...{ cellFlow, gap, groupIndex }} {...otherProps}>
                        <div>{children}</div>
                    </LayoutCellStyle>
                )}
            </LayoutGroupContext.Consumer>
        )}
    </LayoutTableContext.Consumer>
);

/** @component */
export default LayoutCell;

export { LayoutCellStyle };
