import { TypographyPresentationProps } from "@insite/mobius/Typography";
import { StyledProp } from "@insite/mobius/utilities/InjectableCss";

// A subset of fieldset props that could reasonably be used to determine theme css based on the value of the prop.
export interface FieldSetPropsMock {
    disabled?: boolean;
}

interface FieldSetLabelProps extends TypographyPresentationProps {
    errorColor?: string;
    disabledColor?: string;
}

export default interface FieldSetPresentationProps<T> {
    /** The background color of the checkbox.
     * @themable */
    color?: string;
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp<T>;
    /**
     * Indicates how the `css` property is combined with the variant `css` property from the theme.
     * If true, the variant css is applied first and then the component css is applied after causing
     * a merge, much like normal CSS. If false, only the component css is applied, overriding the variant css in the theme.
     */
    mergeCss?: boolean;
    /** Props to be passed into the inner Typography component (label).
     * @themable */
    typographyProps?: FieldSetLabelProps;
}

export interface FieldSetGroupPresentationProps<T = {}> {
    /** CSS string or styled-components function to be injected into this component.
     * @themable */
    css?: StyledProp<T>;
    /**
     * Indicates how the `css` property is combined with the variant `css` property from the theme.
     * If true, the variant css is applied first and then the component css is applied after causing
     * a merge, much like normal CSS. If false, only the component css is applied, overriding the variant css in the theme.
     */
    mergeCss?: boolean;
    /** Props to be passed into the label's Typography component.
     * @themable */
    labelProps?: TypographyPresentationProps;
    /** Props to be passed into the error message's Typography component.
     * @themable */
    errorProps?: TypographyPresentationProps;
    /** Size variant.
     * @themable */
    sizeVariant?: "default" | "small";
}
