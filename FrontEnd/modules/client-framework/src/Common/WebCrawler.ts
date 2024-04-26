import { getSSRIsWebCrawler, setSSRIsWebCrawler } from "@insite/client-framework/ServerSideRendering";

let isWebCrawler: boolean;

export function setIsWebCrawler(value: boolean) {
    if (IS_SERVER_SIDE) {
        setSSRIsWebCrawler(value);
    } else {
        isWebCrawler = value;
    }
}

export function getIsWebCrawler() {
    if (IS_SERVER_SIDE) {
        return getSSRIsWebCrawler();
    }
    return isWebCrawler;
}

export function checkIsWebCrawler(userAgent: string): boolean {
    const botString = /bot|crawler|baiduspider|80legs|ia_archiver|voyager|curl|wget|yahoo! slurp|mediapartners-google/;
    const regExp = new RegExp(botString, "i");
    return regExp.test(userAgent);
}
