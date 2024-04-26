/* eslint-disable */
const { resolve } = require("path");
const { RuleTester } = require("eslint");

module.exports = {
    getRuleTester(options) {
        RuleTester.it = function (text, method) {
            if (options && options.beforeEach) {
                options.beforeEach();
            }
            test(RuleTester.it.title + ": " + text, method);
            if (options && options.afterEach) {
                options.afterEach();
            }
        };

        return new RuleTester({
            parser: resolve("../../node_modules/@typescript-eslint/parser"),
            parserOptions: { sourceType: "module", ecmaVersion: 2015 },
        });
    },
};
