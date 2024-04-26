/**
 * @jest-environment node
 */
import omitSingle from "./omitSingle";

const obj = {
    0: 0,
    a: 1,
    b: 2,
};

describe("omitSingle", () => {
    test("returns the object if the property is nullish", () => {
        expect(omitSingle(obj)).toBe(obj);
        expect(omitSingle(obj, "")).toBe(obj);
        expect(omitSingle(obj, null)).toBe(obj);
        expect(omitSingle(obj, false)).toBe(obj);
        expect(omitSingle(obj, undefined)).toBe(obj);
    });

    test("returns the object if the property is not present", () => {
        expect(omitSingle(obj, 1)).toBe(obj);
        expect(omitSingle(obj, "x")).toBe(obj);
    });

    test("returns a copy of the object minus the specified property when present", () => {
        expect(omitSingle(obj, 0)).toMatchObject({ a: 1, b: 2 });
        expect(omitSingle(obj, "b")).toMatchObject({ 0: 0, a: 1 });
    });
});
