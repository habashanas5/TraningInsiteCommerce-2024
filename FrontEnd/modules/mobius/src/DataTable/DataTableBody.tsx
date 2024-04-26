import DataTableContext from "@insite/mobius/DataTable/DataTableContext";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import * as React from "react";
import styled, { css } from "styled-components";

export type DataTableBodyProps = MobiusStyledComponentProps<
    "tbody",
    {
        /** CSS string or styled-components function to be injected into this component. */
        css?: StyledProp<DataTableBodyProps>;
    }
>;

const DataTableBodyStyle = styled.tbody`
    ${injectCss}
`;

const DataTableBody: React.FC<DataTableBodyProps> = ({ css: bodyCss = "", ...otherProps }) => (
    <DataTableContext.Consumer>
        {({ _cssOverrides }) => (
            <DataTableBodyStyle
                {...otherProps}
                css={css`
                    ${_cssOverrides.body || ""}
                    ${bodyCss}
                `}
            />
        )}
    </DataTableContext.Consumer>
);

export default DataTableBody;
