import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import { TypographyPresentationProps } from "@insite/mobius/Typography";
import get from "@insite/mobius/utilities/get";

interface Arguments {
    theme: BaseTheme;
    passedProps?: TypographyPresentationProps;
    defaultProps?: TypographyPresentationProps;
}

// export default function combineTypographyProps(Arguments): TypographyPresentationProps;

/**
 * Provides a function to combine typographyProps on a component, including props provided by variants.
 * The cascade of styling implemented here is as follows:
 *  - any prop that is directly passed will override any other prop.
 *  - a variant that is passed will override a default variant, and attributes of the passed variant will override default props and default variant attributes.
 *  - a default prop will override default variant attributes, but will be overriden by attributes of a passed variant or any passed prop.
 *  - default variant will be used if it is not overriden by a passed variant. Attributes of a default variant can be overriden by any prop, default or passed.
 * @param {object} arguments Arguments object passed to function.
 * @param {object} arguments.theme Theme object.
 * @param {object} [arguments.defaultProps] Props provided by the component implementation.
 * ie `color="blue"` in `<Typography color='blue' {...labelTypographyProps} />` in `FormField.js`.
 * @param {object} [arguments.defaultProps.variant] Props provided by the component implementation.
 * ie `'h2'` in `<Typography variant='h2' {...labelTypographyProps} />` in `FormField.js`.
 * @param {object} [arguments.passedProps] Typography props passed during component use
 * ie `labelTypographyProps` in `<FormField labelTypographyProps={{variant: 'label', italic: true}} />`.
 * @param {object} [arguments.passedProps.variant] Typography props passed during component use
 * ie `'label'` in `<FormField labelTypographyProps={{variant: 'label', italic: true}} />`.
 * @return {object} props combined from variant, default and passed props.
 */
export default function combineTypographyProps({
    theme,
    defaultProps: { variant: defaultVariant, ...defaultOtherProps } = {},
    passedProps: { variant: passedVariant, ...passedOtherProps } = {},
}: Arguments): TypographyPresentationProps {
    const passedVariantProps = get(theme, ["typography", passedVariant], {});
    const defaultVariantProps = get(theme, ["typography", defaultVariant], {});

    const combinedProps = passedVariant
        ? {
              ...defaultOtherProps,
              ...passedVariantProps,
              ...passedOtherProps,
          }
        : {
              ...defaultVariantProps,
              ...defaultOtherProps,
              ...passedOtherProps,
          };

    // css?
    // variant on the defaultprops?
    return combinedProps;
}
