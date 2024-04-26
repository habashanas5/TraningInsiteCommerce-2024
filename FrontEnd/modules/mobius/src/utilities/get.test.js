/**
 * @jest-environment node
 */
import get from "./get";

describe("get", () => {
    const obj = {
        parent: {
            child: {
                value: [25, "6 to 4"],
            },
        },
    };

    test("returns the defaultValue if second argument is empty, null or undefined", () => {
        const defaultValue = { a: 1 };
        expect(get(obj, "")).toBeUndefined();
        expect(get(obj, null)).toBeUndefined();
        expect(get(obj)).toBeUndefined();
        expect(get(obj, "", defaultValue)).toBe(defaultValue);
        expect(get(obj, null, defaultValue)).toBe(defaultValue);
        expect(get(obj, undefined, defaultValue)).toBe(defaultValue);
    });

    test("returns object[path] when the path is a string without dots", () => {
        expect(get(obj, "parent")).toBe(obj.parent);
    });

    test("returns object[path] when the path is a number", () => {
        expect(get(obj.parent.child.value, 0)).toBe(obj.parent.child.value[0]);
    });

    test("returns object[path] when the path is a string with dots", () => {
        expect(get(obj, "parent.child")).toBe(obj.parent.child);
        expect(get(obj, "parent.child.value.0")).toBe(obj.parent.child.value[0]);
    });

    test("returns object[path] when the path is an array", () => {
        expect(get(obj, ["parent", "child"])).toBe(obj.parent.child);
        expect(get(obj, ["parent", "child", "value", 0])).toBe(obj.parent.child.value[0]);
    });

    test("returns undefined when the path is not valid", () => {
        expect(get(obj, "1234")).toBeUndefined();
        expect(get(obj, 1234)).toBeUndefined();
        expect(get(obj, "parent.1234")).toBeUndefined();
        expect(get(obj, ["parent", 1234])).toBeUndefined();
    });
});
