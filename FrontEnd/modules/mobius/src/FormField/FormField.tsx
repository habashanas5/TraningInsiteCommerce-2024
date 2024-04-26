import Clickable from "@insite/mobius/Clickable";
import borderByState, { disabledByType, sizeVariantValues } from "@insite/mobius/FormField/formStyles";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import Icon, { IconPresentationProps } from "@insite/mobius/Icon";
import Typography, { TypographyPresentationProps } from "@insite/mobius/Typography";
import TypographyStyle from "@insite/mobius/Typography/TypographyStyle";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import combineTypographyProps from "@insite/mobius/utilities/combineTypographyProps";
import InjectableCss, { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import * as React from "react";
import styled, { ThemeProps, withTheme } from "styled-components";

export type FormFieldSizeVariant = "default" | "small";
type LabelPosition = "top" | "left";

// A subset of form field props that could reasonably be used to determine theme css based on the value of the prop.
export interface FormFieldPropsMock {
    disabled?: boolean;
    error?: React.ReactNode;
    required?: boolean;
}

export interface FormFieldComponentProps {
    /** Disables the form field. */
    disabled?: boolean;
    /** Unique id to be passed into the description element. */
    descriptionId: number | string;
    /** Error message to be displayed below the input. */
    error?: React.ReactNode;
    /** The input to be styled, including icon if relevant.
     * @ignore */
    formInput: React.ReactNode;
    /** Hint text to be displayed below the input. */
    hint?: React.ReactNode;
    /**
     * Unique id to be passed into the input element.
     * If not provided, a random id is assigned (an id is required for accessibility purposes).
     */
    inputId: number | string;
    /** Label to be displayed above the input. */
    label?: React.ReactNode;
    /** Position of the label in relation to the form field. */
    labelPosition?: "top" | "left";
    /** Id to be passed into label. Can be used for accessibility for aria-labelledby. */
    labelId?: number | string;
    /** Adds an asterisk to the input's label (if provided). */
    required?: boolean;
    /** Is sometimes passed via a object spread */
    dispatch?: unknown;
}

export interface FormFieldPresentationPropsCommon {
    /** Border type variants.
     * @themable */
    border?: "underline" | "rectangle" | "rounded";
    /** Props to be passed into the error message's Typography component.
     * @themable */
    errorProps?: TypographyPresentationProps;
    /** Props to be passed into the hint text's Typography component.
     * @themable */
    hintProps?: TypographyPresentationProps;
    /** Props to be passed into the label's Typography component.
     * @themable */
    labelProps?: TypographyPresentationProps;
    /** Size variants. Default is 40px tall, `small` is 30px tall.
     * @themable */
    sizeVariant?: FormFieldSizeVariant;
    /** The background color of the input.
     * @themable */
    backgroundColor?: string;
}

export interface FormFieldPresentationProps<T> extends FormFieldPresentationPropsCommon {
    /** CSS strings or styled-components functions to be injected into nested components. These will override the theme defaults.
     * @themable */
    cssOverrides?: {
        formInputWrapper?: StyledProp<any>;
        descriptionWrapper?: StyledProp<any>;
        formField?: StyledProp<any>;
        inputSelect?: StyledProp<any>;
    };
}

export type FormFieldProps = FormFieldPresentationProps<FormFieldComponentProps> &
    FormFieldComponentProps &
    ThemeProps<BaseTheme>;

// below "as any" necessary to prevent deep type instantiation errors on `formStyles`
export const FormFieldIcon = styled(Icon)<IconPresentationProps>`
    ${injectCss}
` as any;
export const FormFieldClickable = styled(Clickable)<any>`
    ${injectCss}
`;

/* eslint-disable indent */
const DescriptionWrapper = styled.div<
    InjectableCss<any> & { _sizeVariant: keyof typeof sizeVariantValues; id: string | number }
>`
    display: flex;
    flex-direction: column;
    ${/* sc-selector */ TypographyStyle as any} + ${/* sc-selector */ TypographyStyle as any} {
        margin-top: ${({ _sizeVariant }) => sizeVariantValues[_sizeVariant].descriptionLineSpacing}px;
    }
    ${injectCss}
`;

type FormInputWrapperProps = {
    labelPosition?: LabelPosition;
    _sizeVariant: keyof typeof sizeVariantValues;
    _backgroundColor?: string;
};

export const FormInputWrapper = styled.div<Partial<InjectableCss<any>> & FormInputWrapperProps>`
    width: ${({ labelPosition }) => (labelPosition === "left" ? "calc(100% - 140px)" : "100%")};
    position: relative;
    ${/* sc-selector */ FormFieldIcon},
    ${FormFieldClickable as any} {
        position: absolute;
        box-sizing: border-box;
    }
    ${FormFieldClickable as any} {
        top: 0;
        right: 0;
        width: ${({ _sizeVariant }) => sizeVariantValues[_sizeVariant].height}px;
        height: ${({ _sizeVariant }) => sizeVariantValues[_sizeVariant].height}px;
        padding: ${({ _sizeVariant }) => sizeVariantValues[_sizeVariant].iconPadding}px;
    }
    ${FormFieldIcon} {
        pointer-events: none;
        top: 2px;
        right: 2px;
        width: ${({ _sizeVariant }) => sizeVariantValues[_sizeVariant].height - 4}px;
        height: ${({ _sizeVariant }) => sizeVariantValues[_sizeVariant].height - 4}px;
        padding: ${({ _sizeVariant }) => sizeVariantValues[_sizeVariant].iconPadding - 2}px;
        background: ${({ theme, _backgroundColor }) => resolveColor(_backgroundColor, theme)};
        border-radius: 100%;
    }
    ${injectCss}
`;

type FormFieldLabelProps = InjectableCss<any> & {
    labelSize: FormFieldSizeVariant;
    labelPosition?: LabelPosition;
};

const FormFieldLabel = styled(Typography as any)<any /* FormFieldLabelProps */>`
    min-height: 22px;
    display: inline-block;
    ${({ labelPosition, labelSize }: FormFieldLabelProps) =>
        labelPosition === "left"
            ? `
            width: 140px;
            text-align: right;
            padding: ${sizeVariantValues[labelSize].leftLabelPadding}px 15px 0 0;`
            : "width: 100%;"}
    ${injectCss}
`;

interface FormFieldStyleProps
    extends InjectableCss<any>,
        ThemeProps<BaseTheme>,
        Required<Pick<FormFieldPresentationPropsCommon, "border">> {
    _sizeVariant: FormFieldSizeVariant;
    labelPosition?: LabelPosition;
    error?: React.ReactNode;
    inputSelectCss?: StyledProp<any>;
    _backgroundColor?: string;
}

export const FormFieldStyle = styled.div<FormFieldStyleProps>`
    margin: 0;
    padding: 0;
    border: 0;
    display: inline-flex;
    flex-direction: column;
    flex-direction: ${({ labelPosition }) => (labelPosition === "left" ? "row" : "column")};
    width: 100%;
    ${/* sc-selector */ FormFieldLabel} + ${/* sc-selector */ FormInputWrapper},
    ${/* sc-selector */ FormInputWrapper} > ${DescriptionWrapper} {
        margin-top: ${({ labelPosition, _sizeVariant }) =>
            labelPosition === "left" ? 0 : sizeVariantValues[_sizeVariant].descriptionLineSpacing}px;
    }

    /* Styling for the form element itself */
    input,
    select,
    .mobiusFileUpload {
        height: ${({ _sizeVariant }) => sizeVariantValues[_sizeVariant].height}px;
    }
    input:not(.react-datetime-picker__inputGroup__input),
    select:not(.react-datetime-picker__inputGroup__input),
    textarea,
    .mobiusFileUpload,
    .react-datetime-picker {
        width: 100%;
        box-sizing: border-box;
        padding: 0 10px;
        font-family: inherit;
        font-size: ${({ _sizeVariant }) => sizeVariantValues[_sizeVariant].fontSize}px;
        outline: 0;
        appearance: none;
        color: inherit;
        background: ${({ _backgroundColor, theme }) => resolveColor(_backgroundColor, theme)};
        ${props => borderByState(props, "inactive")}
        &:disabled {
            ${props => disabledByType(props)};
            cursor: not-allowed;
        }
        ${props => {
            if (props.error) {
                return `
                    &:not(:disabled) {
                        ${borderByState(props, "error")}
                    }
                    &:not(:disabled):focus {
                        ${borderByState(props, "focus")}
                    }
                `;
            }
            return `
                &:focus-within {
                    ${borderByState(props, "focus")}
                }
                &:focus, .focus-within {
                    ${borderByState(props, "focus")}
                }
            `;
        }}
        ${({ inputSelectCss }: any) => inputSelectCss}
    }
    input::-ms-clear,
    input::-ms-reveal {
        display: none;
    }
    textarea {
        ${(props: FormFieldStyleProps) => borderByState(props, "inactive", true)}
        ${(props: FormFieldStyleProps) => {
            if (props.error) {
                return `
                        &:not(:disabled) {
                            ${borderByState(props, "error", true)}
                        }
                    `;
            }
            return `
                    &:focus {
                        ${borderByState(props, "focus", true)}
                    }
                `;
        }}
    }
    ${injectCss}
`;
/* eslint-enable indent */

/**
 * Provides styles for form field components. Including `TextField`, `TextArea`, `DatePicker`, `FileUpload`, `Select`,
 * `TokenExFrame` & `DynamicDropdown`.
 */
const FormField: React.ComponentType<FormFieldProps> = ({
    disabled,
    descriptionId,
    error,
    hint,
    formInput,
    inputId,
    label,
    labelId,
    labelPosition,
    required,
    ...otherProps
}) => {
    const { applyProp, spreadProps } = applyPropBuilder(otherProps, { component: "textField", category: "formField" });
    const sizeVariant: FormFieldSizeVariant = applyProp("sizeVariant", "default");
    const cssOverrides = spreadProps("cssOverrides");
    const typographyProps = combineTypographyProps({
        theme: otherProps.theme,
        passedProps: spreadProps("labelProps"),
        defaultProps: {
            ellipsis: labelPosition === "left",
            weight: 600,
            forwardAs: "label",
        },
    });
    const secondaryTextSize = sizeVariantValues[sizeVariant].fontSize;

    let renderLabel;
    if (label === 0 || label) {
        renderLabel = (
            <FormFieldLabel
                {...typographyProps}
                size={typographyProps.size || secondaryTextSize}
                labelSize={sizeVariant}
                labelPosition={labelPosition}
                htmlFor={inputId}
                id={labelId || null}
                data-test-selector={`${(otherProps as any)["data-test-selector"]}-label`}
            >
                {label}
                {required && !disabled && " *"}
            </FormFieldLabel>
        );
    } else if (labelPosition === "left") {
        renderLabel = <div style={{ width: "140px" }} />;
    }

    let renderError;
    if (!disabled && error !== true && (error === 0 || error)) {
        renderError = (
            <Typography
                {...combineTypographyProps({
                    theme: otherProps.theme,
                    passedProps: spreadProps("errorProps"),
                    defaultProps: {
                        size: secondaryTextSize,
                        color: "danger",
                        weight: 600,
                    },
                })}
                data-test-selector={`${(otherProps as any)["data-test-selector"]}-error`}
            >
                {error}
            </Typography>
        );
    }

    let renderHint;
    if (hint === 0 || hint) {
        renderHint = (
            <Typography
                {...combineTypographyProps({
                    theme: otherProps.theme,
                    passedProps: spreadProps("hintProps"),
                    defaultProps: {
                        size: secondaryTextSize,
                        color: "text.accent",
                    },
                })}
            >
                {hint}
            </Typography>
        );
    }

    let description;
    if (renderError || renderHint) {
        description = (
            <DescriptionWrapper
                id={descriptionId as any}
                _sizeVariant={sizeVariant}
                css={cssOverrides?.descriptionWrapper}
            >
                {renderError}
                {renderHint}
            </DescriptionWrapper>
        );
    }

    return (
        <FormFieldStyle
            border={applyProp("border", "underline")}
            _backgroundColor={applyProp("backgroundColor", "common.background")}
            css={cssOverrides?.formField}
            inputSelectCss={cssOverrides?.inputSelect}
            {...{
                disabled,
                error,
                _sizeVariant: sizeVariant,
                labelPosition,
            }}
        >
            {renderLabel}
            <FormInputWrapper
                labelPosition={labelPosition}
                _sizeVariant={sizeVariant}
                css={cssOverrides?.formInputWrapper}
                _backgroundColor={applyProp("backgroundColor")}
            >
                {formInput}
                {description}
            </FormInputWrapper>
        </FormFieldStyle>
    );
};

FormField.defaultProps = {
    labelPosition: "top",
};

/** @component */
export default withTheme(FormField);
