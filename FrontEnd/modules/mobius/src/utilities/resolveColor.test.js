/**
 * @jest-environment node
 */
import baseTheme from "../globals/baseTheme";
import resolveColor from "./resolveColor";

describe("resolveColor", () => {
    test("defaults to the baseTheme when theme is an empty object or null", () => {
        const color = "primary";
        const test1 = resolveColor(color, {});
        expect(test1).toBe(baseTheme.colors[color].main);

        const test2 = resolveColor(color, null);
        expect(test2).toBe(baseTheme.colors[color].main);
    });

    test("looks for the color in the baseTheme when the second argument is undefined", () => {
        const color = "primary";
        const test = resolveColor(color);
        expect(test).toBe(baseTheme.colors[color].main);
    });

    test("returns the first argument when it is not a property of theme.colors", () => {
        const color = "not-a-color";
        const test = resolveColor(color);
        expect(test).toBe(color);
    });

    test("returns color values set at the root of theme.colors", () => {
        const colorName = "TEMP";
        const colorValue = "#012345";
        baseTheme.colors[colorName] = colorValue;
        const test = resolveColor(colorName);
        expect(test).toBe(colorValue);
        delete baseTheme.colors[colorName];
    });

    test('returns the "main" value of a valid theme color', () => {
        const colorName = "primary";
        const colorValue = baseTheme.colors[colorName].main;
        const test = resolveColor(colorName);
        expect(test).toBe(colorValue);
    });

    test('returns the first argument when the "main" value does not exist', () => {
        const colorName = "gray";
        const test = resolveColor(colorName);
        expect(test).toBe(colorName);
    });
});
