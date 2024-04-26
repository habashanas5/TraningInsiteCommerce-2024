/* eslint-disable no-console */ // We're testing console output.
import logger from "@insite/client-framework/Logger";
import { setLoggerLevel } from "@insite/server-framework/Winston";

beforeEach(() => {
    global.console = {
        debug: jest.fn(),
        log: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    } as any;
});

const createTestRunner = (level: string | undefined, expectedLogCalls: number) => () => {
    process.env.ISC_WINSTON_LOG_LEVEL = level;
    setLoggerLevel();

    (["error", "warn", "log", "debug"] as const).forEach(value => logger[value](value));

    expect(console.log).toBeCalledTimes(expectedLogCalls);
};

["error", "warn", "info", "debug"].forEach((value, index) =>
    test(`Error level ${value} logs correctly.`, createTestRunner(value, index + 1)),
);
