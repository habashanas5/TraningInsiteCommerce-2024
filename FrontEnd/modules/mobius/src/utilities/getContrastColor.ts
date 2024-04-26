import baseTheme, { BaseTheme } from "@insite/mobius/globals/baseTheme";
import resolveColor from "@insite/mobius/utilities/resolveColor";
import safeColor from "@insite/mobius/utilities/safeColor";
import Color from "color";

/**
 * Reaches into the theme to evaluate whether there is a contrast color defined for the element. If not, returns
 * black or white based on the darkness of the color.
 * @param {string} color The color to pull contrast color for from the theme. (e.g. "primary").
 * @param {object} theme The theme object to pull the color from. Defaults to the baseTheme.
 */

export default function getContrastColor(color: Parameters<typeof Color>[0], passedTheme?: BaseTheme) {
    const theme = passedTheme || baseTheme;
    try {
        const thisColor = resolveColor(`${color}.contrast`, theme);
        Color(thisColor);
        return thisColor;
    } catch (e) {
        try {
            const thisColor = resolveColor(`${color}Contrast`, theme);
            Color(thisColor);
            return thisColor;
        } catch (err) {
            const { light, dark } = safeColor(resolveColor("common.background", theme)).isLight()
                ? { light: "common.background", dark: "common.backgroundContrast" }
                : { light: "common.background", dark: "common.backgroundContrast" };
            return safeColor(resolveColor(color as any, theme)).isLight()
                ? resolveColor(dark, theme)
                : resolveColor(light, theme);
        }
    }
}
