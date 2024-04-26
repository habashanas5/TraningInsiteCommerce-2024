import { checkboxSizes } from "@insite/mobius/Checkbox";
import RadioGroupContext from "@insite/mobius/RadioGroup/RadioGroupContext";
import Typography from "@insite/mobius/Typography";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import combineTypographyProps from "@insite/mobius/utilities/combineTypographyProps";
import { HasDisablerContext, withDisabler } from "@insite/mobius/utilities/DisablerContext";
import FieldSetPresentationProps from "@insite/mobius/utilities/fieldSetProps";
import getColor from "@insite/mobius/utilities/getColor";
import getContrastColor from "@insite/mobius/utilities/getContrastColor";
import InjectableCss, { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import omitMultiple from "@insite/mobius/utilities/omitMultiple";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import * as React from "react";
import styled, { withTheme } from "styled-components";

export interface RadioPresentationProps {
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp<RadioProps>;
    /**
     * Indicates how the `css` property is combined with the variant `css` property from the theme.
     * If true, the variant css is applied first and then the component css is applied after causing
     * a merge, much like normal CSS. If false, only the component css is applied, overriding the variant css in the theme.
     */
    mergeCss?: boolean;
}

export type RadioComponentProps = MobiusStyledComponentProps<
    "div",
    {
        /** Disables the radio button. */
        disabled?: boolean;
        /** Sets the value, if different from the radio button's `children`. */
        value?: string;
    }
>;

export type RadioProps = RadioComponentProps & FieldSetPresentationProps<RadioComponentProps> & RadioPresentationProps;

const RadioStyle = styled.div<{ _sizeVariant: keyof typeof checkboxSizes; _color: string } & InjectableCss>`
    display: block;
    input {
        opacity: 0;
        & + label {
            margin-left: -15px;
            position: relative;
            display: inline-flex;
            align-items: center;
            &::before {
                content: "";
                box-sizing: border-box;
                display: inline-block;
                height: ${({ _sizeVariant }) => (_sizeVariant === "small" ? 12 : 16)}px;
                width: ${({ _sizeVariant }) => (_sizeVariant === "small" ? 12 : 16)}px;
                border-radius: 50%;
                border: 1px solid ${getColor("common.border")};
                margin-right: 10px;
            }
        }
        &:disabled + label {
            cursor: not-allowed;
        }
        &:focus + label::before {
            box-shadow: 0 0 0 2px ${getColor("common.backgroundContrast")};
        }
        &:checked:not(:disabled) + label::before {
            border-color: transparent;
            background: ${({ _color, theme }) => resolveColor(_color, theme)};
        }
        &:checked + label::after {
            content: "";
            display: block;
            height: ${({ _sizeVariant }) => (_sizeVariant === "small" ? 4 : 6)}px;
            width: ${({ _sizeVariant }) => (_sizeVariant === "small" ? 4 : 6)}px;
            border-radius: 50%;
            background: ${({ _color, theme }) => getContrastColor(_color, theme)};
            position: absolute;
            left: ${({ _sizeVariant }) => (_sizeVariant === "small" ? 4 : 5)}px;
            top: calc(50% - ${({ _sizeVariant }) => (_sizeVariant === "small" ? 2 : 3)}px);
        }
        &:checked:disabled + label::after {
            background: ${({ theme }) => getContrastColor("common.disabled", theme)};
        }
    }
    ${injectCss}
`;

const Radio: React.FC<RadioProps & HasDisablerContext> = props => {
    const { children, disable, disabled, mergeCss, value, ...otherProps } = props;

    return (
        <RadioGroupContext.Consumer>
            {({ name, onChange, sizeVariant: sizeVariantFromContext, value: radioGroupValue }) => {
                const { applyProp, spreadProps, applyStyledProp } = applyPropBuilder(
                    { sizeVariant: sizeVariantFromContext, ...props },
                    { component: "radio", category: "fieldSet" },
                );
                // Because disabled html attribute doesn't accept undefined
                // eslint-disable-next-line no-unneeded-ternary
                const isDisabled = disable || disabled ? true : false;
                const sizeVariant = applyProp("sizeVariant", "default") as keyof typeof checkboxSizes;
                const typographyProps = combineTypographyProps({
                    theme: otherProps.theme!,
                    passedProps: spreadProps("typographyProps"),
                    defaultProps: {
                        size: checkboxSizes[sizeVariant].fontSize,
                    },
                });

                const radioValue = (value || (children as string)) ?? "";
                const id = `${name}-${radioValue.replace(/\W/g, "-")}`;
                const resolvedMergeCss = mergeCss ?? props.theme?.radio?.defaultProps?.mergeCss;
                return (
                    <RadioStyle
                        _color={applyProp("color", "primary")}
                        _sizeVariant={sizeVariant}
                        css={applyStyledProp("css", resolvedMergeCss)}
                    >
                        <input
                            type="radio"
                            id={id}
                            name={name}
                            value={radioValue}
                            checked={radioValue === radioGroupValue}
                            {...{ disabled: isDisabled, onChange }}
                            {...omitMultiple(otherProps, ["typographyProps", "color", "css"])}
                        />
                        <Typography
                            {...typographyProps}
                            color={isDisabled ? "text.disabled" : typographyProps.color}
                            as="label"
                            htmlFor={id}
                        >
                            {children}
                        </Typography>
                    </RadioStyle>
                );
            }}
        </RadioGroupContext.Consumer>
    );
};

/** @component */
export default withDisabler(withTheme(Radio));

export { RadioStyle };
