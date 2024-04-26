import deepFreezeArray from "@insite/client-framework/Common/Utilities/deepFreezeArray";

/**
 * Recursively calls `Object.freeze` on an object and its contents.
 * @param object The object to freeze.
 * @param seen Optional, prevents infinitely recursive loops by tracking objects that have already been frozen.
 */
function deepFreezeObject<T extends object>(object: T, seen?: WeakSet<object>): Readonly<T>;
function deepFreezeObject<T extends object>(object: T | null | undefined, seen?: WeakSet<object>) {
    if (!object) {
        return object; // Preserves null vs. undefined of input.
    }

    if (!seen) {
        seen = new WeakSet();
    }

    const propNames = Object.getOwnPropertyNames(object) as unknown as (keyof T)[];

    for (const name of propNames) {
        const value = object[name] as unknown;

        if (value && typeof value === "object" && !Object.isFrozen(value)) {
            if (value && !seen.has(value)) {
                if (Array.isArray(value)) {
                    deepFreezeArray(value, seen);
                } else {
                    deepFreezeObject(value, seen);
                }
                seen.add(value);
            }
        }
    }

    return Object.freeze(object);
}

export default deepFreezeObject;
