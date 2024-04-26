import deepFreezeObject from "@insite/client-framework/Common/Utilities/deepFreezeObject";

/**
 * Recursively calls `Object.freeze` on the entries of an array and its contents.
 * @param object The object to freeze.
 * @param seen Optional, prevents infinitely recursive loops by tracking objects that have already been frozen.
 */
function deepFreezeArray<T>(array: T[], seen?: WeakSet<object>): readonly T[];
function deepFreezeArray<T>(array: T[] | null | undefined, seen?: WeakSet<object>) {
    if (!array) {
        return array; // Preserves null vs. undefined of input.
    }

    if (!seen) {
        seen = new WeakSet();
    }

    for (const value of array as unknown[]) {
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

    return Object.freeze(array);
}

export default deepFreezeArray;
