import borderByState, { sizeVariantValues } from "@insite/mobius/FormField/formStyles";
import { BaseTheme } from "@insite/mobius/globals/baseTheme";
import applyPropBuilder from "@insite/mobius/utilities/applyPropBuilder";
import get from "@insite/mobius/utilities/get";

/**
 * Provides a config object that describes the styles of the form field in accordance with the props passed.
 * @param {object} props The Props object of the form component.
 * @param {object} props.theme The site's theme object.
 * @param {object} [props.theme.typography.body.fontFamily] Base font family on the site.
 * @param {string} [props.theme.colors.text.main] Base text color for the site.
 * @param {string} [props.theme.formField.defaultProps.border="underline"] Default FormField border.
 * @param {string} [props.theme.formField.defaultProps.sizeVariant="default"] Default FormField size variant.
 * @param {object} [props.theme.formField.defaultProps.cssOverrides] Default FormField cssOverrides.
 * @param {string} [props.theme.tokenExFrame.defaultProps.border] Default TokenExFrame border.
 * @param {string} [props.theme.tokenExFrame.defaultProps.size] Default TokenExFrame size.
 * @param {object} [props.theme.tokenExFrame.defaultProps.cssOverrides] Default TokenExFrame cssOverrides.
 * @param {string} [props.sizeVariant] The form element's sizeVariant.
 * @param {string} [props.border] The component's border style.
 * @param {object} [props.cssOverrides] The component's css overrides.
 * @return {object} config object describing TokenEx style settings.
 */
export const generateTokenExFrameStyleConfig = (props: {
    theme: BaseTheme;
    sizeVariant?: "default" | "small";
    border?: "underline" | "rectangle" | "rounded";
    cssOverrides?: object;
}) => {
    const { theme } = props;
    const { applyProp, spreadProps } = applyPropBuilder(props, {
        component: "textField",
        category: "formField",
    });
    const border = applyProp("border", "underline");
    const sizeVariant = applyProp("sizeVariant" as any, "default") as keyof typeof sizeVariantValues;
    const cssOverrides = spreadProps("cssOverrides");
    const baseRaw =
        `height: ${sizeVariantValues[sizeVariant].height}px;    ` +
        "width: 100%;    " +
        "box-sizing: border-box;    " +
        "padding: 0 10px;    " +
        `font-family: ${get(theme, "typography.body.fontFamily")};    ` +
        `font-size: ${get(theme, "typography.body.size")};    ` +
        `color: ${get(theme, "colors.text.main")};    ` +
        `${borderByState({ border, _sizeVariant: sizeVariant, theme }, "inactive")}    ` +
        `${cssOverrides.inputSelectCss ? cssOverrides.inputSelectCss : ""}`;
    const base = baseRaw.replace(/(\r\n|\n|\r)/, "");
    const focusRaw = `${borderByState({ border, _sizeVariant: sizeVariant, theme }, "focus")} outline: 0;`;
    const focus = focusRaw.replace(/(\r\n|\n|\r)/, "");
    const errorRaw = borderByState({ border, _sizeVariant: sizeVariant, theme }, "error");
    const error = errorRaw.replace(/(\r\n|\n|\r)/, "");
    return {
        base,
        focus,
        error,
        cvv: {
            base,
            focus,
            error,
        },
    };
};
