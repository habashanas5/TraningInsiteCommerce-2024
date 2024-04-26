/* eslint-disable */
const fs = require("fs");
const path = require("path");

module.exports = {
    meta: {
        fixable: "code",
        messages: {
            usePartialLodashImport: "{{sourceCode}} is importing the full lodash library.",
        },
    },
    create(context) {
        function validImport(node) {
            const importSource = getImportSource(node);

            if (importSource === "lodash") {
                const sourceCode = context.getSourceCode();

                const imports = node.specifiers
                    .map(o => `import ${o.imported.name} from "lodash/${o.imported.name}"`)
                    .join("\n");

                const nodeSourceCode = sourceCode.getText(node);

                context.report({
                    node,
                    messageId: "usePartialLodashImport",
                    data: { sourceCode: nodeSourceCode },
                    fix: function (fixer) {
                        return fixer.replaceText(node, imports);
                    },
                });
            }
        }

        function getImportSource(node) {
            if (node && node.source && node.source.value) {
                return node.source.value.trim();
            }

            return "";
        }

        return {
            ImportDeclaration: validImport,
        };
    },
};
