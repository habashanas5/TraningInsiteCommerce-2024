import FormField, {
    FormFieldComponentProps,
    FormFieldIcon,
    FormFieldPresentationProps,
    FormFieldSizeVariant,
} from "@insite/mobius/FormField";
import { sizeVariantValues } from "@insite/mobius/FormField/formStyles";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { IconPresentationProps } from "@insite/mobius/Icon";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import { HasDisablerContext, withDisabler } from "@insite/mobius/utilities/DisablerContext";
import InjectableCss, { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import omitMultiple from "@insite/mobius/utilities/omitMultiple";
import uniqueId from "@insite/mobius/utilities/uniqueId";
import * as React from "react";
import styled, { ThemeConsumer } from "styled-components";

export interface SelectPresentationProps extends FormFieldPresentationProps<SelectComponentProps> {
    /** The props for icon displaying on the select.
     * @themable */
    iconProps?: IconPresentationProps;
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp<SelectProps>;
    /**
     * Indicates how the `css` property is combined with the variant `css` property from the theme.
     * If true, the variant css is applied first and then the component css is applied after causing
     * a merge, much like normal CSS. If false, only the component css is applied, overriding the variant css in the theme.
     */
    mergeCss?: boolean;
    /** Background color of the form element */
    backgroundColor?: string;
}

export type SelectComponentProps = MobiusStyledComponentProps<
    "select",
    {
        /** Disables the select box. */
        disabled?: boolean;
        /** Error message to be displayed below the select box. */
        error?: React.ReactNode;
        /** Hint text to be displayed below the select box. */
        hint?: React.ReactNode;
        /**
         * Unique id to be passed into the `<select>` element.
         * If not provided, a random id is assigned (an id is required for accessibility purposes).
         */
        uid?: string;
        /** Label to be displayed above the select box. */
        label?: React.ReactNode;
        /** Handler for the change event. */
        onChange?: React.ChangeEventHandler<HTMLSelectElement>;
        /** Array of strings to choose from. */
        options?: string[];
        /** Placeholder text to be shown when nothing (or the first, null option) has been selected. */
        placeholder?: string;
        /** Adds an asterisk to the label (if provided). */
        required?: boolean;
        /** value of the selected option */
        value?: string | number;
        /** Props to be passed into the inner `<select>` component. */
        selectProps?: object;
        /** reference to the HTML Select element provided by the refWrapper function below */
        selectRef?: React.Ref<HTMLSelectElement>;
        /** Boolean value to prevent having aria-labeledBy when there is an html label with a for attribute */
        hasLabel?: boolean;
    } & Partial<FormFieldComponentProps>
>;

export type SelectProps = SelectPresentationProps & SelectComponentProps;

const SelectStyle = styled.select<InjectableCss>`
    &&&& {
        padding-right: 32px;
        text-overflow: ellipsis;
    }
    ${injectCss}
`;

class Select extends React.Component<SelectProps & HasDisablerContext> {
    static defaultProps = {
        onChange: () => {},
    };

    state = {
        uid: this.props.uid || uniqueId(),
        value: this.props.value,
    };

    UNSAFE_componentWillReceiveProps(nextProps: SelectProps) {
        if (nextProps.value !== this.props.value) {
            this.setState({ value: nextProps.value });
        }
    }

    onChangeWithValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({ value: e.target.value });
        this.props.onChange && this.props.onChange(e);
    };

    render() {
        return (
            <ThemeConsumer>
                {(theme?: BaseTheme) => {
                    const { children, disable, disabled, error, hint, required, hasLabel, ...otherProps } = this.props;

                    // Because disabled html attribute doesn't accept undefined
                    // eslint-disable-next-line no-unneeded-ternary
                    const isDisabled = disable || disabled ? true : false;
                    const { uid } = this.state;
                    const descriptionId = `${uid}-description`;
                    const labelId = `${uid}-label`;
                    const inputLabelObj =
                        otherProps.label === 0 || otherProps.label || !hasLabel ? { "aria-labelledby": labelId } : {};

                    const { spreadProps, applyProp, applyStyledProp } = applyPropBuilder(
                        { theme, ...this.props },
                        { component: "select", category: "formField" },
                    );
                    const iconProps = spreadProps("iconProps");
                    const sizeVariant: FormFieldSizeVariant = applyProp("sizeVariant", "default");
                    const hasDescription = !!error || !!hint;

                    const resolvedMergeCss = this.props.mergeCss ?? theme?.select?.defaultProps?.mergeCss;
                    const selectInput = (
                        <>
                            <SelectStyle
                                id={this.state.uid}
                                aria-describedby={hasDescription ? descriptionId : undefined}
                                aria-invalid={!!error}
                                aria-required={!isDisabled && required}
                                onChange={this.onChangeWithValue}
                                data-selected-index={this.state.value || ""}
                                css={applyStyledProp("css", resolvedMergeCss)}
                                value={this.state.value}
                                ref={this.props.selectRef}
                                {...{ disabled: isDisabled, required }}
                                {...inputLabelObj}
                                {...omitMultiple(otherProps, [
                                    "sizeVariant",
                                    "border",
                                    "label",
                                    "cssOverrides",
                                    "labelPosition",
                                    "labelProps",
                                    "theme",
                                    "backgroundColor",
                                    "dispatch",
                                    "css",
                                ])}
                            >
                                {children}
                            </SelectStyle>
                            <FormFieldIcon
                                {...iconProps}
                                size={sizeVariantValues[sizeVariant].icon}
                                color={isDisabled ? "text.disabled" : iconProps.color || "text.main"}
                            />
                        </>
                    );

                    return (
                        <FormField
                            descriptionId={descriptionId}
                            formInput={selectInput}
                            inputId={this.state.uid}
                            labelId={labelId}
                            disabled={isDisabled}
                            {...this.props}
                        />
                    );
                }}
            </ThemeConsumer>
        );
    }
}

/** @component */

function refWrapper(Component: any) {
    const selectForwardRef = React.forwardRef<HTMLSelectElement, SelectProps & HasDisablerContext>((props, ref) => {
        return <Component {...props} selectRef={ref} />;
    });
    selectForwardRef.displayName = "forwardRef";
    return selectForwardRef;
}

export default withDisabler(refWrapper(Select));
