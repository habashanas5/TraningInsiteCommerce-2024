import baseTheme, { BaseTheme } from "@insite/mobius/globals/baseTheme";
import get from "@insite/mobius/utilities/get";

/**
 * Used to translate theme colors into CSS color values.
 * It returns the input value if the color is not found in the theme, ot if no theme is present.
 * @param color The color to pull from the theme. (e.g. "primary")
 * @param theme The theme object to pull the color from. Defaults to the baseTheme.
 */
export default function resolveColor(color = "", theme: BaseTheme) {
    // if the theme is not passed in or invalid, default to baseTheme
    let tempTheme = theme;
    if (typeof theme !== "object" || theme === null || Object.keys(theme).length === 0) {
        tempTheme = baseTheme;
    }

    // return color found via path (e.g. "text.accent")
    const tempColor = get(tempTheme, `colors.${color}`);
    if (typeof tempColor === "string") {
        return tempColor;
    }

    // return color.main if it exists (e.g. "primary")
    const tempResult = get(tempColor, "main");
    if (typeof tempResult === "string") {
        return tempResult;
    }

    // couldn't find color anywhere in the theme, pass it through (e.g. CSS color value)
    return color;
}
