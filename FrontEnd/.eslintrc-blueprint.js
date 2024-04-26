const path = require("path");

module.exports = {
    root: true,
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: 6,
        sourceType: "module",
        ecmaFeatures: {
            "jsx": true,
        }
    },
    plugins: ["@typescript-eslint", "spire", "react"],
    settings: {
        react: {
            pragma: "React",
            version: "16.10",
        },
    },
    rules: {
        "spire/fenced-imports": ["error", { failRelativeImports: false }],
        "spire/restrict-lodash-import": "error",
        "spire/avoid-dynamic-translate": [
            "warn",
            {
                generateTranslations: true,
                ignoreDir: [
                    "/modules/mobius",
                    "/modules/mobius-styleguide",
                    "/modules/server-framework",
                    "/modules/shell",
                    "/modules/shell-public",
                    "/modules/spire-linter",
                    "/modules/test"
                ],
                translationsLocation: path.resolve(__dirname, "wwwroot/AppData")
            }
        ],
    },
};
