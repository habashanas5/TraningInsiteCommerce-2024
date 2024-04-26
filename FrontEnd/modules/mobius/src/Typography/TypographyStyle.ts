import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { TypographyComponentProps, TypographyPresentationProps } from "@insite/mobius/Typography/Typography";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import styled, { ThemeProps } from "styled-components";

/**
 * This is a highly simplified version of the styled-components internal utility functions `flatten` and `interleave`.
 * `flatten` and `interleave` are not exported and therefore not safe to use as utility functions in this library.
 * They provide browser-specific support for various css properties and handle recursive tagged template literals,
 * as well as support for nonstandard types of tagged interpolations. This is used only to render styles within the
 * rich text editor, and therefore ideally should not require as robust of functionality.
 *  */
const hydrateCssTaggedTemplate = (css: TypographyPresentationProps["css"], theme: BaseTheme) => {
    const hydratedSegments: string[] = [];
    if (typeof css === "object") {
        css.forEach((segment: any) => {
            if (typeof segment === "function") {
                hydratedSegments.push(segment({ theme }));
            }
            hydratedSegments.push(segment);
        });
    }
    return hydratedSegments.join("");
};

const typographyStyleStringGenerator = ({
    _color,
    _size,
    color,
    fontFamily,
    italic,
    lineHeight,
    size,
    theme,
    transform,
    underline,
    variantCss,
    weight,
    ...otherProps
}: TypographyComponentProps) => `
    ${_color ? `color: ${resolveColor(_color, theme)};` : ""}
    ${color ? `color: ${resolveColor(color, theme)};` : ""}
    ${italic ? "font-style: italic;" : ""}
    ${lineHeight !== undefined ? `line-height: ${lineHeight};` : ""}
    ${_size !== undefined ? `font-size: ${typeof _size === "string" ? _size : `${_size}px`};` : ""}
    ${size !== undefined ? `font-size: ${typeof size === "string" ? size : `${size}px`};` : ""}
    ${transform ? `text-transform: ${transform};` : ""}
    ${underline ? "text-decoration: underline;" : ""}
    ${weight !== undefined ? `font-weight: ${weight};` : ""}
    ${fontFamily !== undefined ? `font-family: ${fontFamily};` : ""}
    ${hydrateCssTaggedTemplate(variantCss, theme) || ""}
    ${otherProps.css ? hydrateCssTaggedTemplate(otherProps.css, theme) : ""}
`;

export const themeTypographyStyleString = ({ theme }: ThemeProps<BaseTheme>) => {
    const variants = Object.keys(theme.typography) as (keyof BaseTheme["typography"])[];
    return variants
        .map(v => {
            if (v === "fontFamilyImportUrl") {
                return "";
            }
            return `
            ${v} {
                ${typographyStyleStringGenerator({ theme, ...theme.typography[v] })}
            }
        `;
        })
        .join(" ");
};

/**
 * This is likely the correct typing for the typographyStyle, however it causes a deep type instantiation error.
 *
 * type TypographyStyleProps = Omit<TypographyProps, "color" | "ellipsis" | "size" | "forwardAs">
 *     & {
 *         _color?: string;
 *         _size?: number | string;
 *         variantCss?: StyledProp<any>;
 *     };
 * const TypographyStyle = styled.span.attrs<TypographyStyleProps, { as: keyof JSX.IntrinsicElements }>((props: TypographyComponentProps) => ({
 */
/* eslint-disable no-unneeded-ternary */
const TypographyStyle = styled.span.attrs<any, { as: any }>((props: any) => ({
    as: props.as || props.variant,
}))`
    /*
     * UH OH! Is this extremely repetitive code that should be refactored?
     * Nope! we need tagged template literals to be in full force here for variantCss and css to work as expected.
    */
    ${({ _color, theme }: TypographyComponentProps) => (_color ? `color: ${resolveColor(_color, theme)};` : "")}

    ${({ color, theme }: TypographyComponentProps) => (color ? `color: ${resolveColor(color, theme)};` : "")}
    ${({ italic }: TypographyComponentProps) => (italic ? "font-style: italic;" : "")}
    ${({ lineHeight }: TypographyComponentProps) => (lineHeight !== undefined ? `line-height: ${lineHeight};` : "")}
    ${({ _size }: TypographyComponentProps) =>
        _size !== undefined ? `font-size: ${typeof _size === "string" ? _size : `${_size}px`};` : ""}
    ${({ size }: TypographyComponentProps) =>
        size !== undefined ? `font-size: ${typeof size === "string" ? size : `${size}px`};` : ""}
    ${({ transform }: TypographyComponentProps) => (transform ? `text-transform: ${transform};` : "")}
    ${({ underline }: TypographyComponentProps) => (underline ? "text-decoration: underline;" : "")}
    ${({ weight }: TypographyComponentProps) => (weight !== undefined ? `font-weight: ${weight};` : "")}
    ${({ fontFamily }: TypographyComponentProps) => (fontFamily !== undefined ? `font-family: ${fontFamily};` : "")}

    /*
     * Keep the default behavior of merging variantCss and css
     * by setting the mergeCss value to true. If mergeCss is false,
     * the override behavior is the same as other css props.
    */
    ${({ variantCss, mergeCss = true }: any) => (mergeCss && variantCss) || ""}
    ${({ css }: any) => (css ? css : "")}
`;
/* eslint-enable no-unneeded-ternary */

export default TypographyStyle;
