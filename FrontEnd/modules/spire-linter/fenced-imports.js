/* eslint-disable */
const fs = require("fs");
const path = require("path");

const validClientImports = [
    "color",
    "csstype",
    "embla-carousel",
    "exenv",
    "html-react-parser",
    "immer",
    "isomorphic-fetch",
    "js-cookie",
    "lodash",
    "@matt-block/react-recaptcha-v2",
    "react",
    "react-datetime-picker",
    "react-dom",
    "@react-google-maps",
    "react-redux",
    "redux",
    "redux-thunk",
    "styled-components",
    "tiny-warning",
    "qs",
    "url",
    "whatwg-fetch",
    "xlsx",
    "ismobilejs",
    "jsdom",
];
const validMobiusImports = [...validClientImports, "enzyme", "jest-styled-components"];
const validServerImports = [
    "connect",
    "crypto",
    "express",
    "form-data",
    "fs",
    "history",
    "http",
    "lodash",
    "path",
    "react",
    "set-cookie-parser",
    "styled-components",
    "qs",
    "util",
    "winston",
    "@optimizely/design-tokens/dist/brand-assets/brand-logo.svg",
];
const validShellImports = [
    "codemirror",
    "connected-react-router",
    "font-awesome",
    "froala-editor",
    "history",
    "@optimizely/design-tokens/dist/js/colors",
    "@optimizely/design-tokens/dist/js/typography",
    "@optimizely/design-tokens/dist/fonts/src/Inter-italic.var.woff2",
    "@optimizely/design-tokens/dist/fonts/src/Inter-roman.var.woff2",
    "@episerver/platform-navigation",
];
const allowedModules = {
    blueprints: [validClientImports, ["@insite/content-library", "@insite/client-framework", "@insite/mobius"]],
    "blueprints-shell": [
        validClientImports,
        ["@insite/content-library", "@insite/client-framework", "@insite/mobius", "@insite/shell-public"],
    ],
    "client-framework": [validClientImports, ["@insite/client-framework", "@insite/mobius"]],
    "content-library": [
        validClientImports,
        ["@insite/content-library", "@insite/client-framework", "@insite/mobius", "enzyme", "jest-styled-components"],
    ],
    mobius: [validMobiusImports, ["@insite/mobius"]],
    "server-framework": [
        validServerImports,
        [
            "@insite/server-framework",
            "@insite/client-framework",
            "@insite/content-library",
            "@insite/mobius",
            "@insite/shell",
        ],
    ],
    shell: [
        validClientImports,
        validShellImports,
        ["@insite/shell", "@insite/client-framework", "@insite/mobius", "@insite/shell-public"],
    ],
    "shell-public": [
        validClientImports,
        ["@insite/content-library", "@insite/client-framework", "@insite/mobius", "@insite/shell-public"],
    ],
};

let blueprints = undefined;
let blueprintsShell = undefined;

module.exports = {
    meta: {
        fixable: "code",
        messages: {
            importNotAllowed: "'{{module}}' import is not allowed.",
            importShouldUsePaths: "'{{module}}' import should be replaced by '{{importPathUsingPaths}}'",
        },
    },
    schema: [
        {
            type: "object",
            properties: {
                failRelativeImports: {
                    type: "boolean",
                    default: false,
                },
            },
            additionalProperties: false,
        },
    ],
    create(context) {
        const failRelativeImports = (context.options[0] || {}).failRelativeImports || false;
        const filename = context.getFilename().replace(/\\/g, "/");
        const directories = filename.split("/");
        const moduleType = directories[directories.indexOf("modules") + 1];
        const sourceCode = context.getSourceCode();

        if (directories.includes("modules")) {
            setupBlueprints();
        }

        function validImport(node) {
            const importSource = getImportSource(node);

            if (isAllowedImport(importSource)) {
                return;
            }

            let importPathUsingPaths = getImportPathUsingPaths(importSource);

            if (!importPathUsingPaths || !isAllowedImport(importPathUsingPaths)) {
                context.report({ node, messageId: "importNotAllowed", data: { module: importSource } });
                return;
            }

            if (failRelativeImports) {
                context.report({
                    node,
                    messageId: "importShouldUsePaths",
                    data: { module: importSource, importPathUsingPaths },
                    fix: function (fixer) {
                        return fixer.replaceText(
                            node,
                            sourceCode.getText(node).replace(importSource, importPathUsingPaths),
                        );
                    },
                });
            }

            if (isAllowedImport(importPathUsingPaths)) {
                return;
            }
        }

        function getImportSource(node) {
            if (node && node.source && node.source.value) {
                return node.source.value.trim();
            }

            return "";
        }

        function isAllowedImport(value) {
            for (const moduleList of allowedModules[moduleType]) {
                for (const possibleModule of moduleList) {
                    if (value.startsWith(possibleModule)) {
                        return true;
                    }
                }
            }
        }

        function getImportPathUsingPaths(importSource) {
            const resolvedImportPath = getResolvedPathOfImport(importSource);

            if (!resolvedImportPath) {
                return;
            }
            const splitFileThatExists = resolvedImportPath.split("/");
            let theModule = splitFileThatExists[splitFileThatExists.indexOf("modules") + 1];

            let importPathUsingPaths =
                theModule === "client-framework"
                    ? "@insite/client-framework"
                    : theModule === "content-library"
                    ? "@insite/content-library"
                    : theModule === "shell"
                    ? "@insite/shell"
                    : theModule === "shell-public"
                    ? "@insite/shell-public"
                    : theModule === "server-framework"
                    ? "@insite/server-framework"
                    : theModule === "mobius"
                    ? "@insite/mobius"
                    : undefined;

            if (theModule === "blueprints") {
                theModule = splitFileThatExists[splitFileThatExists.indexOf("blueprints") + 1];
                importPathUsingPaths = `@${theModule}`;
            }

            if (!importPathUsingPaths) {
                return;
            }

            importPathUsingPaths +=
                "/" +
                splitFileThatExists
                    .slice(splitFileThatExists.indexOf(theModule) + 2)
                    .join("/")
                    .replace(".tsx", "")
                    .replace(".ts", "");

            return importPathUsingPaths;
        }

        function getResolvedPathOfImport(importValue) {
            if (!importValue.startsWith(".")) {
                return;
            }

            return path.resolve(filename.substring(0, filename.lastIndexOf("/")), importValue).replace(/\\/g, "/");
        }

        function setupBlueprints() {
            if (blueprints) {
                return;
            }

            const rootDirectory = filename.substring(0, filename.indexOf("/modules"));
            const blueprintsDirectory = path.resolve(rootDirectory, "modules/blueprints");
            blueprints = getDirectories(blueprintsDirectory).map(o => `@${o}`);
            allowedModules["blueprints"].push(blueprints);

            const blueprintsShellDirectory = path.resolve(rootDirectory, "modules/blueprints-shell");
            blueprintsShell = getDirectories(blueprintsShellDirectory).map(o => `@${o}`);
            allowedModules["blueprints-shell"].push(blueprints);
            allowedModules["blueprints-shell"].push(blueprintsShell);
        }

        function getDirectories(source) {
            return fs
                .readdirSync(source, { withFileTypes: true })
                .filter(o => o.isDirectory())
                .map(o => o.name);
        }

        return {
            ImportDeclaration: validImport,
        };
    },
};
