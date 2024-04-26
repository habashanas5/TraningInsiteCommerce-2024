import { Dictionary } from "@insite/client-framework/Common/Types";
import logger from "@insite/client-framework/Logger";
import { Request, Response } from "express";
// eslint-disable-next-line spire/fenced-imports
import spireRoutes from "../../../config/spire_routes.json";

interface ApiMethod {
    (request: Request, response: Response): Promise<void>;
}

interface Relay {
    [endpoint: string]: ApiMethod;
}

// This code is always the first to access process.env.ISC_API_URL so it has to make sure it's right.
let ISC_API_URL = process.env.ISC_API_URL;
if (!ISC_API_URL) {
    logger.warn("ISC_API_URL environment variable not found, defaulting to http://localhost:3010/.");
    ISC_API_URL = process.env.ISC_API_URL = "http://localhost:3010/";
} else if (!ISC_API_URL.startsWith("http")) {
    logger.warn("ISC_API_URL doesn't start with `http`, prefixing with `https://`.");
    ISC_API_URL = process.env.ISC_API_URL = `https://${process.env.ISC_API_URL}`;
}

process.env.ISC_API_URL = ISC_API_URL = ISC_API_URL.trim();

logger.log(`Server-side API URL is ${ISC_API_URL}.`);

export async function relayRequest(request: Request, response: Response) {
    const headers: Dictionary<string> = {};

    for (const prop in request.headers) {
        // Naively forwarding all headers can conflict with Node/Express behavior.
        switch (prop.toLowerCase()) {
            case "host":
            case "origin":
            case "referer":
                continue;
        }

        const value = request.headers[prop];
        // Type here is string | string[] | undefined
        if (!value) {
            // Shouldn't happen with the for loop above but satisfies the type check for undefined.
            continue;
        }

        const singleValue = typeof value !== "string" ? value[0] : value;

        headers[prop] = singleValue;
    }

    headers["x-forwarded-host"] = request.get("host")!;
    // We want to forward the referer for advance partner scenarios
    headers["x-referer"] = request.get("referer")!;

    const url = `${ISC_API_URL}${request.originalUrl}`;
    logger.info(`Relaying ${request.method} ${request.originalUrl} to ${url}.`);

    const result = await fetch(url, {
        method: request.method,
        body: request.body,
        headers,
        redirect: "manual", // needed to allow punchout sessionrequest in 302 to work correctly
    });

    const body = await (result as any).buffer(); // Buffer is part of node-fetch but not standard fetch.

    response.status(result.status);

    if (result.status === 404 && request.originalUrl.toLowerCase().indexOf("/sitemap") === 0) {
        response.redirect("/NotFoundErrorPage");
        return;
    }

    const headersCollection: Dictionary<string[]> = {};

    result.headers.forEach((value: string, key: string) => {
        // Naively returning all headers can conflict with Node/Express behavior.
        switch (key.toLowerCase()) {
            case "content-encoding":
            case "content-length":
            case "content-type": // Handled later
            case "date":
            case "server":
            case "x-powered-by":
                return;
        }

        if (typeof headersCollection[key] === "undefined") {
            headersCollection[key] = [];
        }

        headersCollection[key].push(value);
    });

    for (const key in headersCollection) {
        response.setHeader(key, headersCollection[key]);
    }

    if (body.byteLength === 0) {
        response.end();
        return;
    }

    response.contentType(result.headers.get("Content-Type") || "application/octet-stream").send(body);
}

export function getRelayEndpoints() {
    return spireRoutes.commerce_routes;
}
