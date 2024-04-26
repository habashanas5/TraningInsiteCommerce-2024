import FormField, { FormFieldComponentProps, FormFieldPresentationProps } from "@insite/mobius/FormField";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import { HasDisablerContext, withDisabler } from "@insite/mobius/utilities/DisablerContext";
import InjectableCss, { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import omitMultiple from "@insite/mobius/utilities/omitMultiple";
import uniqueId from "@insite/mobius/utilities/uniqueId";
import * as React from "react";
import styled, { withTheme } from "styled-components";

export interface TextAreaPresentationProps extends FormFieldPresentationProps<TextAreaComponentProps> {
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp<TextAreaComponentProps>;
    /**
     * Indicates how the `css` property is combined with the variant `css` property from the theme.
     * If true, the variant css is applied first and then the component css is applied after causing
     * a merge, much like normal CSS. If false, only the component css is applied, overriding the variant css in the theme.
     */
    mergeCss?: boolean;
}

export type TextAreaComponentProps = MobiusStyledComponentProps<
    "textarea",
    {
        /** Error message to be displayed below the textarea. */
        error?: React.ReactNode;
        /** Hint text to be displayed below the textarea. */
        hint?: React.ReactNode;
        /** Label to be displayed above the textarea. */
        label?: React.ReactNode;
    } & Partial<FormFieldComponentProps>
>;

export type TextAreaProps = TextAreaComponentProps & TextAreaPresentationProps;

export const TextAreaStyle = styled.textarea<InjectableCss>`
    ${injectCss}
`;

/**
 * TextArea is a form element with an optional label, hint text, error message and optional icon.
 * Props not contained in the list below get passed into the input component (e.g. event handlers, `value`, etc).
 */
const TextArea: React.FC<TextAreaProps & HasDisablerContext> = withTheme(props => {
    const { disable, disabled, error, hint, id, placeholder, required, mergeCss, ...otherProps } = props;

    const { applyStyledProp } = applyPropBuilder(otherProps, { component: "textArea", category: "formField" });

    const isDisabled = !!(disable || disabled);
    const inputId = id || uniqueId();
    const labelId = `${inputId}-label`;
    const inputLabelObj = otherProps.label === 0 || otherProps.label ? { "aria-labelledby": labelId } : {};
    const descriptionId = `${inputId}-description`;
    const hasDescription = error || hint;

    const resolvedMergeCss = mergeCss ?? otherProps?.theme?.textArea?.defaultProps?.mergeCss;

    const TextArea = React.useMemo(
        () => (
            <TextAreaStyle
                {...omitMultiple(otherProps, ["sizeVariant", "border", "label", "backgroundColor", "cssOverrides"])}
                {...{ disabled: isDisabled, placeholder, required }}
                {...inputLabelObj}
                css={applyStyledProp("css", resolvedMergeCss)}
                id={inputId}
                aria-describedby={hasDescription ? descriptionId : undefined}
                aria-invalid={!!error}
                aria-required={!disabled && required}
                tabIndex={0}
            />
        ),
        [
            isDisabled,
            placeholder,
            required,
            otherProps,
            inputId,
            inputLabelObj,
            hasDescription,
            descriptionId,
            error,
            disabled,
            required,
        ],
    );

    return (
        <FormField
            {...props}
            descriptionId={descriptionId}
            disabled={isDisabled}
            formInput={TextArea}
            labelId={labelId}
            inputId={inputId}
        />
    );
});

TextArea.defaultProps = {
    rows: 4,
};

/** @component */
export default withDisabler(TextArea);
