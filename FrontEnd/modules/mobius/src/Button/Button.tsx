import buttonShapes from "@insite/mobius/Button/buttonShapes";
import buttonSizeVariants from "@insite/mobius/Button/buttonSizeVariants";
import buttonTypes from "@insite/mobius/Button/buttonTypes";
import hoverAnimations from "@insite/mobius/Button/hoverAnimations";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import { HasDisablerContext, withDisabler } from "@insite/mobius/utilities/DisablerContext";
import get from "@insite/mobius/utilities/get";
import getProp from "@insite/mobius/utilities/getProp";
import InjectableCss, { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import omitMultiple from "@insite/mobius/utilities/omitMultiple";
import * as React from "react";
import styled, { css, ThemeProps, withTheme } from "styled-components";
import { applyStyleModifiers } from "styled-components-modifiers";

export type ButtonSizeVariants = keyof typeof buttonSizeVariants;
export type ButtonVariants = "primary" | "secondary" | "tertiary";

export interface ButtonIconPresentationProps extends IconPresentationProps {}

export interface ButtonPresentationProps {
    /** How the color changes when the button is clicked.
     * @themable */
    activeMode?: "darken" | "lighten" | "none";
    /** Allows for fine-tuning of the active (clicked) state of the button.
     * @themable */
    activeStyle?: React.CSSProperties;
    /** The color of the button.
     * @themable */
    color?: string;
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp<ButtonProps>;
    /**
     * Indicates how the `css` property is combined with the variant `css` property from the theme.
     * If true, the variant css is applied first and then the component css is applied after causing
     * a merge, much like normal CSS. If false, only the component css is applied, overriding the variant css in the theme.
     */
    mergeCss?: boolean;
    /** Default presets for hover animation. This setting overrides hoverStyle if present.
     * @themable */
    hoverAnimation?: "grow" | "shrink" | "float";
    /** How the color changes when the button is hovered over.
     * @themable */
    hoverMode?: "darken" | "lighten" | "none";
    /** Allows for fine-tuning of the hovered state of the button.
     * @themable */
    hoverStyle?: React.CSSProperties;
    /** The source for icon displaying on the button. */
    icon?: {
        src: React.ComponentType | string;
        position: "right" | "left";
    };
    /** Toggles a shadow behind/below the button.
     * @themable */
    shadow?: boolean;
    /** Default presets for the button's shape.
     * @themable */
    shape?: "rectangle" | "pill" | "rounded";
    /** Defines the height of the button, as one of the preset values.
     * @themable */
    sizeVariant?: ButtonSizeVariants;
    /** Defines the height of the button, as the number of pixels.
     * @themable */
    size?: number;
    /** An object containing props to be passed down to the Typography component inside the button.
     * @themable */
    typographyProps?: TypographyPresentationProps;
    /** Applies one of the predefined button types defined in `buttonTypes.js`.
     * @themable */
    buttonType?: "outline" | "solid";
    /** Applies one of the predefined button variants defined in the theme. */
    variant?: ButtonVariants;
}

interface ButtonComponentProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    activeStyle?: React.CSSProperties;
    /** Children of the Button component */
    children?: React.ReactNode;
    /** @ignore */
    forwardAs?: keyof JSX.IntrinsicElements;
    /** Focus the button on render */
    isFocusAfterMount?: boolean;
}

export type ButtonProps = ButtonComponentProps & ButtonPresentationProps;

const ButtonIcon = styled(Icon)``;

type BWT = Pick<ButtonProps, "shadow"> &
    InjectableCss & {
        _sizeVariant: ButtonProps["sizeVariant"];
        _size: ButtonProps["size"] | null;
        _color: ButtonProps["color"];
        _shape: ButtonProps["shape"];
        // this is needed because styled-components is confused
        disabled: boolean;
    };

// this should be BWT but typescript is not happy with "Type instantiation is excessively deep and possibly infinite." and nothing else was working
const ButtonWrapper = styled.button<any>`
    cursor: pointer;
    font-family: inherit;
    min-height: ${({ _sizeVariant, _size }) => _size || get(buttonSizeVariants, [_sizeVariant, "height"])}px;
    line-height: 1;
    backface-visibility: hidden;
    transition: all ${getProp("theme.transition.duration.regular")}ms ease-in-out;
    word-break: keep-all;
    ${({ shadow, theme }) =>
        shadow &&
        `
        box-shadow: ${get(theme, "shadows.1")};
    `}
    padding: ${({ _sizeVariant }) => get(buttonSizeVariants, [_sizeVariant, "padding"]) || "0 1em"};
    ${applyStyleModifiers(buttonShapes, "_shape")}
    ${applyStyleModifiers(buttonTypes, "buttonType")}
    ${applyStyleModifiers(hoverAnimations, "hoverAnimation")}
    &:disabled {
        cursor: not-allowed;
    }
    ${ButtonIcon} {
        position: relative;
        top: 0.125em;
    }
    &:focus {
        outline-offset: 1px;
        outline-color: ${getProp("theme.focus.color", "#09f")};
        outline-style: ${getProp("theme.focus.style", "solid")};
        outline-width: ${getProp("theme.focus.width", "2px")};
    }
    &::-moz-focus-inner {
        border: none;
    }
    ${injectCss}
`;

const omitKeys = ["color", "shape", "size", "sizeVariant"] as const;

type ButtonContextProps = ThemeProps<BaseTheme> & HasDisablerContext;

const Button: React.FC<ButtonProps & ButtonContextProps> = props => {
    const {
        children,
        css: buttonCss,
        disable,
        disabled,
        forwardAs,
        icon,
        typographyProps,
        theme,
        variant,
        mergeCss,
        isFocusAfterMount,
        ...otherProps
    } = props as Omit<ButtonProps, "variant"> & Required<Pick<ButtonProps, "variant">> & ButtonContextProps; // Accounts for defaultProps.
    const position = icon?.position;
    const src = icon?.src;
    const buttonRef = React.useRef<HTMLButtonElement | null>(null);

    let variantProps: ButtonPresentationProps = {};
    if (variant) {
        variantProps = theme.button[variant];
    }
    const { applyProp, applyStyledProp, spreadProps } = applyPropBuilder(props, {
        component: "button",
        propKey: variant,
    });
    const sizeVariant = applyProp("sizeVariant", "medium") as keyof typeof buttonSizeVariants;
    const size = applyProp("size", null) as number | null;
    const resolvedMergeCss = mergeCss ?? variantProps.mergeCss;

    React.useEffect(() => {
        if (isFocusAfterMount) {
            buttonRef?.current?.focus();
        }
    }, []);

    return (
        <ButtonWrapper
            {...omitMultiple(variantProps, omitKeys)}
            ref={buttonRef}
            as={forwardAs}
            css={applyStyledProp("css", resolvedMergeCss)}
            _color={applyProp("color", "primary")}
            _shape={applyProp("shape", "rectangle")}
            _sizeVariant={sizeVariant}
            _size={size}
            // Because disabled doesn't accept undefined
            // eslint-disable-next-line no-unneeded-ternary
            disabled={disable || disabled ? true : false}
            {...omitMultiple(otherProps, omitKeys)}
        >
            {position === "left" ? (
                <ButtonIcon
                    src={src}
                    size={buttonSizeVariants[sizeVariant].icon}
                    css={css`
                        margin-right: ${buttonSizeVariants[sizeVariant].iconPadding}px;
                    `}
                />
            ) : null}
            {typeof children === "string" ? (
                <Typography
                    size={get(buttonSizeVariants, [sizeVariant, "fontSize"]) || buttonSizeVariants.medium.fontSize}
                    mergeCss={mergeCss}
                    {...spreadProps("typographyProps")}
                >
                    {/* Note: if passing an icon into the button, it will only receive button styles
                    if passed as a `ButtonIcon` */}
                    {children}
                </Typography>
            ) : (
                children
            )}
            {position === "right" ? (
                <ButtonIcon
                    src={src}
                    size={buttonSizeVariants[sizeVariant].icon}
                    css={css`
                        margin-left: ${buttonSizeVariants[sizeVariant].iconPadding}px;
                    `}
                />
            ) : null}
        </ButtonWrapper>
    );
};

Button.defaultProps = {
    variant: "primary",
};

/** @component */
export default withDisabler(withTheme(Button));

export { ButtonIcon, ButtonWrapper };
