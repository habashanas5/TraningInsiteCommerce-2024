import Color from "color";

/**
 * Safeguard around the Color library, which throws an error when an invalid color value is passed into it.
 * @param {*} color Usually a CSS color value as a string, but objects and arrays are also valid. See https://github.com/Qix-/color#constructors
 */
export default function safeColor(color: Parameters<typeof Color>[0]) {
    try {
        return Color(color);
    } catch (e) {
        return Color("black");
    }
}
