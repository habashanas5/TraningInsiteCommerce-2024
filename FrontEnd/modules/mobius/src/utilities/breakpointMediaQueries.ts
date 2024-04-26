import baseTheme from "@insite/mobius/globals/baseTheme";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import { css } from "styled-components";

export type BreakpointKey = "xs" | "sm" | "md" | "lg" | "xl";

export const breakpointKeys: Readonly<BreakpointKey[]> = ["xs", "sm", "md", "lg", "xl"];

export const mediaOptions = {
    min: "min",
    max: "max",
    minMax: "minMax",
} as const;

/**
 * Creates media queries based on the theme's breakpoints.
 * @param theme The theme object. Defaults to the baseTheme.
 * @param rules An array of CSS rules to be inserted in each media query.
 * @param option Flag describing how the styling is implemented within breakpoint ranges.
 */
export default function breakpointMediaQueries(
    theme = baseTheme,
    rules: (StyledProp | null)[] = [],
    option: keyof typeof mediaOptions = mediaOptions.minMax,
) {
    const mediaRules = rules.map((rule, index) => {
        const { values } = theme.breakpoints || baseTheme.breakpoints;
        if (!rule) {
            return null;
        }
        if (option === mediaOptions.minMax) {
            switch (index) {
                case 0:
                    return css`
                        @media (max-width: ${values[index + 1] - 1}px) {
                            ${rule}
                        }
                    `;
                case values.length - 1:
                    return css`
                        @media (min-width: ${values[index]}px) {
                            ${rule}
                        }
                    `;
                default:
                    return css`
                        @media (min-width: ${values[index]}px) and (max-width: ${values[index + 1] - 1}px) {
                            ${rule}
                        }
                    `;
            }
        }

        if (option === mediaOptions.min) {
            return css`
                @media (min-width: ${values[index]}px) {
                    ${rule}
                }
            `;
        }

        if (option === mediaOptions.max) {
            return css`
                @media (max-width: ${values[index + 1] - 1}px) {
                    ${rule}
                }
            `;
        }

        return null;
    });
    /* stylelint-disable */
    return css`
        ${mediaRules[0]}${mediaRules[1]}${mediaRules[2]}${mediaRules[3]}${mediaRules[4]}
    `
        .join("\n")
        .trim();
    /* stylelint-enable */
}
