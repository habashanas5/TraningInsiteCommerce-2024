export interface Dictionary<T> {
    [key: string]: T;
}

/** `Dictionary`, but without assuming lookups will always find an item. */
export type SafeDictionary<T> = Dictionary<T | undefined>;

const cacheMap = new WeakMap<object, SafeDictionary<any>>();
export function getValueCaseInsensitive<T>(dictionary: SafeDictionary<T>, key: string) {
    let lowerCasedDictionary = cacheMap.get(dictionary);
    if (!lowerCasedDictionary) {
        lowerCasedDictionary = {};
        for (const key of Object.keys(dictionary)) {
            lowerCasedDictionary[key.toLowerCase()] = dictionary[key];
        }
        cacheMap.set(dictionary, lowerCasedDictionary);
    }

    return lowerCasedDictionary[key.toLowerCase()];
}

export type DeepWriteable<T> = { -readonly [P in keyof T]: DeepWriteable<T[P]> };
