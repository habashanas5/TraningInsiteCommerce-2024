/* eslint-disable */
module.exports = {
    meta: {
        messages: {
            exportStyles: "Styles must be exported.",
        },
    },
    create(context) {
        const filename = context.getFilename().replace(/\\/g, "/");
        if (
            filename.indexOf("/modules/content-library/src/Widgets") === -1 &&
            filename.indexOf("/modules/content-library/src/Components") === -1
        ) {
            return {};
        }

        let exportedStyles = false;
        let foundStyles = false;

        return {
            VariableDeclarator(node) {
                if (
                    node.id.name &&
                    node.id.name.endsWith("Styles") &&
                    node.id.typeAnnotation &&
                    node.id.typeAnnotation.typeAnnotation.typeName &&
                    node.id.typeAnnotation.typeAnnotation.typeName.name.endsWith("Styles") &&
                    !exportedStyles
                ) {
                    foundStyles = true;
                    context.report({ node, messageId: "exportStyles" });
                }
            },
            ExportNamedDeclaration(node) {
                const { declaration } = node;
                if (!declaration || declaration.type !== "VariableDeclaration") {
                    return;
                }

                const id = declaration.declarations[0].id;
                if (
                    id.name &&
                    id.name.endsWith("Styles") &&
                    id.typeAnnotation &&
                    id.typeAnnotation.typeAnnotation.typeName &&
                    id.typeAnnotation.typeAnnotation.typeName.name.endsWith("Styles")
                ) {
                    exportedStyles = true;
                }
            },
            // this seems a little fragile. This assumes the file is going to end with a default export
            ExportDefaultDeclaration(node) {
                if (!exportedStyles && !foundStyles) {
                    context.report({ node, messageId: "exportStyles" });
                }
            },
        };
    },
};
