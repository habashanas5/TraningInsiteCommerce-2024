/* eslint-disable */
const { getRuleTester } = require("./testHelper");
const rule = require("./fenced-imports");

const isWindows = process.platform === "win32";
const root = isWindows ? "c:" : "";

const options = {
    // theoretically this could be done using mock-fs, but I was unable to get it working
    beforeEach: function () {
        const fs = require("fs");
        const originalReaddirSync = fs.readdirSync;
        fs.readdirSync = jest.fn(function () {
            if (arguments[0].replace(/\\/g, "/").startsWith(`${root}/app/modules/blueprints`)) {
                return [
                    {
                        isDirectory: () => true,
                        name: "custom",
                    },
                ];
            }

            return originalReaddirSync(arguments);
        });
    },
    afterEach: function () {
        jest.clearAllMocks();
    },
};

getRuleTester(options).run("fenced-imports", rule, {
    valid: [
        getCode("import '@insite/client-framework/File';", "client-framework"),
        getCode("import '@insite/shell-public/File';", "shell-public"),
        getCode("import 'react';", "client-framework"),
        getCode("import 'express';", "server-framework"),
        getCode("import './File';", "shell"),
        getCode("import '../../shell/src/File';", "server-framework"),
        getCode("import '@custom/File';", "blueprints/custom"),
        getCode("import './File';", "blueprints/custom"),
    ],
    invalid: [
        getCode("import './File';", "client-framework", { failRelativeImports: true }, [
            { message: "'./File' import should be replaced by '@insite/client-framework/File'" },
        ]),
        getCode("import '@insite/shell/File';", "client-framework", [{ messageId: "importNotAllowed" }]),
        getCode("import '../../shell/File';", "client-framework", [{ messageId: "importNotAllowed" }]),
        getCode("import '../../shell/File';", "client-framework", { failRelativeImports: true }, [
            { messageId: "importNotAllowed" },
        ]),
        getCode("import './File';", "blueprints/custom", { failRelativeImports: true }, [
            { message: "'./File' import should be replaced by '@custom/File'" },
        ]),
        getCode("import './File';", "shell", { failRelativeImports: true }, [
            { message: "'./File' import should be replaced by '@insite/shell/File'" },
        ]),
        getCode("import '@insite/server-framework/File';", "client-framework", [{ messageId: "importNotAllowed" }]),
        getCode("import 'express';", "client-framework", [{ messageId: "importNotAllowed" }]),
    ],
});

function getCode(code, module, optionsOrErrors, errors) {
    const actualErrors = Array.isArray(optionsOrErrors) ? optionsOrErrors : errors;
    const options = optionsOrErrors && !Array.isArray(optionsOrErrors) ? [optionsOrErrors] : undefined;

    const result = {
        code,
        filename: `${root}/app/modules/${module}/src/Tester.tsx`,
        errors: actualErrors,
    };

    if (options) {
        result.options = options;
    }

    return result;
}
