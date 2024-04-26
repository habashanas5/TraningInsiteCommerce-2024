import { getUrl } from "@insite/client-framework/ServerSideRendering";

export default function throwErrorIfTesting() {
    const url = getUrl();
    const windowIfDefined = typeof window === "undefined" ? null : window;
    const href = (url ? url.toString() : windowIfDefined?.location.href)?.toLowerCase() || "";
    const testingErrorsParamIndex = href.indexOf("testingerrors") - 1;

    if (
        testingErrorsParamIndex > 0 &&
        (href[testingErrorsParamIndex] === "?" || href[testingErrorsParamIndex] === "&")
    ) {
        throw new Error("This error is being thrown because isTestingErrors returned true.");
    }
}
