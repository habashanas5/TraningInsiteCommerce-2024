import DataTableContext from "@insite/mobius/DataTable/DataTableContext";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import * as React from "react";
import styled, { css } from "styled-components";

export type DataTableHeadProps = MobiusStyledComponentProps<
    "tr",
    {
        /** CSS string or styled-components function to be injected into this component. */
        css?: StyledProp<DataTableHeadProps>;
    }
>;

const DataTableHeadStyle = styled.tr`
    ${injectCss}
`;

const DataTableHead: React.FC<DataTableHeadProps> = ({ css: headCss = "", ...otherProps }) => (
    <DataTableContext.Consumer>
        {({ _cssOverrides }) => (
            <thead>
                <DataTableHeadStyle
                    css={css`
                        ${_cssOverrides.head || ""}
                        ${headCss}
                    `}
                    {...otherProps}
                />
            </thead>
        )}
    </DataTableContext.Consumer>
);

export default DataTableHead;
