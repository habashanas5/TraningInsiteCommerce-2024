import parseQueryString from "@insite/client-framework/Common/Utilities/parseQueryString";

const parseQueryStringCaseInsensitive = <T>(search: string, result: T): T => {
    const parsedObject = parseQueryString<T>(search);
    const properties = new Map();
    let resultProperty: string;
    Object.keys(result).forEach(o => properties.set(o.toLowerCase(), o));
    for (const property in parsedObject) {
        resultProperty = properties.get(property.toLowerCase());
        if (resultProperty) {
            result[resultProperty as keyof T] = parsedObject[property];
        }
    }
    return result;
};

export default parseQueryStringCaseInsensitive;
