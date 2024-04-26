import { DataTableHeaderProps } from "@insite/mobius/DataTable/DataTableHeader";
import getColor from "@insite/mobius/utilities/getColor";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import styled from "styled-components";

export type DataTableCellBaseProps = MobiusStyledComponentProps<
    "td",
    {
        /** How the content should align within the cell. */
        alignX?: "left" | "center" | "right";
        /** CSS string or styled-components function to be injected into this component. */
        css?: StyledProp<DataTableCellBaseProps>;
        /** Sets the cell/column width to be as narrow as possible. */
        tight?: boolean;
    }
>;

const DataTableCellBase = styled.td<DataTableHeaderProps>`
    box-sizing: border-box;
    height: 50px;
    padding: 0 12px;
    border-bottom: 1px solid ${getColor("common.border")};
    white-space: nowrap;
    ${({ tight }) => tight && "width: 1px;"}
    ${({ alignX }) => alignX && `text-align: ${alignX};`};
    ${injectCss}
`;

DataTableCellBase.defaultProps = {
    alignX: "left",
};

export default DataTableCellBase;
