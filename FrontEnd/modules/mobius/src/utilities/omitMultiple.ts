export default function omitMultiple<T extends {}, Removed extends keyof T>(
    object: T,
    keys: Readonly<Removed[]>,
): Omit<T, Removed> {
    const result = { ...object };
    for (const key of keys) {
        delete result[key];
    }

    return result;
}
