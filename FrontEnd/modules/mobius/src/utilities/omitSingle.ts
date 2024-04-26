export default function omitSingle<T extends {}, Removed extends keyof T>(object: T, key?: Removed): Omit<T, Removed> {
    if (key === null || key === undefined || !(key in object)) {
        return object;
    }
    const { [key]: deleted, ...rest } = object;
    return rest;
}
