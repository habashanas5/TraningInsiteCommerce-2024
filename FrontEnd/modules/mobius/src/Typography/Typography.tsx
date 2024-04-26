import { BaseTheme, ThemeTypography } from "@insite/mobius/globals/baseTheme";
import TypographyEllipsis from "@insite/mobius/Typography/TypographyEllipsis";
import TypographyStyle from "@insite/mobius/Typography/TypographyStyle";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import { FontWeightProperty, TextTransformProperty } from "csstype";
import * as React from "react";
import { ThemeConsumer, ThemeProps } from "styled-components";

export interface TypographyPresentationProps {
    /** The color of the text. */
    color?: string;
    /** CSS string or styled-components function to be injected into this component. */
    css?: StyledProp<TypographyProps>;
    /**
     * Indicates how the `css` property is combined with the variant `css` property from the theme.
     * If true, the variant css is applied first and then the component css is applied after causing
     * a merge, much like normal CSS. If false, only the component css is applied, overriding the variant css in the theme.
     */
    mergeCss?: boolean;
    /** Sets the `title` attribute to the innerText of the component and shows an ellipsis when text overflows. */
    ellipsis?: boolean;
    /** Prioritized list of font family names or generic family names for the component. Passed to `font-family` in css.  */
    fontFamily?: string;
    /** Sets the font style to italic. */
    italic?: boolean;
    /** Spacing between the baselines of multiline text, in multiples of the font size. */
    lineHeight?: number | string;
    /** The font size in pixels if it's a number, or as a CSS value if it's a string. */
    size?: number | string;
    /** Equivalent to the `text-transform` property in CSS. */
    transform?: TextTransformProperty;
    /** Draws a line under the text. */
    underline?: boolean;
    /** The look of the component (defined in the theme). */
    variant?: keyof ThemeTypography;
    /** @ignore */
    forwardAs?: keyof JSX.IntrinsicElements;
    /** Equivalent to the `font-weight` property in CSS. */
    weight?: FontWeightProperty;
}

type ValidTypographyProps = React.HTMLAttributes<HTMLElement> | React.LabelHTMLAttributes<HTMLLabelElement>;

export type TypographyProps = MobiusStyledComponentProps<
    "span",
    TypographyPresentationProps &
        ValidTypographyProps & {
            /** The DOM element to render. */
            as?: keyof React.ReactHTML;
        }
>;

export interface TypographyComponentProps extends TypographyPresentationProps {
    theme: BaseTheme;
    _color?: TypographyPresentationProps["color"];
    _size?: TypographyPresentationProps["size"];
    variantCss?: TypographyPresentationProps["css"];
}

export interface TypographyComponentProps extends TypographyPresentationProps {
    theme: BaseTheme;
    _color?: TypographyPresentationProps["color"];
    _size?: TypographyPresentationProps["size"];
    variantCss?: TypographyPresentationProps["css"];
}

/**
 * The Typography component exists to ensure consistent text styling throughout the storefront.
 * Themable via variants only.
 */
const Typography: React.FC<TypographyProps> = ({ color, ellipsis, size, theme, forwardAs, ...otherProps }) => {
    return (
        <ThemeConsumer>
            {(theme?: BaseTheme) => {
                let newAs: keyof JSX.IntrinsicElements | undefined;
                if (otherProps.variant?.startsWith("header")) {
                    newAs = headerSecondaryRegex.exec(otherProps.variant) ? "span" : "p";
                }
                const {
                    color: variantColor,
                    size: variantSize,
                    css: variantCss,
                    ...variantProps
                } = otherProps.variant ? theme!.typography[otherProps.variant] : ({} as TypographyProps);
                const Component = ellipsis ? TypographyEllipsis : TypographyStyle;
                const componentProps: Omit<TypographyComponentProps, "theme"> = {
                    _color: color || variantColor,
                    _size: size || variantSize,
                    as: newAs || forwardAs,
                    variantCss,
                    ...variantProps,
                    ...otherProps,
                };
                return <Component {...componentProps} />;
            }}
        </ThemeConsumer>
    );
};

/** Must prevent p tags from rendering inside headerSecondary buttons */
const headerSecondaryRegex = /secondary/i;

/** @component */
export default Typography;
