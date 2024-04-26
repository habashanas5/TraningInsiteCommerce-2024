import ToggleInput from "@insite/mobius/Checkbox/ToggleInput";
import CheckboxGroupContext, { CheckboxGroupContextData } from "@insite/mobius/CheckboxGroup/CheckboxGroupContext";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { IconMemo, IconPresentationProps, IconProps } from "@insite/mobius/Icon";
import Typography from "@insite/mobius/Typography";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import combineTypographyProps from "@insite/mobius/utilities/combineTypographyProps";
import { HasDisablerContext, withDisabler } from "@insite/mobius/utilities/DisablerContext";
import FieldSetPresentationProps from "@insite/mobius/utilities/fieldSetProps";
import get from "@insite/mobius/utilities/get";
import getColor from "@insite/mobius/utilities/getColor";
import getContrastColor from "@insite/mobius/utilities/getContrastColor";
import InjectableCss, { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import omitMultiple from "@insite/mobius/utilities/omitMultiple";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import uniqueId from "@insite/mobius/utilities/uniqueId";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import Color from "color";
import * as React from "react";
import styled, { css, ThemeProps, withTheme } from "styled-components";

export interface CheckboxPresentationProps
    extends FieldSetPresentationProps<CheckboxProps & StyleProps>,
        CheckboxGroupContextData {
    /** Props to be passed into the inner Icon component.
     * @themable */
    iconProps?: IconPresentationProps;
    /** Props to be passed into the indeterminate Icon component.
     * @themable */
    indeterminateIconProps?: IconPresentationProps;
    /** The background color of the indeterminate checkbox.
     * @themable */
    indeterminateColor?: string;
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp<CheckboxProps & StyleProps>;
    /**
     * Indicates how the `css` property is combined with the variant `css` property from the theme.
     * If true, the variant css is applied first and then the component css is applied after causing
     * a merge, much like normal CSS. If false, only the component css is applied, overriding the variant css in the theme.
     */
    mergeCss?: boolean;
}

export interface CheckboxProps extends CheckboxPresentationProps {
    /** Sets the initial checked state of this Checkbox. Please note, "indeterminate" value is valid only for "default" checkbox variant. */
    checked?: boolean | "indeterminate";
    /** Disables the checkbox. */
    disabled?: boolean;
    /** Indicates an error by changing the color of the checkbox label. */
    error?: boolean;
    /** Whether the label will display to the left or right of the checkbox.  */
    labelPosition?: "left" | "right";
    /** Handler for the change event. The value of the select is exposed as the second parameter: (event, value) => void */
    onChange?: (event: React.SyntheticEvent, value: boolean) => void;
    /** Display variants. */
    variant?: "toggle" | "default";
    uid?: string;
    /** Renders an invisible element next to the icon for those using screen readers */
    hiddenIconText?: string;
}

export const checkboxSizes = {
    default: {
        fontSize: 15,
        iconSize: 16,
        borderRadius: 4,
    },
    small: {
        fontSize: 13,
        iconSize: 12,
        borderRadius: 3,
    },
};

export type StyleProps = {
    _sizeVariant: Required<CheckboxGroupContextData>["sizeVariant"];
    _labelPosition: CheckboxProps["labelPosition"];
    disabled: CheckboxProps["disabled"];
    _color: CheckboxProps["color"];
};

const CheckboxStyle = styled.div<InjectableCss & StyleProps>`
    display: inline-flex;
    align-items: center;
    cursor: ${({ disabled }) => (disabled ? "not-allowed" : "default")};
    ${({ _labelPosition }) =>
        _labelPosition === "left" &&
        css`
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-left: 10px;
        `}
    span[role=checkbox] {
        box-sizing: border-box;
        min-width: ${({ _sizeVariant }) => checkboxSizes[_sizeVariant].iconSize}px;
        border: 1px solid ${getColor("common.border")};
        border-radius: ${({ _sizeVariant }) => checkboxSizes[_sizeVariant].borderRadius}px;
        &[aria-checked="true"]:not([aria-disabled="true"]),
        &[aria-checked="mixed"]:not([aria-disabled="true"]) {
            background: ${({ _color, theme }) => resolveColor(_color, theme)};
            border: 0;
            color: ${({ _color, theme }) => getContrastColor(_color, theme)};
        }
        &[aria-disabled="true"] {
            background: ${({ theme }) => Color(get(theme, "colors.common.disabled")).fade(0.8).toString()};
            border: 1px solid ${({ theme }) => Color(get(theme, "colors.common.border")).fade(0.5).toString()};
            color: ${getColor("common.disabled")};
        }
        &[aria-checked="false"] svg {
            display: none;
        }
        & + label {
            margin-left: 10px;
        }
        &:focus {
            outline: none;
            box-shadow: 0 0 0 2px ${getColor("common.backgroundContrast")};
        }
    }
    ${injectCss}
`;

const IconCheck: React.FC<{ iconProps: IconProps; hiddenIconText?: string }> = ({
    iconProps,
    hiddenIconText,
    ...thisOtherProps
}) => (
    <>
        <IconMemo {...thisOtherProps} {...iconProps} />
        {hiddenIconText && <VisuallyHidden>{hiddenIconText}</VisuallyHidden>}
    </>
);

type Props = CheckboxProps & ThemeProps<BaseTheme>;

type State = Required<Pick<Props, "checked" | "uid">>;

const omitList = ["color", "onChange", "id", "sizeVariant", "css", "mergeCss", "hiddenIconText"] as (keyof Omit<
    Props,
    "children" | "disabled" | "disable" | "error" | "variant" | "indeterminate" | "mergeCss" | "css" | "hiddenIconText"
>)[];

class Checkbox extends React.Component<Props & HasDisablerContext, State> {
    state: State = {
        checked: this.props.checked || false,
        uid: this.props.uid || uniqueId(),
    };

    static getDerivedStateFromProps({ checked, onChange }: Props, prevState: State) {
        let nextChecked = prevState.checked || false;
        if (onChange && checked !== prevState.checked) {
            nextChecked = checked === "indeterminate" ? checked : !!checked; // eslint-disable-line prefer-destructuring
        }
        return { checked: nextChecked };
    }

    toggleCheck = (e: React.SyntheticEvent<HTMLSpanElement>) => {
        const { disable, disabled, onChange } = this.props;

        if (disable || disabled) {
            return;
        }

        const currentValue = !this.state.checked;

        this.setState({ checked: currentValue }, () => {
            if (onChange) {
                // call onChange after the new checkbox state is rendered
                setTimeout(() => {
                    // pass the value as the second parameter into the onChange function
                    onChange(e, currentValue);
                });
            }
        });
    };

    handleKeyUp = (e: React.KeyboardEvent<HTMLSpanElement>) => {
        const keyIsEnterOrSpace = e.which === 13 || e.which === 32;
        if (keyIsEnterOrSpace) {
            e.stopPropagation();
            this.toggleCheck(e);
        }
    };

    render() {
        const {
            children,
            disable,
            disabled,
            error,
            variant = "default",
            mergeCss,
            hiddenIconText,
            ...otherProps
        } = this.props;
        const isIndeterminate = this.state.checked === "indeterminate";

        return (
            <CheckboxGroupContext.Consumer>
                {context => {
                    // NOTE: not destructuring context because in practice the group wrapper is optional for checkboxes.
                    const sizeVariant = context && context.sizeVariant;
                    // Because disabled html attribute doesn't accept undefined
                    // eslint-disable-next-line no-unneeded-ternary
                    const isDisabled = disable || disabled ? true : false;
                    const { applyProp, applyStyledProp, spreadProps } = applyPropBuilder(
                        { sizeVariant, ...this.props },
                        { component: "checkbox", category: "fieldSet" },
                    );
                    const resolvedMergeCss = mergeCss ?? this.props?.theme?.checkbox?.defaultProps?.mergeCss;
                    const sizeVariantApplied = applyProp("sizeVariant", "default") as keyof typeof checkboxSizes;
                    const color = applyProp(isIndeterminate ? "indeterminateColor" : "color", "primary");
                    const labelPosition =
                        applyProp("labelPosition") || (applyProp("variant", "default") === "toggle" ? "left" : "right");
                    const spreadTypographyProps = spreadProps("typographyProps");
                    const typographyProps = combineTypographyProps({
                        theme: otherProps.theme,
                        passedProps: spreadProps("typographyProps"),
                        defaultProps: {
                            size: checkboxSizes[sizeVariantApplied].fontSize,
                        },
                    });

                    const labelId = `${this.state.uid}-label`;

                    let renderLabel;
                    if (children === 0 || children) {
                        let labelColor = typographyProps.color;
                        if (error) {
                            labelColor = spreadTypographyProps.errorColor || "danger";
                        }
                        if (isDisabled) {
                            labelColor = spreadTypographyProps.disabledColor || "text.disabled";
                        }
                        renderLabel = (
                            <Typography
                                as="label"
                                htmlFor={this.state.uid}
                                id={labelId}
                                size={checkboxSizes[sizeVariantApplied].fontSize}
                                tabIndex={-1}
                                {...typographyProps}
                                color={labelColor} // defaults to text.main if undefined
                                css={css`
                                    cursor: inherit;
                                    &:focus {
                                        outline: 0;
                                    }
                                    ${typographyProps.css}
                                `}
                            >
                                {children}
                            </Typography>
                        );
                    }

                    const CheckInput = variant === "toggle" ? ToggleInput : IconCheck;
                    let ariaChecked: boolean | "mixed" = !!this.state.checked;
                    if (isIndeterminate) {
                        ariaChecked = "mixed";
                    }
                    const checkInputProps = {
                        _color: color,
                        id: this.state.uid,
                        role: "checkbox",
                        _sizeVariant: sizeVariantApplied,
                        tabIndex: isDisabled ? -1 : 0,
                        "aria-checked": ariaChecked /* needed for when the `checked` prop is undefined or null */,
                        "aria-disabled": isDisabled,
                        disabled: isDisabled,
                        "aria-labelledby": labelId,
                        "data-checkbox-only":
                            children !== 0 && !children ? true : null /* ship this attribute if no children */,
                        onKeyUp: this.handleKeyUp,
                    };
                    return (
                        <CheckboxStyle
                            css={applyStyledProp("css", resolvedMergeCss)}
                            _color={color}
                            _sizeVariant={sizeVariantApplied}
                            _labelPosition={labelPosition}
                            disabled={isDisabled}
                            data-id="checkbox"
                            onClick={this.toggleCheck}
                            {...omitMultiple(otherProps, omitList)}
                        >
                            {labelPosition === "left" && renderLabel}
                            {isIndeterminate && (
                                <IconCheck
                                    {...checkInputProps}
                                    iconProps={{
                                        size: checkboxSizes[sizeVariantApplied].iconSize,
                                        color: "currentColor",
                                        ...spreadProps("indeterminateIconProps"),
                                    }}
                                    hiddenIconText={hiddenIconText}
                                />
                            )}
                            {!isIndeterminate && (
                                <CheckInput
                                    {...checkInputProps}
                                    iconProps={{
                                        size: checkboxSizes[sizeVariantApplied].iconSize,
                                        color: "currentColor",
                                        ...spreadProps("iconProps"),
                                    }}
                                />
                            )}
                            {labelPosition !== "left" && renderLabel}
                        </CheckboxStyle>
                    );
                }}
            </CheckboxGroupContext.Consumer>
        );
    }
}

// withTheme is currently incompatible with getDerivedStateFromProps, as unknown as FunctionComponent needed to get typescript to understand that this can have children
/** @component */
export default withDisabler(withTheme(Checkbox as unknown as React.FunctionComponent<Props & HasDisablerContext>));

export { CheckboxStyle };
