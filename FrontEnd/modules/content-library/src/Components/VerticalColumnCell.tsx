/* eslint-disable spire/export-styles */
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import React from "react";
import styled, { ThemeProps } from "styled-components";

export interface VerticalColumnCellProps extends React.HTMLAttributes<HTMLDivElement> {
    css?: StyledProp<VerticalColumnCellProps & ThemeProps<BaseTheme>>;
}

const Cell = styled.div<VerticalColumnCellProps>`
    ${injectCss}
`;

const VerticalColumnCell: React.FunctionComponent<VerticalColumnCellProps> = ({ css, ...otherProps }) => {
    return <Cell css={css} {...otherProps} />;
};

export default VerticalColumnCell;
