import { ClickablePresentationProps, ClickableProps } from "@insite/mobius/Clickable";
import FormField, {
    FormFieldClickable,
    FormFieldComponentProps,
    FormFieldIcon,
    FormFieldPresentationProps,
    FormFieldSizeVariant,
} from "@insite/mobius/FormField";
import { sizeVariantValues } from "@insite/mobius/FormField/formStyles";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { IconPresentationProps } from "@insite/mobius/Icon";
import { TypographyPresentationProps } from "@insite/mobius/Typography";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import { HasDisablerContext, withDisabler } from "@insite/mobius/utilities/DisablerContext";
import InjectableCss, { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import { MobiusStyledComponentPropsWithRef } from "@insite/mobius/utilities/MobiusStyledComponentProps";
import omitMultiple from "@insite/mobius/utilities/omitMultiple";
import uniqueId from "@insite/mobius/utilities/uniqueId";
import VisuallyHidden from "@insite/mobius/VisuallyHidden";
import * as React from "react";
import styled, { css, ThemeConsumer } from "styled-components";

export interface TextFieldPresentationProps extends FormFieldPresentationProps<TextFieldComponentProps> {
    /** Props to be passed into the Clickable component that will optionally wrap the icon.
     * If `clickableProps` is passed, the icon will be wrapped in a Clickable. If not, the icon will not be clickable. */
    iconClickableProps?: ClickablePresentationProps;
    /** The props for icon displaying on the text input field.
     * @themable */
    iconProps?: IconPresentationProps;
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp<TextFieldComponentProps>;
    /**
     * Indicates how the `css` property is combined with the variant `css` property from the theme.
     * If true, the variant css is applied first and then the component css is applied after causing
     * a merge, much like normal CSS. If false, only the component css is applied, overriding the variant css in the theme.
     */
    mergeCss?: boolean;
    /** Background color of the form element */
    backgroundColor?: string;
    /** The props for the textfield label */
    labelProps?: TypographyPresentationProps;
}

type TextFieldComponentProps = MobiusStyledComponentPropsWithRef<
    "input",
    { ref?: React.Ref<HTMLInputElement> },
    {
        /** The props for icon displaying on the text input field. */
        iconProps?: IconPresentationProps;
        /** Props to be passed into the Clickable component that will optionally wrap the icon.
         * If `clickableProps` is passed, the icon will be wrapped in a Clickable. If not, the icon will not be clickable. */
        iconClickableProps?: ClickableProps;
        /** Visually hidden text to be rendered within the text field clickable. */
        clickableText?: string;
        /** Error message to be displayed below the input. */
        error?: React.ReactNode;
        /** Hint text to be displayed below the input. */
        hint?: React.ReactNode;
        /** Label to be displayed above the input. */
        label?: React.ReactNode;
    } & Partial<FormFieldComponentProps>
>;

export type TextFieldProps = TextFieldComponentProps & TextFieldPresentationProps;

export const InputStyle = styled.input<InjectableCss>`
    ${injectCss}
`;

const omitKeys = [
    "sizeVariant",
    "border",
    "label",
    "labelPosition",
    "theme",
    "cssOverrides",
    "iconProps",
    "backgroundColor",
    "labelProps",
    "dispatch",
    "labelId",
] as (keyof Omit<
    TextFieldProps,
    | "id"
    | "type"
    | "onKeyDown"
    | "onChange"
    | "clickableText"
    | "disabled"
    | "error"
    | "hint"
    | "iconClickableProps"
    | "id"
    | "placeholder"
    | "required"
    | "disable"
    | "mergeCss"
    | "min"
    | "max"
    | "css"
>)[];

const validForNumber = ({ altKey, ctrlKey, key }: React.KeyboardEvent<HTMLInputElement>) => {
    return altKey || ctrlKey || key.length > 1 || /[0-9\.\,\-\+]/.test(key);
};

const validNumber = (event: React.ChangeEvent<HTMLInputElement>, min?: number | string, max?: number | string) => {
    const number = Number(event.currentTarget.value);
    if (min !== undefined && number < Number(min)) {
        return false;
    }

    if (max !== undefined && number > Number(max)) {
        return false;
    }

    return true;
};

/**
 * TextField is a form element with an optional label, hint text, error message and optional icon.
 * Props not contained in the list below get passed into the input component (e.g. event handlers, `value`, etc).
 */
const TextField: React.FC<TextFieldProps & HasDisablerContext> = React.forwardRef<
    HTMLInputElement,
    TextFieldProps & HasDisablerContext
>((props, ref) => {
    return (
        <ThemeConsumer>
            {(theme?: BaseTheme) => {
                const {
                    type,
                    onKeyDown,
                    onChange,
                    clickableText,
                    disable,
                    disabled,
                    error,
                    hint,
                    iconClickableProps,
                    id,
                    placeholder,
                    required,
                    mergeCss,
                    min,
                    max,
                    ...otherProps
                } = props;

                const isDisabled = !!(disable || disabled);
                const inputId = id || uniqueId();
                const labelId = `${inputId}-label`;
                const inputLabelObj = otherProps.label === 0 || otherProps.label ? { "aria-labelledby": labelId } : {};
                const descriptionId = `${inputId}-description`;
                const hasDescription = error || hint;

                const { applyProp, spreadProps, applyStyledProp } = applyPropBuilder(
                    { theme, ...otherProps },
                    { component: "textField", category: "formField" },
                );
                const labelProps = applyProp("labelProps");
                const sizeVariant: FormFieldSizeVariant = applyProp("sizeVariant", "default");
                const iconProps = spreadProps("iconProps");
                const resolvedMergeCss = mergeCss ?? theme?.textField?.defaultProps?.mergeCss;

                const internalOnKeyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
                    if (type === "number" && !validForNumber(event)) {
                        event.preventDefault();
                    }

                    onKeyDown?.(event);
                };

                const internalOnChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
                    if (type === "number" && !validNumber(event, min, max)) {
                        event.preventDefault();
                        return;
                    }

                    onChange?.(event);
                };

                const formFieldProps = {
                    ...iconProps,
                    size: sizeVariantValues[sizeVariant].icon,
                    color: isDisabled ? "text.disabled" : iconProps.color || "text.main",
                };

                const formIcon = iconProps ? (
                    iconClickableProps ? (
                        <FormFieldClickable {...iconClickableProps} disabled={isDisabled}>
                            <FormFieldIcon {...formFieldProps} />
                            <VisuallyHidden>{clickableText}</VisuallyHidden>
                        </FormFieldClickable>
                    ) : (
                        <FormFieldIcon {...formFieldProps} />
                    )
                ) : null;

                const InputElement = (
                    <>
                        <InputStyle
                            {...{ disabled: isDisabled, placeholder, required }}
                            {...inputLabelObj}
                            {...omitMultiple(otherProps, omitKeys)}
                            ref={ref}
                            min={min}
                            max={max}
                            type={type || "text"}
                            id={inputId}
                            onKeyDown={internalOnKeyDownHandler}
                            onChange={internalOnChangeHandler}
                            aria-labelledby={labelId}
                            aria-describedby={hasDescription ? descriptionId : undefined}
                            aria-invalid={!!error}
                            aria-required={!disabled && required}
                            tabIndex={0}
                            css={applyStyledProp("css", resolvedMergeCss)}
                        />
                        {formIcon}
                    </>
                );
                return (
                    <FormField
                        {...props}
                        labelProps={labelProps}
                        descriptionId={descriptionId}
                        formInput={InputElement}
                        labelId={labelId}
                        inputId={inputId}
                    />
                );
            }}
        </ThemeConsumer>
    );
});

TextField.defaultProps = {};

/** @component */
export default withDisabler(TextField);
