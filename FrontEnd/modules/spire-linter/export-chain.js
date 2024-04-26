/* eslint-disable */
module.exports = {
    meta: {
        fixable: "code",
        messages: {
            exportChain: "Handler chains must be exported.",
        },
    },
    create(context) {
        const filename = context.getFilename().replace(/\\/g, "/");
        if (filename.indexOf("/modules/client-framework") === -1 || filename.indexOf("/Handlers/") === -1) {
            return {};
        }

        let exportedChain = false;
        let foundChain = false;

        return {
            VariableDeclarator(node) {
                if (node.id.name && node.id.name === "chain" && !exportedChain) {
                    foundChain = true;
                    context.report({
                        node,
                        messageId: "exportChain",
                        fix: function (fixer) {
                            return fixer.insertTextBefore(node.parent, "export ");
                        },
                    });
                }
            },
            ExportNamedDeclaration(node) {
                const { declaration } = node;
                if (!declaration || declaration.type !== "VariableDeclaration") {
                    return;
                }

                const id = declaration.declarations[0].id;
                if (id.name && id.name === "chain") {
                    exportedChain = true;
                }
            },
            // this seems a little fragile. This assumes the file is going to end with a default export
            ExportDefaultDeclaration(node) {
                if (!exportedChain && !foundChain) {
                    context.report({ node, messageId: "exportChain" });
                }
            },
        };
    },
};
