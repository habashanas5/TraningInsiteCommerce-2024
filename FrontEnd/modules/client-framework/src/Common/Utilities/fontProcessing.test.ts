import { Dictionary } from "@insite/client-framework/Common/Types";
import { getFontContent, loadAndParseFontCss } from "@insite/client-framework/Common/Utilities/fontProcessing";
// eslint-disable-next-line spire/fenced-imports
import { Request as ExpressRequest, Response as ExpressResponse } from "express";

const convertToBase64 = (str: string) => Buffer.from(str).toString("base64");

const cssFile = `
/* latin */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 600;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/opensans/v22/mem5YaGs126MiZpBA-UNirkOUuhp.woff2) format('woff2');
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
/* cyrillic-ext */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/opensans/v22/mem5YaGs126MiZpBA-UN7rgOX-hpOqc.woff2) format('woff2');
  unicode-range: U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F;
}
/* cyrillic */
@font-face {
  font-family: 'Open Sans';
  font-style: normal;
  font-weight: 700;
  font-display: swap;
  src: url(https://fonts.gstatic.com/s/opensans/v22/mem5YaGs126MiZpBA-UN7rgOVuhpOqc.woff2) format('woff2');
  unicode-range: U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116;
}`;

test("loadAndParseFontCss load and store fonts for specific user agent", async () => {
    global.fetch = jest.fn(() => Promise.resolve({ status: 200, text: () => Promise.resolve(cssFile) } as Response));

    const fontsUrl = "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800&display=swap";

    const path = await loadAndParseFontCss(fontsUrl, "Firefox");

    const headers: Dictionary<string> = {};
    headers["user-agent"] = "Firefox";

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(fontsUrl, {
        headers,
        method: "GET",
    });

    const base64EncodedUrl = convertToBase64(fontsUrl);
    const basePath = "/.spire/fonts/getFont?path=";
    const resultUrl = `${basePath}${base64EncodedUrl}`;

    expect(resultUrl).toBe(path);

    const cachedPath = await loadAndParseFontCss(fontsUrl, "Firefox");
    expect(fetch).toHaveBeenCalledTimes(1); // request is cached
    expect(resultUrl).toBe(cachedPath);
});

test("loadAndParseFontCss fails with 404", () => {
    global.fetch = jest.fn(() => Promise.resolve({ status: 404, text: () => Promise.resolve("") } as Response));

    const fontsUrl = "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800&display=swap";

    const test = async () => {
        await loadAndParseFontCss(fontsUrl, "Chrome");
    };

    expect(test).rejects.toThrow(`Failed to load font css for ${fontsUrl}`);
});

test("getFontContent should return modified css file", async () => {
    const fontsUrl = "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800&display=swap";

    const base64EncodedUrl = convertToBase64(fontsUrl);

    const headers: Dictionary<string> = {};
    headers["user-agent"] = "Firefox";

    const request: ExpressRequest = {
        query: { path: base64EncodedUrl },
        headers,
        method: "GET",
    } as ExpressRequest;

    const resultContentType = jest.fn((type: string) => {});
    const resultContent = jest.fn((content: string) => {});

    const response: ExpressResponse = {
        contentType: resultContentType as unknown,
        send: resultContent as unknown,
        statusCode: 200,
    } as ExpressResponse;

    const paths = [
        "https://fonts.gstatic.com/s/opensans/v22/mem5YaGs126MiZpBA-UNirkOUuhp.woff2",
        "https://fonts.gstatic.com/s/opensans/v22/mem5YaGs126MiZpBA-UN7rgOX-hpOqc.woff2",
        "https://fonts.gstatic.com/s/opensans/v22/mem5YaGs126MiZpBA-UN7rgOVuhpOqc.woff2",
    ];

    let expectedContent = cssFile;
    const basePath = "/.spire/fonts/getFont?path=";

    for (let i = 0; i < paths.length; ++i) {
        expectedContent = expectedContent.replace(paths[i], basePath + convertToBase64(paths[i]));
    }

    await getFontContent(request, response);

    expect(resultContentType).toHaveBeenCalledWith("text/css; charset=utf-8");
    expect(resultContent).toHaveBeenCalledWith(expectedContent);
    expect(response.statusCode).toBe(200);
});

test("getFontContent should return 404 if nothing cached for this user agent", async () => {
    const fontsUrl = "https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700,800&display=swap";

    const base64EncodedUrl = convertToBase64(fontsUrl);

    const headers: Dictionary<string> = {};
    headers["user-agent"] = "Edge";

    const request: ExpressRequest = {
        query: { path: base64EncodedUrl },
        headers,
        method: "GET",
    } as ExpressRequest;

    const resultContent = jest.fn((content: string) => {});

    const response: ExpressResponse = {
        send: resultContent as unknown,
        statusCode: 200,
    } as ExpressResponse;

    await getFontContent(request, response);

    expect(resultContent).toHaveBeenCalledWith(null);
    expect(response.statusCode).toBe(404);
});

test("getFontContent should load font file", async () => {
    const responseHeaders: Dictionary<string> = {};
    responseHeaders["content-type"] = "woff";
    global.fetch = jest.fn(() =>
        Promise.resolve({
            status: 200,
            headers: new Headers(responseHeaders),
            buffer: () => Promise.resolve("font"),
        } as any),
    );

    const fontUrl = "https://fonts.gstatic.com/s/opensans/v22/mem5YaGs126MiZpBA-UN7rgOX-hpOqc.woff2";
    const base64EncodedUrl = convertToBase64(fontUrl);

    const headers: Dictionary<string> = {};
    headers["user-agent"] = "Firefox";

    const request: ExpressRequest = {
        query: { path: base64EncodedUrl },
        headers,
        method: "GET",
    } as ExpressRequest;

    const resultContentType = jest.fn((type: string) => {});
    const resultContent = jest.fn((content: string) => {});

    const response: ExpressResponse = {
        contentType: resultContentType as unknown,
        send: resultContent as unknown,
        statusCode: 200,
    } as ExpressResponse;

    await getFontContent(request, response);

    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch).toHaveBeenCalledWith(fontUrl, {
        method: "GET",
    });

    expect(resultContentType).toHaveBeenCalledWith("woff");
    expect(resultContent).toHaveBeenCalledWith("font");
    expect(response.statusCode).toBe(200);

    await getFontContent(request, response);
    expect(fetch).toHaveBeenCalledTimes(1); // request is cached

    expect(resultContentType).toHaveBeenCalledWith("woff");
    expect(resultContent).toHaveBeenCalledWith("font");
    expect(response.statusCode).toBe(200);
});

test("getFontContent should return 404 when url is unknown", async () => {
    const fontUrl = "https://fonts.gstatic.com/hack.woff2";
    const base64EncodedUrl = convertToBase64(fontUrl);

    const headers: Dictionary<string> = {};
    headers["user-agent"] = "Firefox";

    const request: ExpressRequest = {
        query: { path: base64EncodedUrl },
        headers,
        method: "GET",
    } as ExpressRequest;

    const resultContent = jest.fn((content: string) => {});

    const response: ExpressResponse = {
        send: resultContent as unknown,
        statusCode: 200,
    } as ExpressResponse;

    await getFontContent(request, response);

    expect(resultContent).toHaveBeenCalledWith(null);
    expect(response.statusCode).toBe(404);
});
