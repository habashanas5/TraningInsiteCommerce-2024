import qs from "qs";

interface Params {
    url: string;
    width: number;
    height: number;
}

export default function formatUrlWithWidthAndHeight({ url, width, height }: Params) {
    if (!url || !width || !height) {
        return url;
    }

    const queryStrings = /\?.*/.exec(url);

    if (queryStrings) {
        const obj = qs.parse(queryStrings[0], { ignoreQueryPrefix: true });

        if (obj.width || obj.height) {
            return `${url.slice(0, queryStrings.index)}?${qs.stringify({ ...obj, width, height })}`;
        }

        return `${url}&width=${width}&height=${height}`;
    }
    return `${url}?width=${width}&height=${height}`;
}
