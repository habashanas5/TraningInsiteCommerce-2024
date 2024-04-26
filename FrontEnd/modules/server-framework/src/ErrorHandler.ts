import logger from "@insite/client-framework/Logger";
import { IncomingMessage } from "connect";
import { NextFunction } from "express";
import * as http from "http";
import { inspect } from "util";

export default function errorHandler(
    error: unknown,
    request: IncomingMessage,
    response: http.ServerResponse,
    next: NextFunction,
) {
    const string = stringify(error);
    logger.error(string);

    response.statusCode = 500;
    response.setHeader("Content-Type", "text/plain; charset=utf-8");
    response.end(string);
}

function stringify(value: any) {
    const stack = value.stack;

    if (stack) {
        return String(stack);
    }

    const string = String(value);

    return string === toString.call(value) ? inspect(value) : string;
}
