import qs from "qs";

const parseQueryString = <T>(search: string): T => {
    if (search.startsWith("?")) {
        search = search.replace("?", "");
    }
    return qs.parse(search) as T;
};

export default parseQueryString;
