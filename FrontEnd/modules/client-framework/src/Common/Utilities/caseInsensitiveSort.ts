export default function caseInsensitiveSort<T extends Record<K, string>, K extends PropertyKey>(
    values: T[],
    property: K,
) {
    return values.concat().sort((a, b) => a[property].localeCompare(b[property], "en", { sensitivity: "base" }));
}
