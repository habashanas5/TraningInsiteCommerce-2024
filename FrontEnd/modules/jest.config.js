// @ts-check
const { pathsToModuleNameMapper } = require("ts-jest/utils");
const { compilerOptions } = require("../tsconfig.paths.json");

module.exports = {
    // preset: "ts-jest",
    preset: "ts-jest/presets/js-with-babel",
    globals: {
        IS_PRODUCTION: true,
        IS_SERVER_SIDE: false,
        "ts-jest": {
            tsconfig: "../tsconfig.base.json",
        },
    },
    setupFilesAfterEnv: ["./enzyme-setup.js"],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: "<rootDir>/" }),
    testPathIgnorePatterns: ["/node_modules/", "/mobius/", "/spire-linter/"],
};
