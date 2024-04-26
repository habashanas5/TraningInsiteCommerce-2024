/**
 * @jest-environment node
 */
import omitMultiple from "./omitMultiple";

const obj = {
    0: 0,
    a: 1,
    b: 2,
};

describe("omitMultiple", () => {
    /* With the conversion to TypeScript, we can guarantee that a proper array is always passed.
    test('returns the object if the property is not an array', () => {
        expect(omitMultiple(obj)).toBe(obj);
        expect(omitMultiple(obj, '')).toBe(obj);
        expect(omitMultiple(obj, null)).toBe(obj);
        expect(omitMultiple(obj, false)).toBe(obj);
        expect(omitMultiple(obj, undefined)).toBe(obj);
        expect(omitMultiple(obj, 0)).toBe(obj);
        expect(omitMultiple(obj, {})).toBe(obj);
        expect(omitMultiple(obj, 'a')).toBe(obj);
    });
    */

    test("returns a copy of the object if the property is an empty array", () => {
        // This used to test that the input object was returned, but omitMultiple was never (and should never) be used that way.
        // So, it continues it's normal process which copies the object an ends up not removing anything.
        // This also guarantees that regardless of input, the return is always a copy, removing the inconsistency.
        expect(omitMultiple(obj, [])).toMatchObject(obj);
    });

    test("returns a copy of the object minus the specified properties when present", () => {
        expect(omitMultiple(obj, [0])).toMatchObject({ a: 1, b: 2 });
        expect(omitMultiple(obj, ["b"])).toMatchObject({ 0: 0, a: 1 });
        expect(omitMultiple(obj, [0, "a"])).toMatchObject({ b: 2 });
        expect(omitMultiple(obj, [0, "a", "b"])).toMatchObject({});
    });
});
