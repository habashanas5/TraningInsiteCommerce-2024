/* eslint-disable spire/export-styles */
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import breakpointMediaQueries from "@insite/mobius/utilities/breakpointMediaQueries";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import React from "react";
import styled, { css, ThemeProps } from "styled-components";

export interface VerticalColumnContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    css?: StyledProp<VerticalColumnContainerProps & ThemeProps<BaseTheme>>;
    /**
     * Controls the column counts at different media query sizes.
     * @default [1]
     */
    columnCounts?: number[];
}

const Container = styled.div<VerticalColumnContainerProps>`
    ${({ columnCounts, theme }) => {
        const rules = (columnCounts ?? [1]).map(containerStyle);
        return breakpointMediaQueries(theme, rules);
    }}
    ${injectCss}
`;
const containerStyle = (x: number) => css`
    column-count: ${x};
`;

const VerticalColumnContainer: React.FunctionComponent<VerticalColumnContainerProps> = ({ css, ...otherProps }) => {
    return <Container css={css} {...otherProps} />;
};

export default VerticalColumnContainer;
