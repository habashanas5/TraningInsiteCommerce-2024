function getThroughPathArray(object = {}, pathArray: (string | number | undefined)[], defaultValue: any) {
    if (!pathArray) {
        return object;
    }
    try {
        if (pathArray.length === 1) {
            return (object as any)[pathArray[0] as any];
        }
        const value = pathArray.reduce((result, key) => (result as any)[key as any], object);
        if (value === undefined) {
            return defaultValue;
        }
        return value;
    } catch (err) {
        return defaultValue;
    }
}

/**
 * Naive implementation of lodash `get`. Gets the value at `path` of `object`.
 * @param {Object} object The object to query.
 * @param {string|number|(string|number)[]} path The path of the property to get.
 * @param {*} defaultValue The value returned for `undefined` resolved values.
 */
export default function get(
    object: any = {},
    path?: string | number | undefined | (string | number | undefined)[],
    defaultValue?: any,
) {
    if (path === "" || path === null || path === undefined) {
        return defaultValue;
    }
    if (Array.isArray(path)) {
        return getThroughPathArray(object, path, defaultValue);
    }
    const pathArray = `${path}`.split(".");
    return getThroughPathArray(object, pathArray, defaultValue);
}
