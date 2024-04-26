export type LogFunction = (message: unknown, metadata?: object) => void;

/** Baseline logging functionality compatible with the standard `console` and utilities like Winston. */
export type LogReceiver = Readonly<{
    /**
     * Sends a debug message to the configured log receiver.
     * @param message The message to retain--the receiver will adapt its behavior depending on the message type (`string` vs. `Error`, for example.)
     * @param metadata Additional information to associate with the message.
     */
    debug: LogFunction;
    /**
     * Sends an error to the configured log receiver.
     * @param message The message to retain--the receiver will adapt its behavior depending on the message type (`string` vs. `Error`, for example.)
     * @param metadata Additional information to associate with the message.
     */
    error: LogFunction;
    /**
     * Sends a generic message to the configured log receiver.
     * @param message The message to retain--the receiver will adapt its behavior depending on the message type (`string` vs. `Error`, for example.)
     * @param metadata Additional information to associate with the message.
     */
    log: LogFunction;
    /**
     * Sends an informational message to the configured log receiver.
     * @param message The message to retain--the receiver will adapt its behavior depending on the message type (`string` vs. `Error`, for example.)
     * @param metadata Additional information to associate with the message.
     */
    info: LogFunction;
    /**
     * Sends a warning to the configured log receiver.
     * @param message The message to retain--the receiver will adapt its behavior depending on the message type (`string` vs. `Error`, for example.)
     * @param metadata Additional information to associate with the message.
     */
    warn: LogFunction;
}>;

const consoleReceiver = (function createConsoleLogReceiver(): LogReceiver {
    function createLoggerForLevel(level: keyof LogReceiver): LogFunction {
        // eslint-disable-next-line no-console
        const levelLogger = console[level].bind(console);

        return (message, metadata) => {
            if (metadata) {
                levelLogger({
                    message,
                    metadata,
                });
            }

            levelLogger(message);
        };
    }

    return {
        debug: IS_PRODUCTION ? () => {} : createLoggerForLevel("debug"),
        error: createLoggerForLevel("error"),
        log: createLoggerForLevel("log"),
        info: createLoggerForLevel("info"),
        warn: createLoggerForLevel("warn"),
    };
})();

const logger = { ...consoleReceiver };

let hasSetLogger: true | undefined;

/** Allows a custom logger to be set once--a wrapper for `console` is used if nothing is provided. */
export function setLogger(value: LogReceiver) {
    if (hasSetLogger) {
        throw new Error("The logger has already been set.");
    }
    hasSetLogger = true;

    logger.debug = value.debug;
    logger.error = value.error;
    logger.log = value.log;
    logger.info = value.info;
    logger.warn = value.warn;
}

export default logger as LogReceiver; // LogReceiver's properties are read-only.
