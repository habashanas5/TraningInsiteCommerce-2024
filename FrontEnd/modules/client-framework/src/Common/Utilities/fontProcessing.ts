import { Dictionary } from "@insite/client-framework/Common/Types";
// eslint-disable-next-line spire/fenced-imports
import { Request, Response } from "express";

// google fonts return different content vary by userAgent
const userAgentToStorageMap = new Map<string, StoragePosition>();
const fontCssStorage: Dictionary<Dictionary<string[]>> = {};
const fontsStorage: Dictionary<FontData | null> = {};

interface StoragePosition {
    length: number;
    index: number;
}

interface FontData {
    content: any;
    contentType: string | null;
}

// headers length is controlled by server and can be pretty big
const maxUserAgentLength = 1000;

// in case someone is using bot to create thousands of keys
const clearUserAgentLimit = 30000;

const trimUserAgent = (userAgent: string) => {
    return userAgent.length > maxUserAgentLength ? userAgent.substring(0, maxUserAgentLength) : userAgent;
};

export const loadAndParseFontCss = async (url: string, userAgent?: string) => {
    const headers: Dictionary<string> = {};
    if (userAgent) {
        headers["user-agent"] = trimUserAgent(userAgent);
    } else {
        userAgent = "empty";
    }

    const convertToBase64 = (str: string) => Buffer.from(str).toString("base64");

    const base64EncodedUrl = convertToBase64(url);
    const basePath = "/.spire/fonts/getFont?path=";
    const resultUrl = `${basePath}${base64EncodedUrl}`;
    const storageKey = userAgentToStorageMap.get(userAgent);
    if (storageKey !== undefined) {
        return resultUrl;
    }

    const requestInit: RequestInit = {
        method: "GET",
        headers,
    };

    const response = await fetch(url, requestInit);
    if (response.status === 200) {
        let body = await response.text();
        const regex = /src:\s+url\(([^\)]+)\)/g;
        let matches;
        const paths = [];
        let encodedPath;

        // eslint-disable-next-line no-cond-assign
        while ((matches = regex.exec(body)) !== null) {
            paths.push(matches[1]);
        }

        for (const path of paths) {
            encodedPath = convertToBase64(path);
            fontsStorage[encodedPath] = null;
            body = body.replace(path, `${basePath}${encodedPath}`);
        }

        if (!fontCssStorage[base64EncodedUrl]) {
            fontCssStorage[base64EncodedUrl] = {};
        }

        let index = -1;
        if (!fontCssStorage[base64EncodedUrl][body.length]) {
            fontCssStorage[base64EncodedUrl][body.length] = [body];
            index = 0;
        } else {
            const bodies = fontCssStorage[base64EncodedUrl][body.length];
            for (let i = 0; i < bodies.length; ++i) {
                if (bodies[i] === body) {
                    index = i;
                    break;
                }
            }
            if (index === -1) {
                index = bodies.length;
                bodies.push(body);
            }
        }

        if (userAgentToStorageMap.size === clearUserAgentLimit) {
            userAgentToStorageMap.clear();
        }

        userAgentToStorageMap.set(userAgent, { length: body.length, index });
    } else {
        throw Error(`Failed to load font css for ${url}`);
    }

    return resultUrl;
};

export const getFontContent = async (request: Request, response: Response) => {
    const { path } = request.query;
    const userAgent = trimUserAgent(request.headers["user-agent"] || "empty");

    const storageKey = userAgentToStorageMap.get(userAgent);
    if (
        storageKey !== undefined &&
        fontCssStorage[path] &&
        fontCssStorage[path][storageKey.length] &&
        storageKey.index < fontCssStorage[path][storageKey.length].length
    ) {
        response.contentType("text/css; charset=utf-8");
        response.send(fontCssStorage[path][storageKey.length][storageKey.index]);
        return;
    }

    if (fontsStorage[path] !== undefined) {
        const fontData = fontsStorage[path];
        if (fontData) {
            if (fontData.contentType) {
                response.contentType(fontData.contentType);
            }
            response.send(fontData.content);
            return;
        }

        const requestInit: RequestInit = {
            method: "GET",
        };

        const fontResponse = await fetch(Buffer.from(path, "base64").toString(), requestInit);
        if (fontResponse.status === 200) {
            const body = await (fontResponse as any).buffer(); // node-fetch
            const contentType = fontResponse.headers.get("content-type");
            fontsStorage[path] = {
                content: body,
                contentType,
            };
            if (contentType) {
                response.contentType(contentType);
            }
            response.send(body);
            return;
        }
    }

    response.statusCode = 404;
    response.send(null);
};
