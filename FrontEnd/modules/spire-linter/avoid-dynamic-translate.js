/* eslint-disable */
const fs = require("fs");
const path = require("path");

let translations = [];
let warnedAboutSkipping = false;

module.exports = {
    meta: {
        messages: {
            avoid: "Avoid passing dynamic values to translate.",
            avoidUnsupported: "Avoid passing dynamic values to translate (unsupported case)",
            unsupportedCasing:
                'Avoid mixing case with translate. The value "{{value}}" is already being translated with a different case.',
        },
    },
    schema: [
        {
            type: "object",
            properties: {
                generateTranslations: {
                    type: "boolean",
                    default: false,
                },
                ignoreDir: {
                    type: "array",
                    minItems: 0,
                },
                translationsLocation: {
                    type: "string",
                    default: undefined,
                },
            },
            additionalProperties: false,
        },
    ],
    create(context) {
        const { generateTranslations, translationsLocation, ignoreDir = [] } = context.options[0] || {};
        const filename = context.getFilename().replace(/\\/g, "/");
        const skip = ignoreDir.some(o => filename.indexOf(o) > -1);

        if (skip) {
            return {};
        }

        if (generateTranslations && !translationsLocation) {
            if (!warnedAboutSkipping) {
                warnedAboutSkipping = true;
                console.warn("translationsLocation was not supplied so translations may not be generated.");
            }
        }

        const writeTranslationsFileIfConfigured = () => {
            if (generateTranslations) {
                if (!translationsLocation) {
                    return;
                }
                const translationsFilePath = path.resolve(translationsLocation, "translations.csv");
                fs.mkdirSync(translationsLocation, { recursive: true });
                fs.writeFileSync(translationsFilePath, "", { encoding: "utf8" });
                const data = [...new Set(translations)].filter(o => o).sort(new Intl.Collator("en").compare);
                fs.appendFileSync(translationsFilePath, data.join("\r\n"), { encoding: "utf8" });
            }
        };

        return {
            "Program:exit"(_) {
                writeTranslationsFileIfConfigured();
            },
            CallExpression(node) {
                if (
                    !node.callee ||
                    node.callee.name !== "translate" ||
                    !node.arguments ||
                    node.arguments.length === 0
                ) {
                    return;
                }

                const argument = node.arguments[0];
                if (argument.type === "MemberExpression") {
                    const variable = findVariable(context.getScope(), argument.object.name);
                    if (variable && variable.defs[0].type === "EnumName") {
                        return;
                    }
                    context.report({ node, messageId: "avoid" });
                    return;
                }
                if (argument.type === "Identifier") {
                    const variable = findVariable(context.getScope(), argument.name);
                    const init = variable.defs[0].node.init;
                    if (!init) {
                        context.report({ node, messageId: "avoidUnsupported" });
                        return;
                    }
                    const isInitLiteral = isLiteral(init);
                    if (typeof isInitLiteral === "undefined") {
                        context.report({ node, messageId: "avoidUnsupported" });
                    } else if (!isInitLiteral) {
                        context.report({ node, messageId: "avoid" });
                    }
                }

                if (argument.value && containsStringDifferentByCasing(translations, argument.value)) {
                    context.report({ node, messageId: "unsupportedCasing", data: { value: argument.value } });
                    return;
                } else if (argument.value) {
                    translations.push(argument.value);
                }
            },
        };
    },
};

function isLiteral(value) {
    if (value.type === "Literal") {
        return true;
    }
    if (value.type === "ConditionalExpression") {
        return isLiteral(value.consequent) && isLiteral(value.alternate);
    }
    if (value.type === "BinaryExpression" || value.type === "LogicalExpression") {
        return isLiteral(value.left) && isLiteral(value.right);
    }
    if (value.type === "MemberExpression") {
        return isLiteral(value.object);
    }
    if (value.type === "Identifier") {
        if (value.name === "fields") {
            return false;
        }
        return;
    }

    // we are probably missing lots of cases here
    return;
}

function containsStringDifferentByCasing(translations, value) {
    const foundString = translations.find(a => a && a.toLowerCase() === value.toLowerCase());
    return !!foundString && value !== foundString;
}

function findVariable(scope, variableName) {
    let variable = undefined;
    while (typeof variable === "undefined" && scope) {
        variable = scope.set.get(variableName);
        scope = scope.upper;
    }

    return variable;
}
