/**
 * @jest-environment node
 */
import baseTheme from "../globals/baseTheme";
import breakpointMediaQueries from "./breakpointMediaQueries";

describe("breakpointMediaQueries", () => {
    const mockTheme = { breakpoints: { values: [0, 1111, 2222, 3333, 4444] } };
    const randomText = () => Math.random().toString(36).replace(/\d|\./g, "");
    const mockRules = baseTheme.breakpoints.values.map(randomText);

    test("returns an empty string if called with no arguments", () => {
        expect(breakpointMediaQueries()).toBe("");
    });

    test("uses the baseTheme if no theme is passed in", () => {
        const mediaQueries = breakpointMediaQueries(undefined, mockRules);
        baseTheme.breakpoints.values.forEach(value => {
            expect(mediaQueries.includes(value)).toBe(true);
        });
    });

    test("uses the theme breakpoints when passed in", () => {
        const mediaQueries = breakpointMediaQueries(mockTheme, mockRules);
        mockTheme.breakpoints.values.forEach((value, index) => {
            if (index) expect(mediaQueries.includes(value)).toBe(true); // skip 1st value
        });
    });

    test("returns a string containing values in the rules array", () => {
        const mediaQueries = breakpointMediaQueries(undefined, mockRules);
        mockRules.forEach(rule => {
            expect(mediaQueries.includes(rule)).toBe(true);
        });
    });

    describe("returns correct values based on option", () => {
        test("minMax", () => {
            const mediaQueries = breakpointMediaQueries(undefined, mockRules);
            mockRules.forEach(rule => {
                expect(mediaQueries.includes(rule)).toBe(true);
            });
            expect(mediaQueries.includes("max-width")).toBe(true);
            expect(mediaQueries.includes("min-width")).toBe(true);
        });

        test("min", () => {
            const mockMinRules = [mockRules[0], null, null, mockRules[1], null];
            const mediaQueries = breakpointMediaQueries(undefined, mockMinRules, "min");
            expect(mediaQueries.includes(mockMinRules[0])).toBe(true);
            expect(mediaQueries.includes(mockMinRules[3])).toBe(true);
            expect(mediaQueries.includes("max-width")).toBe(false);
            expect(mediaQueries.includes("min-width")).toBe(true);
        });

        test("max", () => {
            const mockMaxRules = [null, mockRules[0], null, null, mockRules[1]];
            const mediaQueries = breakpointMediaQueries(undefined, mockMaxRules, "max");
            expect(mediaQueries.includes(mockMaxRules[1])).toBe(true);
            expect(mediaQueries.includes(mockMaxRules[4])).toBe(true);
            expect(mediaQueries.includes("max-width")).toBe(true);
            expect(mediaQueries.includes("min-width")).toBe(false);
        });
    });
});
