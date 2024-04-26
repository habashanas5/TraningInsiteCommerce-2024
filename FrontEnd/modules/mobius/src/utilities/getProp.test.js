/**
 * @jest-environment node
 */
import getProp from "./getProp";

describe("getProp", () => {
    const obj = {
        parent: {
            child: {
                value: [25, "6 to 4"],
            },
        },
    };

    test("returns a function that accepts a props argument", () => {
        const returnValue = getProp("hiya");
        expect(typeof returnValue).toBe("function");
        expect(returnValue({ moose: "hiya" })).toBe(undefined);
    });
    describe("when return function called", () => {
        test("returns the prop value as described in the path, when not a theme path", () => {
            const returnFunction = getProp("color");
            expect(returnFunction({ color: "hiya" })).toBe("hiya");
        });
        test("returns the props.theme value as described in the path", () => {
            const returnFunction = getProp("theme.moose");
            expect(returnFunction({ theme: { moose: "blammo" } })).toBe("blammo");
        });
        test("handles default argument appropriately", () => {
            const returnFunction = getProp("theme.moose", "cowlandia");
            expect(returnFunction({ theme: { moose: "blammo" } })).toBe("blammo");
            expect(returnFunction({ theme: { color: "blammo" } })).toBe("cowlandia");
        });
        test("returns undefined if path describes an undefined or empty prop", () => {
            const returnFunction = getProp("moose");
            expect(returnFunction({ color: "hiya" })).toBe(undefined);
            expect(returnFunction({ moose: null })).toBe(undefined);
        });
        test("fallback on global theme", () => {
            const returnFunction = getProp("theme.transition.duration.long");
            expect(returnFunction({ theme: { transition: { duration: { short: "blammo" } } } })).toBe(500);
        });
        test("returns undefined if no value in props, local theme, or global theme", () => {
            const returnFunction = getProp("theme.transition.duration.extraLong");
            expect(returnFunction({ theme: { transition: { duration: { short: "blammo" } } } })).toBe(undefined);
        });
    });
});
