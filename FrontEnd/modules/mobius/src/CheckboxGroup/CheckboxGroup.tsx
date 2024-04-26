import { checkboxSizes, CheckboxStyle } from "@insite/mobius/Checkbox";
import CheckboxGroupContext from "@insite/mobius/CheckboxGroup/CheckboxGroupContext";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import Typography from "@insite/mobius/Typography";
import TypographyStyle from "@insite/mobius/Typography/TypographyStyle";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import { FieldSetGroupPresentationProps } from "@insite/mobius/utilities/fieldSetProps";
import InjectableCss, { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import omitMultiple from "@insite/mobius/utilities/omitMultiple";
import uniqueId from "@insite/mobius/utilities/uniqueId";
import * as React from "react";
import styled, { ThemeProps, withTheme } from "styled-components";

export interface CheckboxGroupPresentationProps {
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp<CheckboxGroupProps>;
    /**
     * Indicates how the `css` property is combined with the variant `css` property from the theme.
     * If true, the variant css is applied first and then the component css is applied after causing
     * a merge, much like normal CSS. If false, only the component css is applied, overriding the variant css in the theme.
     */
    mergeCss?: boolean;
}

export type CheckboxGroupComponentProps = MobiusStyledComponentProps<
    "fieldset",
    {
        /** Error message to be displayed below the CheckboxGroup. */
        error?: React.ReactNode;
        /** Label to be displayed above the CheckboxGroup. */
        label?: React.ReactNode;
        /** Adds an asterisk to the label (if provided). */
        required?: boolean;
        uid?: string;
    }
>;

export type CheckboxGroupProps = FieldSetGroupPresentationProps<CheckboxGroupComponentProps> &
    CheckboxGroupComponentProps &
    CheckboxGroupPresentationProps;

const CheckboxGroupStyle = styled.fieldset<InjectableCss>`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border: 0;
    padding: 0;
    margin: 0;
    & > ${TypographyStyle as any} {
        padding: 0;
        &:first-child {
            margin-bottom: 10px;
        }
        &:last-child {
            margin-top: 10px;
        }
    }
    ${/* sc-selector */ CheckboxStyle} + ${/* sc-selector */ CheckboxStyle} {
        margin-top: 10px;
    }
    [data-checkbox-only] {
        margin-top: 4px;
    }
    ${injectCss}
`;

/**
 * CheckboxGroup provides spacing and alignment styling for multiple checkboxes in a form group, as well as providing
 * a label for the group of inputs and functionality for when the checkbox is required.
 */
class CheckboxGroup extends React.Component<CheckboxGroupProps & ThemeProps<BaseTheme>> {
    state = { uid: this.props.uid || uniqueId() };

    render() {
        const { children, error, label, required, mergeCss, ...otherProps } = this.props;

        const { applyProp, spreadProps, applyStyledProp } = applyPropBuilder(this.props, {
            component: "checkbox",
            category: "fieldSet",
            propKey: "groupDefaultProps",
        });

        const sizeVariant = applyProp("sizeVariant", "default") as Required<
            Pick<CheckboxGroupProps, "sizeVariant">
        >["sizeVariant"];

        const labelProps: { "aria-labelledby"?: string; as?: "div" } = {
            "aria-labelledby": this.state.uid,
            as: typeof children === "object" ? "div" : undefined,
        };

        const resolvedMergeCss = mergeCss ?? this.props?.theme?.checkbox?.groupDefaultProps?.mergeCss;

        return (
            <CheckboxGroupStyle
                {...labelProps}
                {...omitMultiple(otherProps, ["uid", "sizeVariant", "css"])}
                css={applyStyledProp("css", resolvedMergeCss)}
                role="group"
            >
                {String(label) && (
                    <Typography
                        as="legend"
                        weight={600}
                        size={checkboxSizes[sizeVariant].fontSize}
                        id={this.state.uid}
                        {...spreadProps("labelProps" as any)}
                    >
                        {label}
                        {required && " *"}
                    </Typography>
                )}
                <CheckboxGroupContext.Provider
                    value={{
                        sizeVariant,
                    }}
                >
                    {children}
                </CheckboxGroupContext.Provider>
                {String(error) && (
                    <Typography
                        color="danger"
                        weight={600}
                        size={checkboxSizes[sizeVariant].fontSize}
                        {...spreadProps("errorProps" as any)}
                    >
                        {error}
                    </Typography>
                )}
            </CheckboxGroupStyle>
        );
    }
}

/** @component */
export default withTheme(CheckboxGroup);

export { CheckboxGroupStyle };
