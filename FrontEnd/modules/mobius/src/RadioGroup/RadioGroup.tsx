import { checkboxSizes } from "@insite/mobius/Checkbox";
import { RadioStyle } from "@insite/mobius/Radio";
import RadioGroupContext from "@insite/mobius/RadioGroup/RadioGroupContext";
import Typography from "@insite/mobius/Typography";
import TypographyStyle from "@insite/mobius/Typography/TypographyStyle";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import { FieldSetGroupPresentationProps } from "@insite/mobius/utilities/fieldSetProps";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";
import injectCss from "@insite/mobius/utilities/injectCss";
import MobiusStyledComponentProps from "@insite/mobius/utilities/MobiusStyledComponentProps";
import omitMultiple from "@insite/mobius/utilities/omitMultiple";
import uniqueId from "@insite/mobius/utilities/uniqueId";
import * as React from "react";
import styled, { css, withTheme } from "styled-components";

export interface RadioGroupPresentationProps {
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp<RadioGroupProps>;
    /**
     * Indicates how the `css` property is combined with the variant `css` property from the theme.
     * If true, the variant css is applied first and then the component css is applied after causing
     * a merge, much like normal CSS. If false, only the component css is applied, overriding the variant css in the theme.
     */
    mergeCss?: boolean;
    /**
     * Controls the alignment of the Radio children.
     * Defaults to vertical alignment.
     */
    horizontal?: boolean;
}

export type RadioGroupComponentProps = MobiusStyledComponentProps<
    "fieldset",
    {
        /** Indicates an error by changing the color of the radiogroup label. */
        error?: React.ReactNode;
        /** Label to be displayed above the radio group. */
        label?: React.ReactNode;
        /** Handler for the change event shared by the radio inputs within this radio group. */
        onChangeHandler?: React.ChangeEventHandler<HTMLInputElement>;
        /** Sets the value of the RadioGroup. */
        value?: string;
        required?: boolean;
        name?: string;
    }
>;

export type RadioGroupProps = FieldSetGroupPresentationProps<RadioGroupComponentProps> &
    RadioGroupComponentProps &
    RadioGroupPresentationProps;

const RadioGroupStyle = styled.fieldset<{ horizontal?: boolean }>`
    border: 0;
    padding: 0;
    margin: 0;

    & > ${TypographyStyle as any} {
        padding: 0;
        margin-bottom: 10px;
    }
    ${props =>
        props.horizontal
            ? css`
                  display: inline-block;
                  & > ${RadioStyle} {
                      display: inline-block;
                      margin-top: 5px;
                      margin-right: 20px;
                  }
              `
            : css`
                  display: flex;
                  flex-direction: column;
                  ${RadioStyle} + ${RadioStyle} {
                      margin-top: 10px;
                  }
              `}
    ${injectCss}
`;

type State = {
    value?: string;
    name?: string;
};

class RadioGroup extends React.Component<RadioGroupProps, State> {
    state: State = {
        value: this.props.value,
    };

    static getDerivedStateFromProps(nextProps: RadioGroupProps, prevState: State) {
        const nextState: State = {
            name: nextProps.name || (prevState && prevState.name) || uniqueId(),
        };
        if (nextProps.value !== prevState.value) {
            nextState.value = nextProps.value;
        }
        return nextState;
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ value: e.target.value });
        this.props.onChangeHandler?.(e);
    };

    render() {
        const { children, error, label, mergeCss, required, horizontal, ...otherProps } = this.props;
        const { applyProp, spreadProps, applyStyledProp } = applyPropBuilder(this.props, {
            component: "radio",
            category: "fieldSet",
            propKey: "groupDefaultProps",
        });
        const sizeVariant = applyProp("sizeVariant", "default") as keyof typeof checkboxSizes;

        const resolvedMergeCss = mergeCss ?? this.props?.theme?.radio?.groupDefaultProps?.mergeCss;

        return (
            <RadioGroupContext.Provider
                value={{
                    name: this.state.name,
                    value: this.state.value,
                    sizeVariant,
                    onChange: this.handleChange,
                }}
            >
                <RadioGroupStyle
                    {...omitMultiple(otherProps, ["sizeVariant", "onChangeHandler"])}
                    horizontal={horizontal}
                    css={applyStyledProp("css", resolvedMergeCss)}
                >
                    {String(label) && (
                        <Typography
                            {...spreadProps("labelProps")}
                            as="legend"
                            weight={600}
                            size={checkboxSizes[sizeVariant].fontSize}
                        >
                            {label}
                            {required && " *"}
                        </Typography>
                    )}
                    {children}
                    {String(error) && (
                        <Typography
                            {...spreadProps("errorProps")}
                            color="danger"
                            weight={600}
                            size={checkboxSizes[sizeVariant].fontSize}
                        >
                            {error}
                        </Typography>
                    )}
                </RadioGroupStyle>
            </RadioGroupContext.Provider>
        );
    }
}

/** @component */
export default withTheme(RadioGroup);

export { RadioGroupStyle };
