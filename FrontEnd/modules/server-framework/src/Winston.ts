import { LogFunction, setLogger } from "@insite/client-framework/Logger";
import winston, { createLogger } from "winston";

const options = {
    console: {
        handleExceptions: true,
        json: true,
        colorize: true,
    },
};

const logger = createLogger({
    transports: [new winston.transports.Console(options.console)],
    exitOnError: false, // do not exit on handled exceptions
});

function createLoggerForLevel(level: "debug" | "error" | "info" | "warn" | "verbose"): LogFunction {
    const levelLogger = logger[level].bind(logger);

    return (message, metadata) => {
        if (message instanceof Error) {
            levelLogger(message.message, { stack: message.stack, ...metadata });
            return;
        }

        if (typeof message === "string") {
            levelLogger(message, metadata);
            return;
        }

        if (typeof message === "object" && message) {
            if (metadata) {
                levelLogger({
                    ...message,
                    metadata,
                });
                return;
            }

            levelLogger(message);
            return;
        }

        if (message === null) {
            levelLogger("(Null)", metadata);
            return;
        }

        if (typeof message === "number" || typeof message === "boolean" || typeof message === "bigint") {
            levelLogger(message.toString(), metadata);
            return;
        }

        levelLogger(typeof message, metadata);
    };
}

/** Updates the Winston logging level from `process.env.ISC_WINSTON_LOG_LEVEL`. */
export function setLoggerLevel() {
    logger.level = process.env.ISC_WINSTON_LOG_LEVEL?.toLowerCase().trim() || (IS_PRODUCTION ? "info" : "debug");
}

if (IS_PRODUCTION || process.env.ISC_WINSTON_LOG_LEVEL?.trim()) {
    setLoggerLevel();

    setLogger({
        debug: createLoggerForLevel("debug"),
        error: createLoggerForLevel("error"),
        log: createLoggerForLevel("info"), // Winston's "log" function has a unique signature and is inappropriate for this.
        info: createLoggerForLevel("info"),
        warn: createLoggerForLevel("warn"),
    });
}
