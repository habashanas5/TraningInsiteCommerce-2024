import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { breakpointMediaQueries } from "@insite/mobius/utilities";
import { css } from "styled-components";

export function responsiveFontSize(
    theme: BaseTheme,
    tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p",
    overrideSize?: number,
    responsive?: boolean,
) {
    const convertPixelsOrNumberToNumber = (val?: string | number) => {
        if (typeof val === "number") {
            return val;
        }

        if (typeof val === "string") {
            return parseFloat(val.replace("px", ""));
        }

        return undefined;
    };

    const size = overrideSize || convertPixelsOrNumberToNumber(theme.typography[tag].size);
    const minimumSize = convertPixelsOrNumberToNumber(theme.typography["body"].size);

    if (size === undefined || minimumSize === undefined) {
        return null;
    }

    if (!responsive) {
        return css`
            font-size: ${size}px;
        `;
    }

    const fontReductionFactors = [0.6, 0.7, 0.8, 0.9, 1];
    return breakpointMediaQueries(
        theme,
        fontReductionFactors.map(
            factor =>
                css`
                    font-size: ${Math.max(size * factor, minimumSize)}px;
                `,
        ),
    );
}

export interface FontSizeFields {
    h1FontSize?: number;
    h2FontSize?: number;
    h3FontSize?: number;
    h4FontSize?: number;
    h5FontSize?: number;
    h6FontSize?: number;
    normalFontSize?: number;
}

export const responsiveStyleRules = (responsive: boolean, fields?: FontSizeFields) => css`
    h1 {
        ${({ theme }) => {
            return responsiveFontSize(theme, "h1", fields?.h1FontSize, responsive);
        }}
    }
    h2 {
        ${({ theme }) => {
            return responsiveFontSize(theme, "h2", fields?.h2FontSize, responsive);
        }}
    }
    h3 {
        ${({ theme }) => {
            return responsiveFontSize(theme, "h3", fields?.h3FontSize, responsive);
        }}
    }
    h4 {
        ${({ theme }) => {
            return responsiveFontSize(theme, "h4", fields?.h4FontSize, responsive);
        }}
    }
    h5 {
        ${({ theme }) => {
            return responsiveFontSize(theme, "h5", fields?.h5FontSize, responsive);
        }}
    }
    h6 {
        ${({ theme }) => {
            return responsiveFontSize(theme, "h6", fields?.h6FontSize, responsive);
        }}
    }
    p {
        ${({ theme }) => {
            return responsiveFontSize(theme, "p", fields?.normalFontSize, responsive);
        }}
    }
`;
